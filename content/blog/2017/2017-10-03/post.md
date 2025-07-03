---
title: Sonoff & MQTT Example (Lounge Light)
date: 2017-10-03
#categories: [iot]
#tags: [mqtt,sonoff]
#toc: true
---

A while back I got brave and [changed the firmware on the Sonoff switch](https://www.richardn.ca/posts/ChangingSonoffFirmwareVisualGuide/) connected to my lounge light to use it in my home automation. I followed [these instructions](https://github.com/arendst/Tasmota) when uploading the firmware and was up and running in about 10 minutes.

Once I had everything connected back up it was time to interact with the light via my MQTT broker, and after Googling for the relevant commands I found [them here](https://github.com/arendst/Tasmota#tl-dr).

<img src="./001.png" alt="" />

Which I have tabulated below:

| Command | Payload | Response |
| `cmnd/my_device/power` | `<empty>` | stat/my_device/POWER ON|OFF |
| `cmnd/my_device/power` | on | stat/my_device/POWER ON |
| `cmnd/my_device/power` | off | stat/my_device/POWER OFF |

Once I knew the correct commands to send to the device I just needed to configure a unique name for it using the `configuration menu` provided by the [Tasmota](https://github.com/arendst/Tasmota) firmware. As you can see below my device's name is loungeLight.

<img src="./002.png" alt="" />

The sonoff will listen to events published on the `%prefix%/loungeLight/` topic, so in the case of sending a power on command to the light that would be `cmnd/loungeLight/power`. Knowing this I created the following flow in [Node-RED](https://nodered.org/).

<img src="./003.png" alt="" />

This flow will publish a pre-defined payload to the below topic on my MQTT broker, which in this case will either be `on` or `off` depending on which button was pressed (or the value published by the scheduler).

<img src="./004.png" alt="" />

To take my light automation to the next level as it were I am making use of [schedex](https://github.com/biddster/node-red-contrib-schedex):

> Scheduler for node-red which allows you to enter on/off times as 24hr clock (e.g. 01:10) or suncalc events (e.g. goldenHour). It also allows you to offset times and randomise the time within the offset.
{: .prompt-tip }

This scheduler allows you to set your location (`longitude` and `latitude`) and provides some really awesome scheduling options as shown below.

<img src="./005.png" alt="" />

This allows me to make use of the `sunsetStart` time to turn ON my light...

<img src="./006.png" alt="" />

... and the sunrise time to turn it back `OFF`.

<img src="./007.png" alt="" />

My lounge light is now fully automated thanks to Node-RED, Tasmota, schedexand a simple Sonoff switch!

<img src="./008.png" alt="" />

I hope that you found this post helpful and as always I welcome any comments or feedback in the discussion section below.
