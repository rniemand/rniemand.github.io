---
title: Setting Date and Time (Ubuntu)
date: 2019-06-13
tags: [homelab]
---

> **Hi there**! This post is [part of a series](https://www.richardn.ca/series/#home-server-revamp-2019) I am doing where I attempt to move most of the applications I use at home over to Linux. If you find this interesting you may enjoy the other posts too!
{: .prompt-tip }

The first thing I do with any new system installation is ensure that the correct date, time and timezone is configured. I ran into an issue a while back when working on an old image of [DietPi](https://dietpi.com/) and was not able to update packages, long story short the system's date was about a year out and causing SSL certificates to become invalid.

Needless to say this has now become one of the first things I do when setting up a new system. In Ubuntu setting the date / time is as easy as running the below command:

```shell
$ sudo dpkg-reconfigure tzdata
```

Just follow the on-screen prompts to configure everything (and if possible reboot your system afterwards) - that's all there is to it.
