---
title: 'Lounge Clock (v 1.0)'
date: 2022-06-07 07:00:00 -0600
categories: [home assistant,esphome]
tags: [mqtt,mosquitto,3d printing,iot,project]
toc: true
---

In this post I will cover how I built my lounge clock using [ESPHome](https://esphome.io/), [Home Assistant](https://www.home-assistant.io/), [MQTT](https://www.richardn.ca/posts/InstallingMqttOnUbuntu/) and a whole lot of other technologies, I think that the end result looks pretty good for my first attempt:

![](/assets/img/2022/2022-06-07/001.jpg)

## Bill of Material
The following tools \ materials are required should you want to make your own:

- 3D Printer - or a 3D printing service near you
- 4x [7-Segment display PCB's](https://github.com/rniemand/code-samples/tree/main/projects/lounge-clock) - more information below
- Piece of wood to mount the clock on
- ESP8266 - preferably the Wemos D1 Mini
- Some wires to connect everything together
- 2 Part Epoxy - I find it works best with PLA
- Hot glue gun (and glue)
- DHT11
- 2x 10K resistors
- 1x LDR

## Custom PCB
Using [Easy EDA](https://easyeda.com/editor) I was able to come up with the following circuit board:

![](/assets/img/2022/2022-06-07/002.jpg){: w="350" }

It's a pretty simple board that makes use of some [WS2812b](https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20220607051521&SearchText=ws2812b&spm=a2g0o.home.1000002.0) SMD LEDS wired in the traditional 7-segment pattern:

![](/assets/img/2022/2022-06-07/003.png)

For fabrication I made use of [JLCPCB](https://jlcpcb.com/) and their [pick and place](https://jlcpcb.com/capabilities/Capabilities) service, all in 10 boards assembled cost me `$27.00` (not too bad!).

![](/assets/img/2022/2022-06-07/004.png)

I have made the Gerber files available [here](https://github.com/rniemand/code-samples/tree/main/projects/lounge-clock/1.0) if you would like to make your own.

## 3D Printing
There is a **LOT** of 3D printing required for this project, namely:

- 2x [Double 7-Segment risers](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/01%20-%202x%20-%20Double%20Segment%20Holder.stl) - used to group 2 segments together
- (Optional) 1x [Double 7-Segment risers template](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/02%20-%201x%20-%20Doublle%20Segment%20Hole%20Stencil.stl) - used for drilling holes
- 4x [7-Segment covers](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/03%20-%204x%20-%20Segment%20Cover.stl) - in black if possible for the best results
- 28x [Segments](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/04%20-%2028x%20-%20Segment%20Diffuser.stl) - I would print more as they break easily
- 1x [Dots holder](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/05%20-%201x%20-%20Dots%20Holder.stl) - used to hold 2 additional `WS2812 LEDs`
- 1x [Dots cover](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/06%20-%201x%20-%20Dots%20Cover.stl) - in black if possible for the best results
- 2x [Dots segments](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/07%20-%202x%20-%20Dots%20Diffuser.stl) - plus a couple of spares
- 2x [Double 7-Segment covers](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/08%20-%202x%20-%20Double%20Segment%20Cover.stl) - my attempt at cleaning up the mess at the end :)

The assembly is pretty straight forward (like Lego for adults) and I left enough space to route all the required wires through the risers to give the clock a neater look - although I do not know what happened to mine!

![](/assets/img/2022/2022-06-07/005.jpg)

I would put aside ~18 hours for all the printing to be completed (depending on your printing profile).

## Assembly
Unfortunately I did not take any pictures of the assembly process, however it is pretty easy.

Each 7-Segment board has a `DIN` (Digital In) and `DOUT` (Digital Out) solder point, which need to be daisy chained from one board to another.

On the PCB all the `GND` points are all connected together, along with the `VCC` points to make routing power a lot easier. When connecting the boards you just need to follow this pattern if you are using the [source code](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/1.0/clock-code.yaml) I provide.

```
DIN -> [7-Seg] -> [7-Seg] -> [7-Seg] -> [7-Seg] -> [.] -> [.]
```

Where the following is true:

- `7-Seg` - represents a 7-Segment PCB
- `[.]` - represents a single **WS2812x** LED

The entire assemby should be mounted onto a backing board (using the stencil to make the appropriate holes), and the additional components should be connected to the `ESP8266` similar to the diagram below:

![](/assets/img/2022/2022-06-07/006.png)
_**NOTE** the single LED represents all the PCBs_

```
D3       WS2812B        Lights
D1       DHT11          Temperature
A0       ADC - LDR      Brightness
```

![](/assets/img/2022/2022-06-07/012.jpg)

![](/assets/img/2022/2022-06-07/013.jpg)

Like most `DIY` projects it may not be pretty, but it works!

> **FYI**: the yellow tape on the spacers are to stop the plastic rubbing on my walls
{: .prompt-info }

## Source Code
The source code use for my clock is an adaptation of the code [found here](https://3dmixers.com/m/250988-led-clock-7-segments-) and I take no credit for the original code, only the modifications to it - [thestovedoc](https://3dmixers.com/user/thestovedoc/portfolio) deserves the credit!

The modified code can be [found here](https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/1.0/clock-code.yaml) and requires that you either replace the `!secret ...` placeholders, or inline them into the code before uploading it to the `ESP8266`.

### Segment Values
As mentioned above the **7-Segment** PCB's follow the standard layout (`A, B, C, D, E, F, G`) to make defining numbers a lot easier.

![](/assets/img/2022/2022-06-07/003.png)

Below is the number range used in this project as an example:

```
int digitsLeds[11][ledsInDigitCount] = {
// A B C D E F G
  {1,1,1,1,1,1,0}, // 0
  {0,1,1,0,0,0,0}, // 1
  {1,1,0,1,1,0,1}, // 2
  {1,1,1,1,0,0,1}, // 3
  {0,1,1,0,0,1,1}, // 4
  {1,0,1,1,0,1,1}, // 5
  {1,0,1,1,1,1,1}, // 6
  {1,1,1,0,0,0,0}, // 7
  {1,1,1,1,1,1,1}, // 8
  {1,1,1,1,0,1,1}, // 9
  {0,0,0,0,0,0,0}, // 10 -> ALL_OFF!
};
```

## Home Assistant Setup
Setting everything up in Home Assistant is pretty simple once you have flashed the firmware to your `ESP8266` using the [ESPHome](https://esphome.io/):

![](/assets/img/2022/2022-06-07/008.png)

![](/assets/img/2022/2022-06-07/009.png)

![](/assets/img/2022/2022-06-07/007.png)

### Card Control
To allow for easier control of the clock I added the following card to my dashboard:

![](/assets/img/2022/2022-06-07/010.png)
_It's not that pretty, but it gets the job done!_

Working left to right:

- `Clock Control` - allows for quick control of the clocks brightness
- `H` - (hours) short press to toggle, long press to adjust
- `:` - (dots) short press to toggle, long press to adjust
- `M` - (minutes) short press to toggle, long press to adjust
- `Leading 0` - used to toggle the leading `0` (24 hour \ 12 hour format)
- `Blinking` - used to toggle the blinking of the `:` as it can be annoying when watching TV
- `12\24` - toggles between 12 and 24 hour time format
- `Clock Mode` - quickly enables the clock mode - there are other effects on the clock
- `Lights` - group of all the lights making up the lounge clock

The backing code is shown below:

```yaml
type: horizontal-stack
cards:
  - type: light
    entity: light.lounge_clock
  - square: true
    columns: 3
    type: grid
    cards:
      - show_name: false
        show_icon: true
        type: button
        tap_action:
          action: toggle
        entity: light.lounge_hours_lights
        hold_action:
          action: more-info
        name: HH
        icon: mdi:alpha-h
        show_state: false
      - show_name: false
        show_icon: true
        type: button
        tap_action:
          action: toggle
        entity: light.lounge_dots_lights
        hold_action:
          action: more-info
        name: ':'
        show_state: false
      - show_name: false
        show_icon: true
        type: button
        tap_action:
          action: toggle
        entity: light.lounge_minutes_lights
        hold_action:
          action: more-info
        name: MM
        icon: mdi:alpha-m
        show_state: false
      - show_name: false
        show_icon: true
        type: button
        tap_action:
          action: toggle
        entity: switch.lounge_leading_zero
        name: Zero
        icon: ''
        show_state: false
      - show_name: false
        show_icon: true
        type: button
        tap_action:
          action: toggle
        entity: switch.lounge_dots_blink
        name: Blink
        icon: mdi:car-light-dimmed
        show_state: false
      - show_name: false
        show_icon: true
        type: button
        tap_action:
          action: toggle
        entity: switch.lounge_24_hour_format
        name: '24'
        icon: mdi:hours-24
        show_state: false
      - show_name: false
        show_icon: true
        type: button
        tap_action:
          action: call-service
          service: light.turn_on
          service_data:
            effect: Time Effect
          target:
            entity_id: light.lounge_clock
        entity: ''
        icon: mdi:clock-digital
        hold_action:
          action: none
      - show_name: false
        show_icon: true
        type: button
        tap_action:
          action: more-info
        entity: light.lounge_clock_all_lights
        hold_action:
          action: none
```

### Collected Data
In addition to displaying the time, the clock also collects and submits the following data:

![](/assets/img/2022/2022-06-07/011.png)

- `Brightness` - handled by the **LDR** - measured in voltage (`HIGHER` = brighter)
- `Humidity` - measured by the **DHT11**
- `Temperature` - measured by the **DHT11**
- `WiFi Signal` - built in measure with ESPHome

This data can be used in your home automations, some examples that spring to mind:

- Use the collected temperature data to control your thermostat
- Change the brightness of the clock based on ambient lighting
- Climate control using the `Temperature` and `Humidity` values
- Use the collected `WiFi Signal` to guage on how a repeater is working in your home
- etc.

## In Closing
This was a fun project to work on, and allowed me to mess around with things like:

- PCB design and fabrication
- 3D modeling (using Fusion 360)
- Coding (C++ lambdas)
- ESPHome + Home Assistant
- MQTT (using mosquitto)
- 3D Printing and fabrication

I found this to be a good starter project for taking my Home Assistant & fabrication to the next level.

As always, please feel free to leave any comments \ suggestions below.

Happy Hacking.
