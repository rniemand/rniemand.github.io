---
title: 'Lounge Clock (v 1.0)'
date: 2022-06-07 18:00:00 -0600
categories: [home assistant,esphome]
tags: [mqtt,mosquitto,3d printing,iot,project]
toc: true
---

In this post I will cover how I built my lounge clock using [ESPHome](https://esphome.io/), [Home Assistant](https://www.home-assistant.io/), [MQTT](https://www.richardn.ca/posts/InstallingMqttOnUbuntu/) and a whole lot of other technologies, I think that the end result looks pretty good for my first attempt:

![](/assets/img/2022/2022-06-07/001.jpg)

## Bill of Material
The following tools \ materials are required should you want to make your own:

- 3D Printer - or a 3D printing service near you
  - Used to print all the components used in the clock
- 4x [7-Segment display PCB's](https://github.com/rniemand/code-samples/tree/main/projects/lounge-clock) - more information below
- Piece of wood to mount the clock on
- ESP8266 - preferably the Wemos D1 Mini
- Some wires to connect everything together
- 2 Part Epoxy - I find it works best with PLA
- Hot glue gun (and glue)

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

## Source Code
More to come...

- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/1.0/clock-code.yaml


### Wiring
More to come

```
D3       WS2812B        Lights      GRB
D1       dht            Temperature
A0       adc            Brightness
-        wifi_signal    WiFi
```

https://fritzing.org/



### Segment Values
More to come...

```
int digitsLeds[10][ledsInDigitCount] = {
  {1,1,1,1,1,1,0}, // 0
  {0,1,1,0,0,0,0}, // 1
  {1,1,0,1,1,0,1}, // 2
  {1,1,1,1,0,0,1}, // 3
  {0,1,1,0,0,1,1}, // 4
  {1,0,1,1,0,1,1}, // 5
  {1,0,1,1,1,1,1}, // 6
  {1,1,1,0,0,0,0}, // 7
  {1,1,1,1,1,1,1}, // 8
  {1,1,1,1,0,1,1}  // 9
};
```

![](/assets/img/2022/2022-06-07/002.png)

![](/assets/img/2022/2022-06-07/003.png)

### Basic Scematic
More to come...

![](/assets/img/2022/2022-06-07/004.png)


## PCB Files
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/1.0/Gerber_PCB_WS2812B_7_Segment-1.png
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/1.0/Gerber_PCB_WS2812B_7_Segment.csv
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/1.0/Gerber_PCB_WS2812B_7_Segment.png
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/1.0/Gerber_PCB_WS2812B_7_Segment.zip

## Model Files
More to come...

- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/01%20-%202x%20-%20Double%20Segment%20Holder.stl
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/02%20-%201x%20-%20Doublle%20Segment%20Hole%20Stencil.stl
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/03%20-%204x%20-%20Segment%20Cover.stl
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/04%20-%2028x%20-%20Segment%20Diffuser.stl
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/05%20-%201x%20-%20Dots%20Holder.stl
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/06%20-%201x%20-%20Dots%20Cover.stl
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/07%20-%202x%20-%20Dots%20Diffuser.stl
- https://github.com/rniemand/code-samples/blob/main/projects/lounge-clock/3d-models/08%20-%202x%20-%20Double%20Segment%20Cover.stl

## Home Assistant Setup

### Card Control

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