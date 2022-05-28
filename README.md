# Release/Simulcast Calendar Helper for Crunchyroll

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/epkclcbkefpikbpopcpjjlbajhnglged?color=orange&label=Chrome%20Extension&logo=Google%20Chrome&logoColor=orange&style=flat-square)](https://chrome.google.com/webstore/detail/epkclcbkefpikbpopcpjjlbajhnglged)
[![Mozilla Add-on](https://img.shields.io/amo/v/8f010de3-24bd-4bdf-9317-f6498684d29d?color=orange&label=Firefox%20Addon&logo=Firefox&logoColor=orange&style=flat-square)](https://addons.mozilla.org/en-US/firefox/addon/release-calendar-filter-for-cr/)

<p align="center">
  ![Logo; A calendar going through a filter cone](/promo/icon.svg?raw=true&sanitize=true)
</p>

## Building The Extension Localy

1. Run `npm install` in the folder to install dependencies
2. Run `npm run build` to generate the distribution directories

## Running The Extension Localy (in Firefox)

3. Navigate to `about:debugging#/runtime/this-firefox` in your browser
4. Click `Load Temporay Add-on...`
5. Select the `/dist_firefox` folder in this directory

## Running The Extension Localy (in Google Chrome)

3. Navigate to `chrome://extensions` in your browser
4. Ensure `Developer mode` is `enabled` (top right)
5. Click `Load unpacked` in the top left
6. Select the `/dist` folder in this directory

After completing the above steps, you should see the developer, unpacked version appear in your extension list. To trigger the extension, simply go to `https://www.crunchyroll.com/simulcastcalendar`.

## External Libraries

This extension uses the following external libraries:

1. [CalDom](https://github.com/dumijay/CalDOM/)
2. [WebExtension `browser` API Polyfill](https://github.com/mozilla/webextension-polyfill/)
