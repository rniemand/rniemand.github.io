---
title: Simplest way to access POST data after model binding (Web API)
date: 2016-04-07
tags: [.net,web-api]
logo: dotnet.png
---
I am currently in the process of writing a C# wrapper for [Kik](https://www.kik.com/) and needed a way to dump the raw POST body when their service made a callback to one of my WebAPI controllers (after model binding had occurred). After some Googling I found a posting on Stackoverflow (unfortunately I didn't bookmark the link) which had a creative solution to the problem by making use of a `DelegatingHandler`.

```cs
public class PostPreserverHandler : DelegatingHandler
{
    protected override async Task SendAsync(
        HttpRequestMessage request,
        CancellationToken cancellationToken)
    {
        if (request.Content == null)
            return await base.SendAsync(request, cancellationToken);

        var body = await request.Content.ReadAsStringAsync();
        request.Properties["body"] = body;

        return await base.SendAsync(request, cancellationToken);
    }
}
```

Which simply gets added to your WebAPI Register() method like so:

```cs
config.MessageHandlers.Add(new PostPreserverHandler());
```

And can be accessed from within a controller like this:

```cs
Request.Properties["body"]
```

Thanks so much for the solution mystery contributor!