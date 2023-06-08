---
title: Upgrading Home Assistant on DietPi
date: 2018-02-15 18:00:00 -0600
categories: [home assistant]
tags: [dietpi]
toc: true
---

This is a quick post on how to update [Home Assistant](https://www.home-assistant.io/) running on [DietPi](https://dietpi.com/) or any other `Debian` build of Linux (e.g. `Raspbian`).

## Stop Home Assistant
```
systemctl stop home-assistant@homeassistant.service
```

## Switch to the homeassistant user context
If you installed Home Assistant using their [installation method](https://www.home-assistant.io/installation) chances are you would have installed HASS under a new user context called `homeassistant`, the below commands will switch you into that context in order to perform the upgrade.

```
sudo su homeassistant -s /bin/bash
source /srv/homeassistant/bin/activate
```

## Upgrade Home Assistant
```
pip3 install --upgrade homeassistant
```

![](/assets/img/2018/2018-02-15/001.png)

## Exiting the homeassistant context
To switch back to your original user context run the below command.

```
exit
```

## Starting Home Assistant
```
systemctl start home-assistant@homeassistant.service
```

## All Done :)
That's it - you can now enjoy the latest features!

As always comments / feedback is always welcome.

![](/assets/img/2018/2018-02-15/002.png)

