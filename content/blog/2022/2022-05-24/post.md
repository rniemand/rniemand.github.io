---
title: Portainer Cheat Sheet
date: 2022-05-24
tags: [portainer]
logo: portainer.png
---

Below is a quick cheat sheet for getting up and running with [Portainer](https://www.portainer.io/), generally I make use of [Unraid](https://unraid.net/) for running my [Docker](https://www.docker.com/products/docker-desktop/) containers however when it comes to running [Z-Wave JS](https://github.com/zwave-js) I needed to run it on another computer that had a free USB port :)

## Starting the container
```shell
sudo docker run -d -p 8000:8000 -p 9443:9443 --force-create --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce
```

## Stopping the container
```shell
sudo docker container stop portainer
```

## Removing the container
```shell
sudo docker container rm portainer
```
