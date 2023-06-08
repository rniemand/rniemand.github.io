---
title: Tracking User Presence (HASS and OwnTracks)
date: 2017-09-13 18:00:00 -0600
categories: [home assistant]
tags: []
toc: true
---

[Home Assistant](https://www.home-assistant.io/) (`Hass`) is hands down one of the best home automation frameworks (HUBS) I have used, and offers support for over 800 devices with that number growing almost on a daily basis. It not only presents all your collected device data into a single portal, but offers a lot of automation through their scripting & templating engine. After spending about a week diving into the features of Home Assistant I decided to tear everything down and start from scratch documenting my journey in order to help others get started with it.

At the moment my main focus is around security and knowing what is going on at home when we are not around. I have built a couple of sensory nodes based on an ESP8266 development board (more to come in a later post) that now live in key areas of the house monitoring movement, doors & windows, temperature, humidity, etc. These devices publish their information to my MQTT broker which is being monitored by Home Assistant. My main intent here is to have Home Assistant send me notifications on my mobile phone when there is movement around the house and we are not there. For this to happen I somehow need to let Home Assistant know when we are home, and when we are away so it is able to take the appropriate action when movement is detected, Enter OwnTracks.

> OwnTracks allows you to keep track of your own location. You can build your private location diary or share it with your family and friends. OwnTracks is open-source and uses open protocols for communication so you can be sure your data stays secure and private.
{: .prompt-info }

I installed the client on my phone,configured it to talk to my home MQTT server, and making use of my [MQTT dumper application](https://www.richardn.ca/posts/MQTTDumperAlpha/) confirmed that it was indeed able to publish my location correctly. Now comes the fun part of getting everything up and running on Home Assistant.

## Getting your location
Home Assistant needs to know your home location in order to determine whether you are home or not, and for the most part the installer does a pretty good job at guessing your coordinates, however you will need to refine them a bit to ensure that everything works properly.

To do this you will need the `latitude` and `longitude` of your home location. For mine I made use of the [following site](http://www.latlong.net/) to work this out, but you can also do this via Google maps by pulling the values out of the URL - the site was a bit easier IMO.

Once you have your coordinates you will need to add them to the configuration.yaml under the homeassistant configuration property as shown below:

```yaml
homeassistant:
  latitude: xxx
  longitude: xxx
```

## Home Assistant and MQTT
Next you will need to make sure that Home Assistant can talk to your MQTT server. To do this you will need to add the appropriate configuration to your configuration.yaml again:

```yaml
mqtt:
  broker: 192.168.0.5
  port: 1883
  username: xxx
  password: xxx
```

Provided all your settings are correct, Home Assistant should be able to talk to your MQTT server after a restart.

## Setup OwnTracks
Next you will need to tell Home Assistant to track your devices via owntracks by adding in the below configuration lines into your configuration.yaml again.

```yaml
device_tracker:
  - platform: owntracks
    max_gps_accuracy: 20
```

By default this will assume that you are using MQTT to track your mobile devices, and after restarting the Home Assistant service (application) you should see a new file called known_devices.yaml in your configuration directory. This file will contain an entry for each device that it discovered along with some default values for some of the key properties:

```yaml
niemandr_raesphone:
  hide_if_away: false
  icon:
  mac:
  name: niemandr
  picture:
  track: true
  vendor:
```

You can customise the name of the device (in my case Richard) and add in either a URL or file path (Home Assistant will need read access to the file) to customise the icon displayed for the user:

```yaml
niemandr_richphone:
  hide_if_away: false
  icon:
  mac:
  name: Richard
  picture: https://i.imgur.com/EItQMfw.png
  track: true
  vendor:
```

After a quick restart of Home Assistant I can see my avatar, and an AWAY tag by my name (I was setting up remotely) - success!

![](/assets/img/2017/2017-09-13/001.png)

## Zoning
As it stands Home Assistant now knows when you are home and away, nothing more. We could leave it here, but it would be nice to know when I am at work also as there may be some automation tasks I would like to trigger when I get to work (not that I can think of any at the moment). To do this we will need to set up some [zones](https://www.home-assistant.io/integrations/zone/).

We are going to define these in a separate file to make management of zones easier, and reference that file in our configuration.yaml by adding the following line somewhere near the bottom of it:

```yaml
zone: !include zones.yaml
```

This basically declares a zone configuration node and injects the contents of the referenced file zones.yaml in place of the import statement. Let's create the zones.yaml file and define all the zones you need as shown below:

```yaml
- name: Work
  latitude: xxx
  longitude: xxx
  radius: 250
  icon: mdi:briefcase

- name: Not Work
  latitude: xxx
  longitude: xxx
  radius: 250
  icon: mdi:briefcase
```

Save the file, restart Home Assistant and if all went well you should see your new zone reflecting under your location avatar.

![](/assets/img/2017/2017-09-13/002.png)

### Troubleshooting
I actually had a lot of trouble getting this up and running initially - Home Assistant was refusing to update my location no matter what I did. I spent about 10 min redefining my zones, tweaking the radius, reloading the application to no success, it was only after configuring the logger to be more verbose that the issue became apparent. To enable [logging](https://www.home-assistant.io/integrations/logger/) add the following to your configuration.yaml file:

```yaml
logger:
  default: debug
```

After a restart the issue was plain as day!

```
2017-09-12 08:22:42 INFO (MainThread) [homeassistant.components.device_tracker.owntracks] Ignoring location update because expected GPS accuracy 25.0 is not met: {"_type":"location","tid":"ne","acc":32,"batt":79,"conn":"w","lat":xxx,"lon":xxx,"tst":1505194769}
```

Blegh `expected GPS accuracy 25.0 is not met`! This was a simple fix:

```yaml
device_tracker:
  - platform: owntracks
    max_gps_accuracy: 35
```

After a restart my wife's zone was reflecting!

![](/assets/img/2017/2017-09-13/003.png)

Hopefully this saves you some time with your home setup. As always feel free to comment or ask any questions you may have below.
