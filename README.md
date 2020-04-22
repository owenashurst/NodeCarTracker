# NodeCarTracker
Car Tracker written in NodeJS to be used on the Raspberry Pi with a USB UBLOX GPS Dongle

# Hardware Requirements
* Internet connection
* USB GPS Dongle

This application assumes there is an active internet connection as it will attempt to send a POST request to the specified endpoint configured in the .env file.

# Configuration
Take a look in config.js to see what environment variables are being used. This project uses dotenv so that you can override any environment variables by creating a .env file in the root of the project and specifying a name and value in a key value format e.g.

```
API_URL=https://my-api.com/location
```

# Running
I recommend running the application in PM2 in Linux so that it starts the application back up on reboot.

https://pm2.keymetrics.io/

## Using PM2
First of all cd into the root of the project so PM2 knows where to try and run the app from, then run:

```
pm2 start index.js --name "GPSTracker"
```

If that was successful you should now have the application running. You can check by running ``pm2 status``.

To configure PM2 to automatically start the services on reboot, you will need to run a couple commands. PM2's documention explains how to do this:

https://pm2.keymetrics.io/docs/usage/startup/
