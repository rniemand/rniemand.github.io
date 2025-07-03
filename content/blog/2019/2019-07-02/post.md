---
title: Installing Grafana on Ubuntu
date: 2019-07-02
#categories: [monitoring]
#tags: [ubuntu,grafana]
#toc: true
---

> **Hi there**! This post is [part of a series](https://www.richardn.ca/series/#home-server-revamp-2019) I am doing where I attempt to move most of the applications I use at home over to Linux. If you find this interesting you may enjoy the other posts too!
{: .prompt-tip }

Once you have a running instance of [InfluxDB](https://www.richardn.ca/posts/InstallingInfluxDBOnUbuntu/) being populated with that sweet, sweet [Telegraf](https://www.richardn.ca/posts/InstallingTelegrafOnUbuntu/) data, you are going to need a way to visualise it all, this is where [Grafana](https://grafana.com/) comes in. Grafana is by far one of the best dash-boarding systems out there and is simple to use.

In this post I will cover the steps needed to get Grafana up and running on your Ubuntu Server installation, let's dive in.

## Dependencies
Before you begin it is a good idea to make sure that you have the latest version of libfontconfig1 installed as my initial installation failed as it was missing on my system, installation is as simple as running:

```shell
sudo apt-get install -y libfontconfig1
```

Should you run into an error with the above you can run the below command (if the above succeeded you can skip this command):

```shell
sudo apt --fix-broken install
```

## Download and Install
Next, you will need to grab the appropriate installation package from [the official Grafana release page](https://grafana.com/grafana/download), in my case this was `grafana_6.2.2_amd64.deb`. Log onto your server and download the installation package using wget:

```shell
wget https://dl.grafana.com/oss/release/grafana_6.2.2_amd64.deb
```

Once downloaded you can install it with the command below:

```shell
sudo dpkg -i grafana_6.2.2_amd64.deb
```

After the installation has completed you can remove the package from your system as you no longer need it:

```shell
sudo rm -f grafana_6.2.2_amd64.deb
```

## Configuration
The main Grafana configuration file live in /etc/grafana/grafana.ini and you can edit it with your favourite bash editor:

```shell
sudo nano /etc/grafana/grafana.ini
```

The only real configuration changes I make are shown below, this is mainly binding to `0.0.0.0` and ensuring that the default port is set to `3000`.

```ini
[server]
http_addr = 0.0.0.0
http_port = 3000
```

There are loads more configuration options to play around with, but as stated above these are the ones I most often mess around with.

## Creating a Service
You can enable the Grafana service with the following commands:

```shell
sudo systemctl enable grafana-server
sudo systemctl daemon-reload
```

You can start and stop Grafana with the following commands:

```shell
sudo systemctl start grafana-server
sudo systemctl stop grafana-server
```

Querying the status of Grafana is as simple as:

```shell
sudo systemctl status grafana-server
```

## First Time Configuration
Provided you left the default port unchanged, you should be able to connect to Grafana on `http://<server_ip>:3000/`, in my case that would be: `http://10.0.0.51:3000`

You should be greeted with the following login screen.

<img src="./001.png" alt="">

Login using `admin` with default password `admin` (you will be prompted to change it on login).

Congratulations, you now have a working Grafana instance!
