# V2 SMTP Checker with Svelte, Tailwind, NodeJS and Serverless

![Cover Image](./thumbnail.png "Thumbnail")

<br>

## Overview

This project is using NodeJS as backend running in AWS lambda as Netlify functions. It has serverless rate limiting done with redis. You can get redis for free from here, [Upstash](https://upstash.com).

## Deprecated

I was hosting this project but due to overuse and spam, I decided to take it down. This project will remain as it is and would still get maintained if any issue arises. But in order to use it, you would need to host it on your own.

You can host it on netlify as it is built on top of their infrastructure but this project uses express under the hood. With a little amount of customization, you will be able to run it in everywhere, docker, heroku, railyways, appservice etc.

## Rate Limiting

As the API is public, in order to protect from potential hacker, there is a rate limiting mechanism. You can only request 6 times in a minute. But if you are deploying it by yourself, you can change the rate limit by changing environment variable,

```
POINTS = 100
DURATION = 60
```

## Stack

These are the things used in the project

- Svelte
- Tailwind
- Netlify Functions
- TypeScript

## Get started with this project

Install the dependencies...

```
npm insall  <- npm
yarn        <- yarn
```

development server

```
npm run dev <- npm
yarn dev    <- yarn
```

## Building and running in production mode

```
npm run build <- npm
yarn build    <- yarn
```
