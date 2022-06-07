---
title: 'Lounge Clock (v 1.0)'
date: 2022-06-07 18:00:00 -0600
categories: [home assistant,esphome]
tags: [mqtt,mosquitto,3d printing,iot,project]
toc: true
---


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