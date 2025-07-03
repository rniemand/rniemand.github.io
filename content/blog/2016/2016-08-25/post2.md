---
title: OWIN - Mapping Attribute Routes (Web API 2)
date: 2016-08-25
tags: [.net]
---
So last night I was playing around with OWIN and a small self-hosted application that made use of WebAPI 2. Everything was working fine until I tried to make use of the `[RoutePrefix("")]` and `[Route("")]` decorators on my controller (they just were not mapping). After a bit of digging I found out that you need to call `config.MapHttpAttributeRoutes()` in your OWIN `Startup` class and that should fix the mapping issue.

My initial attempt at this failed, and after a bit of playing around I figured out that the order in which you place the `MapHttpAttributeRoutes` and `MapHttpRoute` makes all the difference.

If you are wanting to make use of attribute routing in your OWIN application, this seems to be the winning order:

```cs
config.MapHttpAttributeRoutes();

config.Routes.MapHttpRoute(
    name: "DefaultApi",
    routeTemplate: "api/{controller}/{id}",
    defaults: new {id = RouteParameter.Optional}
);
```

Hopefully this helps you :)