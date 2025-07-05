---
title: Singleton Pattern in TypeScript
date: 2016-07-25
tags: [typescript]
logo: typescript.png
---

Below is an awesome singleton pattern implementation I found deep in the bowels of [StackOverflow](https://stackoverflow.com/) using [TypeScript](https://www.typescriptlang.org/) (adapted from my favourite `C#` implementation).

This works well if you are wanting to create a single instance class for use through your application such as a logger or user service.

```ts
export class Logger {
  private static _instance:Logger = new Logger();

  constructor() {
    if(Logger._instance) {
      throw new Error("The Logger is a singleton class and cannot be created!");
    }

    Logger._instance = this;
  }

  public static getInstance() : Logger {
    return Logger._instance;
  }

  public trace(message: string) {
    console.log('[Trace] ' + message);
  }

  // ...
}
```

Using the `Logger` class is as simple as adding a line like this:

```ts
Logger.getInstance().trace("Hello world!")
```

... or more realistically:

```ts
this.logger = Logger.getInstance();
```

Happy coding :)