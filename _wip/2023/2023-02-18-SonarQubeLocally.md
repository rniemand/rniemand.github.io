---
title: 'SonarQube Locally'
date: 2023-02-17 07:00:00 -0600
categories: []
tags: []
toc: true
---

In this post I will cover the process needed to get [SonarQube](https://www.sonarsource.com/products/sonarqube/) analysis running for your applications.

## Requirements

### JRE
For this to work you will need to have [JRE](https://www.oracle.com/ca-en/java/technologies/downloads/) installed and setup locally on your development machine.

In my case I am using the `x64 MSI Installer` which defaulted the installation folder to `C:\Program Files\Java\jre1.8.0_361\bin`.

You will need to add a new **System Variable** called `JAVA_HOME` pointing to this location as shown below:

![](/assets/img/2023/2023-02-18/001.png)
_Adding **JAVA_HOME** Environment variable_

Once done, you can confirm that JAVA installed correctly by simply running the following command in a **new** command prompt window:

```shell
java -version
```

You should be greeted with output similar to the below:

```text
java version "19.0.2" 2023-01-17
Java(TM) SE Runtime Environment (build 19.0.2+7-44)
Java HotSpot(TM) 64-Bit Server VM (build 19.0.2+7-44, mixed mode, sharing)
```

### dotnet-sonarscanner
Another requirement is the `dotnet-sonarscanner` dotnet tool, which can be installed using the following command:

```shell
dotnet tool install --global dotnet-sonarscanner
```

## Helper Scripts
Next you will need to add the following helper scripts to your project - personally I like to add these scripts to my `.github` directory to keep all my build scripts together.

### SonarQube.ps1
Create a new script called `SonarQube.ps1` in your preferred firectory with the below contents:

This script is responsible for bootstrapping the `sonarscanner` plugin, running your build and test scripts, and finally submitting the collected data back to your **SonarQube** server using the `URL` and `token` provided through the script parameters.

```powershell
param (
  [Parameter(Mandatory=$false)]
  [string] $project = "App.Dir.Name.Here",
  [Parameter(Mandatory=$false)]
  [string] $sqUrl = "http://localhost:9000",
  [Parameter(Mandatory=$true)]
  [string] $sqToken
)

$rootDir        = $PSScriptRoot;
$artifactsDir 	= [IO.Path]::GetFullPath((Join-Path $rootDir "../artifacts/"));
$coverageDir	  = [IO.Path]::GetFullPath((Join-Path $artifactsDir "test-coverage/"));
$sqReportPaths  = ($coverageDir + "**/coverage.opencover.xml");

dotnet sonarscanner begin /k:$project /d:sonar.host.url=$sqUrl  /d:sonar.login=$sqToken /d:sonar.cs.opencover.reportsPaths=$sqReportPaths
./ci-test.ps1
dotnet sonarscanner end /d:sonar.login=$sqToken
```

### ci-test.ps1
Next create a file called `ci-test.ps1` in the same directory as `SonarQube.ps1` with the below contents:

This script preforms the following actions:

- Removes any previous run artifacts (in case you are running this on your local machine)
- Installes `coverlet` and `reportgenerator`
- Searches for any `.csproj` files matching the provided `$testCsprojPattern` pattern
- Builds, tests and covers any matching test projects
- Runs `reportgenerator` on the generated `coverlet` reports
- Bundles everything into the configured `$publishDir` for easy collection by `SonarQube.ps1`

This script may be clumbsy, but it works for me...

```powershell
param (
  [Parameter(Mandatory=$false)]
  [string] $rootDir = $PSScriptRoot,
  [Parameter(Mandatory=$false)]
  [string] $testCsprojPattern = "*Tests.csproj",
  [Parameter(Mandatory=$false)]
  [string] $configuration = "Release",
  [Parameter(Mandatory=$false)]
  [string] $frameworkVersion = "net6.0"
)

$rootDir               = [IO.Path]::GetFullPath((Join-Path $rootDir "\..\"));
$sourceDir             = Join-Path $rootDir "tests\";
$publishDir            = Join-Path $rootDir "artifacts\";
$toolsDir              = Join-Path $rootDir "tools\";
$testPublishDir        = Join-Path $publishDir "test-publish\";
$testResultsDir        = Join-Path $publishDir "test-results\";
$testCoverageDir       = Join-Path $publishDir "test-coverage\";
$reportgenOutDir       = Join-Path $testCoverageDir "reports\";
$coverletExe           = Join-Path $toolsDir "coverlet.exe";
$reportGeneratorExe    = Join-Path $toolsDir "reportgenerator.exe"

# =======================================================
# Cleanup
# =======================================================
#
$cleanupDirectories = @();
$cleanupDirectories += $testPublishDir;
$cleanupDirectories += $testCoverageDir;
$cleanupDirectories += $testResultsDir;

foreach ($cleanupDirectory in $cleanupDirectories) {
  if (Test-Path $cleanupDirectory) {
    Remove-item $cleanupDirectory -Recurse -Force | Out-Null;
  }
}

# =======================================================
# Install tooling
# =======================================================
#
$installCmd = "";

if(!(Test-Path $coverletExe)) {
  Write-Host "Installing: coverlet.console"
  $installCmd = "dotnet tool install coverlet.console --tool-path $toolsDir";
  Invoke-Expression -Command $installCmd -ErrorAction 'Continue';
}

if(!(Test-Path $reportGeneratorExe)) {
  Write-Host "Installing: reportgenerator.exe"
  $installCmd = "dotnet tool install dotnet-reportgenerator-globaltool --tool-path `"$toolsDir`"";
  Invoke-Expression -Command $installCmd -ErrorAction 'Continue';
}

# =======================================================
# Discover and Build test projects
# =======================================================
#
$testProjects = Get-ChildItem -Path $sourceDir -Include $testCsprojPattern -Recurse -File;

if ($testProjects.count -eq 0) {
  throw "No files matched the $testCsprojPattern pattern. The script cannot continue."
}

Write-Output ("Found " + $testProjects.count + " test project(s) to build and run");
foreach ($testProject in $testProjects) {
  # ---------------------------------------------------- >>
  # Generate required paths
  $dllFileName         = $testProject.BaseName + ".dll";
  $testSrcDir          = Join-Path $testProject.Directory.FullName "\";
  $testBinDir          = Join-Path $testSrcDir "bin\";
  $testBinConfigDir    = Join-Path $testBinDir ($configuration + "\");
  $testFrameworkDir    = Join-Path $testBinConfigDir ($frameworkVersion + "\");
  $testDllFile         = Join-Path $testFrameworkDir $dllFileName;
  $csprojFullPath      = $testProject.FullName;

  # ---------------------------------------------------- >>
  # Restore and build the project
  $buildCmd = "dotnet build `"$csprojFullPath`" --configuration $configuration";
  Write-Output ("(INFO) Building test project :: $buildCmd");
  Invoke-Expression $buildCmd;

  # Ensure that the expected test DLL file exists
  if(!(Test-Path -Path $testDllFile)) {
    throw "Unable to find test DLL file - $testDllFile";
  }

  # ---------------------------------------------------- >>
  # Generate coverage report
  $testResultFileName   = Join-Path $testResultsDir "$( $testProject.BaseName )_results.trx";
  $coverageOutputDir    = Join-Path $testCoverageDir ($testProject.BaseName + "\");

  # https://docs.microsoft.com/en-us/dotnet/core/tools/dotnet-test
  $dotnetTestTargetArgs = @(
    "test",
    "$( $testProject.FullName )",
    "--logger:trx;LogFileName=$testResultFileName",
    "--configuration $configuration",
    "--no-build",
    "--no-restore"
  );

  # https://www.jetbrains.com/help/dotcover/dotCover__Console_Runner_Commands.html
  $coverletDotnetArguments = @(
    "$testDllFile",
    "--target `"dotnet`"",
    "--targetargs `"$dotnetTestTargetArgs`"",
    "--output `"$coverageOutputDir`"",
    "--format `"cobertura`"",
    "--format `"opencover`""
  );

  $coverletCmd = "$coverletExe $coverletDotnetArguments";
  Write-Output ("Running coverage :: $coverletCmd");
  Invoke-Expression -Command $coverletCmd;
}

# =======================================================
# Generate coverage reports
# =======================================================
#
$coberturaFiles = ((Get-ChildItem -Path $testCoverageDir -Include "*.cobertura.xml" -Recurse -File).FullName) -Join ";";

$reportgenArgs = @(
  "-reports:$coberturaFiles",
  "-targetdir:$reportgenOutDir",
  "-reporttypes:Html"
);

$reportgenCommand = "$reportGeneratorExe $reportgenArgs";
Write-Output ("Running reportgenerator :: $reportgenCommand");
Invoke-Expression -Command $reportgenCommand;
```

## Running it all
Holder

```shell
cd my-app
.\sonarqube.ps1 -sqUrl "http://192.168.0.60:9000" -sqToken "..."
```

![](/assets/img/2023/2023-02-18/002.png)
_Output from a working build_

