---
title: Installing MariaDB (MySQL) on Ubuntu
date: 2019-06-15
tags: [database,mariadb,mysql]
---

> **Hi there**! This post is [part of a series](https://www.richardn.ca/series/#home-server-revamp-2019) I am doing where I attempt to move most of the applications I use at home over to Linux. If you find this interesting you may enjoy the other posts too!
{: .prompt-tip }

This post covers the basics of installing MariaDB (an alternative to MySQL) on Ubuntu Server in an hopefully easy to follow format. I have broken the process up into smaller sections to make following along a lot easier.

## Installation
The first thing you will need to do is ensure that your server is up to date using the following command:

```shell
$ sudo apt-get update && sudo apt-get -y upgrade
```

Once updated you can install MariaDB with the following command:

```shell
$ sudo apt-get -y install mariadb-server mariadb-client
```

Once installed you can confirm everything is working correctly by checking the state of the service:

```shell
$ sudo systemctl status mariadb.service
```

Let's stop the service so we can make some additional configuration changes:

```shell
$ sudo systemctl stop mariadb.service
```

## Configuration
The default configuration file can be found at `/etc/mysql/mariadb.conf.d/50-server.cnf`, you can run the below command to edit it:

```shell
$ sudo nano /etc/mysql/mariadb.conf.d/50-server.cnf
```

For me the only change I needed to make was to set the `bind-address` to `0.0.0.0` (all interfaces) to allow external access, however you may want to look through the configuration file and make additional changes to suit your setup.

Once done, you will need to run the `mysql_secure_installation` script as sudo - this will guide you through all the recommended security settings for your installation.

You will need to start MariaDB first before running the secure installation script.

```shell
$ sudo systemctl start mariadb.service
$ sudo /usr/bin/mysql_secure_installation
```

### Connecting to the DB
You can connect to MariaDB using the following command:

```shell
$ sudo mysql -u root -p
```

### Creating Users
You can create an user account with the below commands (be sure to replace the `<USER>` and `<PASSWORD>` placeholders):

```sql
CREATE USER '<USER>' IDENTIFIED BY '<PASSWORD>';
GRANT USAGE ON *.* TO '<USER>'@'%' IDENTIFIED BY '<PASSWORD>';
FLUSH PRIVILEGES;
```

### Creating DB
You can create a DB with the below command (be sure to replace the `<DB_NAME>` placeholder):

```sql
CREATE DATABASE `<DB_NAME>`;
```

### Assigning an User to a DB
Use the below commands to assign an user to a specific DB (make sure you replace `<DB_NAME>`, `<USER>` and `<HOST>`):

```sql
GRANT ALL privileges ON `<DB_NAME>`.* TO '<USER>'@'<HOST>';
FLUSH PRIVILEGES;
```

You can use `%` for `<HOST>` to allow access from anywhere - however it is a lot safer to lock down access to known, safe IP Addresses.

## Quick Reference
Some helpful commands and paths to save you time.

### Data Directory
`/var/lib/mysql/`

### Service Management
```shell
sudo systemctl start mariadb.service
sudo systemctl stop mariadb.service
sudo systemctl restart mariadb.service
sudo systemctl status mariadb.service
```

### Connecting to MariaDB
```shell
sudo mysql -u root -p
```

### Creating a DB
```shell
CREATE DATABASE `<DB_NAME>`;
```

### Creating an User and assign a DB
```shell
CREATE USER '<USER>' IDENTIFIED BY '<PASSWORD>';
GRANT USAGE ON `<DB_NAME>`.* TO '<USER>'@'%' IDENTIFIED BY '<PASSWORD>';
GRANT ALL privileges ON `<DB_NAME>`.* TO '<USER>'@'<HOST>';
FLUSH PRIVILEGES;
```
