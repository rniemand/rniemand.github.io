---
title: Installing MQTT on Ubuntu
date: 2019-11-04 18:00:00 -0600
categories: [iot]
tags: [ubuntu,mqtt,mosquitto]
toc: true
---

> **Hi there**! This post is [part of a series](https://www.richardn.ca/series/#home-server-revamp-2019) I am doing where I attempt to move most of the applications I use at home over to Linux. If you find this interesting you may enjoy the other posts too!
{: .prompt-tip }

Today I am going to be covering installing and configuring `mosquitto` (a pretty common MQTT client) on Ubuntu. I make use of MQTT a lot when it comes to my home automation as it's a lightweight protocol that can easily run on devices with limited memory (like an ESP8266).

## Installation
If you haven't already you will need to add the mosquitto ppa to apt using the following command:

```shell
sudo apt-add-repository ppa:mosquitto-dev/mosquitto-ppa
```

Once added you can install mosquitto using the following:

```shell
sudo apt-get update && sudo apt-get install -y mosquitto
```

Once installed you can verify if mosquitto is running through the following command:

```shell
systemctl status mosquitto.service
```

## General Configuration
If you want to add custom configuration to mosquitto you will need to create a configuration file called `/etc/mosquitto/conf.d/mosquitto.conf` (as it does not exist by default), we can create or edit this file using the following command:

```shell
sudo nano /etc/mosquitto/conf.d/mosquitto.conf
```

Generally the only configuration I use for mosquitto is disabling anonymous logins and specifying a path to the services' password file. The entirety of my configuration file looks like this:

```
allow_anonymous false
password_file /etc/mosquitto/conf.d/passwd
```

## Adding our FIRST user
> **Note**: if you are wanting to add an additional user to mosquitto please refer to the next section, this section is for creating the initial password file and user. Running this command again will overwrite all existing users!
{: .prompt-tip }

To add our first user to mosquitto we will need to create our password file (specified by the `password_file` configuration value above). We can create a new password file and add our first user at the same time by using the following command:

```shell
sudo mosquitto_passwd -c /etc/mosquitto/conf.d/passwd <username>
```

Once done, simply restart mosquitto to enable the new account.

```shell
sudo systemctl restart mosquitto
```

## Adding additional users
To add additional users to mosquitto we can run the below command (note that we omit the -c switch this time as we are not wanting to create a password file).

```shell
sudo mosquitto_passwd /etc/mosquitto/conf.d/passwd <username>
```

You can run this command as many times as you need, and it will keep appending the users to the end of your password file.

To enable any added user account we will need to restart mosquitto:

```shell
sudo systemctl restart mosquitto
```

## Useful Links
That's pretty much all there is to installing mosquitto on Ubuntu, hopefully this saved you some time.

Below are some helpful links to make working with MQTT a lot easier:

- [MQTT Explorer](https://mqtt-explorer.com/) - an awesome cross-platform MQTT client
- [Official Mosquitto Website](https://mosquitto.org/) - has a lot of documentation
- [Hive.MQ](https://www.hivemq.com/) - good resource for MQTT, has an awesome browser based client for quick testing.

Please feel free to leave any comments and suggestions below as I am always looking for ways to improve my posts.
