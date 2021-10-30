# hn-notifier

> Get notified on Discord when someone posts an article from your domain on Hacker News

## Installation

```sh
npm install
```

## Usage

```sh
npm run build
```

## Heroku deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Ref:

- https://devcenter.heroku.com/articles/deploying-nodejs
- https://devcenter.heroku.com/articles/app-json-schema#env

Initial setup:

```sh
heroku login
heroku create
heroku config:set DISCORD_WEBHOOK=xxx
heroku config:set DOMAIN=xxx
```

Deployment:

```sh
git push heroku main
```
