---
title: Using Certificates with ASP.Net Core under Docker
date: 2024-07-31
tags: [blog,docker]
text: Hello World
#banner: blue.png
logo: docker.png
---

This post serves as a quick reference guide to getting custom certificates working for a Docker based asp.net core application.

## Obtaining the certificate

Depending on your use case this could be as simple as using something like [LetsEncrypt](https://letsencrypt.org/) for a free certificate, or using a paid for service like [ssl.com](https://www.ssls.com/) to buy a custom certificate.

### Converting your certificate to \*.pfx

For my project I went with the paid path and bought one for my application which resulted in me receiving a `.crt` file along with a key file which was incompatible with asp.net as it requires a `.pfx` file. After some quick Googling I was able to convert my certificate to the required pfx format by running the following command on one of my Ubuntu servers.

```bash
openssl pkcs12 -export -out mycert.ca.pfx -inkey mycert.ca_key.txt -in mycert.ca.crt
```

Hopefully this saves you some time in the future.

## Configuring your Docker container

With some trial and error I managed to come up with the following Docker configuration that works with my application:

### Port Bindings

You will need to expose and map any of the container ports you wish to access on the host - generally with asp.net applications you will want to map ports 80 (for HTTP) and 443 (for HTTPS), I ended up with the following configuration:

- Container 443 -> Host 5005 (TCP)
  - Will be used to serve the HTTPS variant of the application
  - I was already using port 443 on the host hence the odd port mapping chosen
- Container 80 -> Host 5003 (TCP)
  - Will be used to serve the HTTP variant of the application
  - Again I was already using port 80 on the host so remapped mine to 5003

### Container Paths

You will also need to map some additional paths for your container:

- `/https/aspnetapp.pfx` -> `/mnt/user/Backups/app-data/nas-landing-page/mysite.ca.pfx`
  - Points `/https/aspnetapp.pfx` on the container to the physical certificate on the host
- `/root/.aspnet` -> `/mnt/user/Backups/app-data/nas-landing-page/.aspnet/`
  - Maps a persistent path to store your applications `DataProtection-Keys`

### Container Variables

The last piece of the puzzle is defining some configuration environment variables for your container to tell asp.net core where to look for the certificate file, what ports to use for HTTP and so on:

- `ASPNETCORE_URLS` -> `https://+;http://+`
  - Configures asp.net core to make use of HTTP and HTTPS
- `ASPNETCORE_HTTPS_PORT` -> `5005`
  - Tells asp.net core which external port the host will be using for HTTPS
  - Please note that this has been set to 5005 as per the port mappings above
- `ASPNETCORE_Kestrel\_\_Certificates\_\_Default\_\_Password` -> `xxx`
  - Defines the password to use with the provided certificate
  - This is the password you set when creating the `*.pfx` certificate
- `ASPNETCORE_Kestrel\_\_Certificates\_\_Default\_\_Path` -> `/https/aspnetapp.pfx`
  - Path to the certificate to use
  - This is the path set in the container paths section above

### Sample Docker Run Command

Below is a sample Docker run command for a fictitious **dockeruser/container** container with the above configuration:

```bash
docker run
  -d
  --name='Container'
  --net='bridge'
  -e TZ="America/Edmonton"
  -e 'ASPNETCORE_URLS'='https://+;http://+'
  -e 'ASPNETCORE_HTTPS_PORT'='5005'
  -e 'ASPNETCORE_Kestrel__Certificates__Default__Password'='xxx'
  -e 'ASPNETCORE_Kestrel__Certificates__Default__Path'='/https/aspnetapp.pfx'
  -p '5003:80/tcp'
  -p '5005:443/tcp'
  -v '/…/mysite.ca.pfx':'/https/aspnetapp.pfx':'rw'
  -v '/…/.aspnet/':'/root/.aspnet':'rw'
'dockeruser/container’
```

After deployment you should be able to browse to your application on HTTPS and get served a valid certificate.
