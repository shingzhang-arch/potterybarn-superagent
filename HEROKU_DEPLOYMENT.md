# Heroku Deployment Guide

## What Was Fixed

The application now includes proper Heroku deployment configuration:

- **Express.js Server** (`server.js`) - Replaces Python HTTP server
- **Procfile** - Tells Heroku how to run the application
- **package.json Updates** - Includes Express dependency and Node.js engine specification
- **Dynamic Port Binding** - Uses `process.env.PORT` for Heroku's dynamic port assignment

## Prerequisites

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Have a Heroku account (free tier available at [heroku.com](https://heroku.com))
3. Git should be configured

## Deployment Steps

### 1. Login to Heroku
```bash
heroku login
```

### 2. Create a New Heroku App
```bash
heroku create pb-super-agent
```

Or if you already have an app:
```bash
heroku git:remote -a pb-super-agent
```

### 3. Deploy
```bash
git push heroku main
```

### 4. View Your App
```bash
heroku open
```

Or visit: `https://pb-super-agent.herokuapp.com` (replace `pb-super-agent` with your actual app name)

## Troubleshooting

### Application Error on Page Load
If you still see the "Application error" page:

1. Check the logs:
```bash
heroku logs --tail
```

2. Most common causes:
   - Port binding issue (fixed by using `process.env.PORT`)
   - Missing dependencies (fixed by package.json)
   - Server crash (check logs for detailed error)

### How to Check Deployment Status
```bash
# View logs
heroku logs

# View recent logs
heroku logs --tail

# View logs from a specific dyno
heroku logs --dyno web.1
```

## Local Testing

To test the server locally before deploying:

```bash
npm install
npm start
```

Then visit: `http://localhost:3000`

## What's Running on Heroku

- **Node.js Runtime** - v18.x
- **Express Server** - Listens on dynamic port (assigned by Heroku)
- **Static Files** - All files in the project root are served
- **SPA Support** - All routes serve index.html for single-page app functionality

## Files Updated for Heroku

- `server.js` - Express.js server that serves static files
- `Procfile` - Heroku process file specifying how to start the app
- `package.json` - Updated with Express dependency and start script
- `package-lock.json` - Locked dependency versions

## Environment Variables

To set environment variables on Heroku:

```bash
heroku config:set VAR_NAME=value
```

Example:
```bash
heroku config:set NODE_ENV=production
```

## Scaling

If you need more resources or multiple dynos:

```bash
heroku ps:scale web=2
```

## Monitoring

View your app's dashboard:
```bash
heroku open
```

Visit the Heroku dashboard at [https://dashboard.heroku.com](https://dashboard.heroku.com) for more details and scaling options.

---

Your PB Super Agent Architecture Explorer is now ready for production deployment on Heroku! 🚀
