---
title: Home Assistant From Scratch - MySQL
date: 2018-07-17
tags: [home assistant,mysql,mariadb]
logo: hass.png
---

> This is one **[post in a series](/blog/2018/2018-06-27/post/)** of getting up and running with Home Assistant from scratch.
{: .prompt-tip }

Today I would like to cover switching from the default SQLite database that Home Assistant uses over to MySQL - there is a slight performance update when making this switch, not to mention that it frees up valuable resources on my Raspberry Pi.

## Why use MySQL?
My main driver for switching from SQLite to MySQL is performance and resources. If you have been following [this series](/series/) you will know that I am running my Home Assistant setup on a Raspberry Pi (through [hass.io](https://www.home-assistant.io/getting-started)) for ease of use. This works amazingly well, however the throughput of the default database suffers due to the limited resources on the Pi.

I already have a [MySQL Community Edition](https://www.mysql.com/products/community/) server running on my home network complete with weekly backups of some select databases. So for me it makes sense to create a new home_assistant schema on my server and gain the performance benefits over SQLite.

For the remainder of this post I am going to presume that you have an instance of MySQL running somewhere on your home network ([official installation guide](https://dev.mysql.com/doc/refman/8.0/en/windows-installation.html)) along with [MySQL Workbench](https://www.mysql.com/products/workbench/) to manage your server.

## The process
The process to switch over to MySQL is pretty straight forward, and requires only 3 lines of configuration in Home Assistant (2 if you are not using a secrets.yaml file), and will comprise of the following steps:

- Create a new database (schema) called home_assistant
- Create an elevated user (with remote login) called hass_user associated with the new schema
- Configure Home Assistant to point to your MySQL server
- Restart Home Assistant and enjoy

### Creating the database
Creating the database is as simple as connecting to your server through MySQL Workbench and clicking the create new schema shortcut, giving the schema a name and clicking create.

<img src="./001.png" alt="" />

Once done you should have a new schema called home_assistant ready to go.

<img src="./002.png" alt="" />

### Creating the hass_user account
To create the hass_user account simply click on the Users and Privileges link found under the Navigator pane followed by the Add Account button at the far bottom.

<img src="./003.png" alt="" />

Be sure to generate a strong password for the account, along with allowing all hosts `%` to connect as this user - this is important as the user account will be coming in from your Home Assistant server and not your MySQL server's localhost.

<img src="./004.png" alt="" />

In terms of privileges for the account, be sure to select what makes sense for your user (I was not 100% sure what to grant, so I gave my account DBA rights). I would suggest limiting the privileges for your setup, but my MySQL server does not face the internet, and the box it is running on is pretty boring to potential attackers.

<img src="./005.png" alt="" />

Click OK to create the user account.

### Configuring Home Assistant
We will need to configure the [recorder component](https://www.home-assistant.io/integrations/recorder/) and tell it to store \ retrieve all state and history information from MySQL instead of the default SQLite database.

In order to do this we will need to create a connection string for MySQL using the following structure: `mysql://<user>:<pass>@<host>/<schema>`

In my case I would end up with a MySQL connection string looking something like this: `mysql://hass_user:PASS@10.0.0.50/home_assistant`

I highly recommend storing any sensitive information like connection strings in your secrets.yaml file, and then referring to the secret value in your configuration. To do this we will add our new connection string to the secrets.yaml like so ...

```yaml
db_mysql: mysql://hass_user:PASS@10.0.0.50/home_assistant
```

... and then configure the recorder component in our configuration.yaml file like so (note: you may need to add in the recorder component to your file as it is omitted from configuration by default):

```yaml
recorder:
  db_url: !secret db_mysql
```

Once done be sure to validate your configuration and restart Home Assistant.

### Enjoy the boost
After Home Assistant comes back up you should see that there are some new tables in your database, along with all the current state information for your home setup.

<img src="./006.png" alt="" />

That's it, you are now using MySQL - now would be a good time to remove the default "home-assistant_v2.db" file from your Raspberry Pi.

<img src="./007.png" alt="" />

Home Assistant will feel really fast now, this is mainly due to the fact that you have lost all your state information and will need to build it back up. However things should remain pretty quick even when things are back to normal (data wise) as shown here:

<img src="./008.png" alt="" />

<img src="./009.png" alt="" />

Hopefully you see the same performance gains as I did with the switch over to MySQL.

## In Closing
Although this change is not a requirement for your home setup, and depending on the size / amount of data you are collecting and reporting on may not be required I still highly recommend it. It makes management of your database a lot easier and helps reduce the amount of resources being used on your Home Assistant host device. On the flip side this can be another potential point of failure for your setup, but it is unlikely as MySQL is super stable from my personal experience.
