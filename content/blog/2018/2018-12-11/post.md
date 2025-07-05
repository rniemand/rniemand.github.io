---
title: Automating .Net Core 2.x App NuGet Deployment with AppVeyor
date: 2018-12-11
tags: [ci-cd,appveyor]
logo: appveyor.png
---

In this post I am going to cover getting one of my `.net core` projects built in [AppVeyor](https://www.appveyor.com/) and automatically publishing to NuGet on a successful build.

## Project structure
As it stands my project currently looks like this:

<img src="./001.png" alt="" />

I have the main project (`Rn.Common`) that I wish to publish to NuGet, and a test project (`Rn.CommonTests`) that will be run before the publication to ensure nothing breaks between commits.

Lastly, I only want to run the automated build \ publish flow when code is pushed into the master branch only, as I normally use this as a release branch.

I originally had this working with the `.net framework` but it was obviously not compatible with `.net core`. After a couple of hours messing about, I managed to get everything working as I wanted, below is the process I followed.

### Generate a NuGet deployment key
First I headed over to [NuGet.org](https://www.nuget.org/) and generated a deployment key to use with AppVeyor:

<img src="./002.png" alt="" />

Be sure to save this key in a safe place and do not expose it publicly.

### Configure AppVeyor
Once we have the deployment key we will need to make a couple of changes to our AppVeyor project to support .net core - I already had an existing project to modify, but if you don't have one, now would be the time to create it.

Under the Settings page for your project navigate to the General section and ensure that `.NET Core .csproj patching` has been enabled (as shown below):

<img src="./003.png" alt="" />

Then navigate to the Environment section and create a new environment key called `NUGET_API_KEY` (or whatever you prefer) and place in your key from step (1) for its value. This way we do not need to place this key in our build script, keeping it nice and safe.

<img src="./004.png" alt="" />

That's it for the AppVeyor web configuration.

### Create an appveyor.yml file
Next you will need to create an appveyor.yml` file in the root of your repository with the following content:

```yaml
version: 1.0.{build}
image: Visual Studio 2017
branches:
  only:
  - master
init:
  # Good practice, because Windows line endings are different from Unix/Linux ones
  - cmd: git config --global core.autocrlf true
build_script:
  - ps: ./build/package.ps1
```

Here we do the following key things:

- We set the build environment to `Visual Studio 2017` (required for .net core)
- We limit the build to only trigger on the master branch
- We call the `./build/package.ps1` to do all the heavy lifting

That's it for my `appveyor.yml` file.

### Create a build script
After a lot of trial and error with the appveyor.yml file I decided to use PowerShell as my main build script due to some road blocks I was getting with the yml limitations. The below is what I came up with, I will run through the main parts of the script quickly.

The first thing I do is grab the build folder and build number from the available [AppVeyor variables](https://www.appveyor.com/docs/environment-variables/):

```powershell
# Script static variables
$buildDir = $env:APPVEYOR_BUILD_FOLDER # e.g. C:\projects\rn-common\
$buildNumber = $env:APPVEYOR_BUILD_VERSION # e.g. 1.0.17
```

Next, I define all the folders I will be working with using full paths wherever I can:

```powershell
$projectDir = $buildDir + "\src\Rn.Common";
$projectFile = $projectDir + "\Rn.Common.csproj";
$testDir = $buildDir + "\src\Rn.CommonTests";
$nugetFile = $projectDir + "\Rn.Common." + $buildNumber + ".nupkg";
```

I print out the installed .net core version to make troubleshooting easier:

```powershell
# Display .Net Core version
Write-Host "Checking .NET Core version" -ForegroundColor Green
& dotnet --version
```

<img src="./005.png" alt="" />

Next, I navigate to the project directory and run a restore:

```powershell
# Restore the main project
Write-Host "Restoring project" -ForegroundColor Green
& dotnet restore $projectFile --verbosity m
```

<img src="./006.png" alt="" />

The run a publish to generate the project binaries:

```powershell
# Publish the project
Write-Host "Publishing project" -ForegroundColor Green
& dotnet publish $projectFile
```

<img src="./007.png" alt="" />

Next, I navigate to the test folder and run my tests:

```powershell
# Discover and run tests
Write-Host "Running tests" -ForegroundColor Green
cd $testDir
& dotnet restore Rn.CommonTests.csproj --verbosity m
$testOutput = & dotnet test | Out-String
Write-Host $testOutput
```

<img src="./008.png" alt="" />

I capture the output of the tests and ensure that they passed with the below check - should the tests fail I will Exit the build script:

```powershell
# Ensure that the tests passed
if ($testOutput.Contains("Test Run Successful.") -eq $False) {
  Write-Host "Build failed!";
  Exit;
}
```

<img src="./009.png" alt="" />

Next, I call dotnet pack to generate a NuGet package for my project using the settings defined in Visual Studio.

```powershell
# Generate a NuGet package for publishing
Write-Host "Generating NuGet Package" -ForegroundColor Green
cd $projectDir
& dotnet pack -c Release /p:PackageVersion=$buildNumber -o $projectDir
```

<img src="./010.png" alt="" />

Once that has completed, I add the generated NuGet file to AppVeyors build artefacts:

```powershell
# Save generated artifacts
Write-Host "Saving Artifacts" -ForegroundColor Green
Push-AppveyorArtifact $nugetFile
```

<img src="./011.png" alt="" />

The last thing left to do it publish the package to NuGet using our API key defined earlier and referencing the package built above:

```powershell
# Publish package to NuGet
Write-Host "Publishing NuGet package" -ForegroundColor Green
& nuget push $nugetFile -ApiKey $env:NUGET_API_KEY -Source https://www.nuget.org/api/v2/package
```

<img src="./012.png" alt="" />

```powershell
# Done
Write-Host "Done!" -ForegroundColor Green
```

This results in a new version of the Rn.Common package being deployed to NuGet as can be seen below.

<img src="./013.png" alt="" />

## Final Thoughts
This is by no way the best solution to automating the build process, however it does what I need it to do. There are some limitations with AppVeyor now, with the biggest one being that they don't support .net core 2.2 at time of writing.

I welcome feedback, comments and suggestions!
