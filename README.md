# FixersDataCollectionClient

##### Testing
Make sure your have the [Tampermonkey](https://tampermonkey.net/) extension installed in your browser and then click the link below to install FixersDataCollectionClient.

[![Install / Update](https://img.shields.io/badge/-Install%20%2F%20Update-blue.svg?style=for-the-badge)](https://github.com/andrew-ledawson/FixersDataCollectionClient/raw/master/dist/bundle.user.js)

Now whenever you visit a guide on iFixit, the metric collector code will automatically run. Open up your browser's devtools to see the metrics that have been tracked (printed every 10 seconds).
FixersDataCollectionClient will autoupdate in Tampermonkey by default every 7 days. You can force updates either through Tampermonkey or by clicking the button above to check and install future versions. 

##### Development
You will need npm installed on your machine in order to build the final bundle.
All source files are in `src/`.
Edit the respective files
You will have to bump the version number in userscript-header.js to force already installed userscripts to automatically update.
Run `npm run-script build`.
This will create two files `dist/bundle.js` and `dist/bundle.user.js`.


##### Release
* `dist/bundle.js` This file can be copied and included in the webpage for tracking
* `dist/bundle.user.js` This file can be installed as a userscript for individual testing
