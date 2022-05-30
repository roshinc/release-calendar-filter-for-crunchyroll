# Release/Simulcast Calendar Helper for Crunchyroll

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/epkclcbkefpikbpopcpjjlbajhnglged?color=orange&label=Chrome%20Extension&logo=Google%20Chrome&logoColor=orange&style=flat-square)](https://chrome.google.com/webstore/detail/epkclcbkefpikbpopcpjjlbajhnglged)
[![Mozilla Add-on](https://img.shields.io/amo/v/release-calendar-filter-for-cr?color=orange&label=Firefox%20Addon&logo=Firefox&logoColor=orange&style=flat-square)](https://addons.mozilla.org/en-US/firefox/addon/release-calendar-filter-for-cr/)

<p align="center">
  <img width="460" height="300" alt="Logo; A calendar going through a filter cone" src="/promo/icon.svg?raw=true&sanitize=true">
</p>

<br/>
<p align="center">Release/Simulcast Calendar Helper for Crunchyroll is filter for the Release/Simulcast Calendar on Crunchyroll. It aim to make finding somthing to watch using the Release Calendar and adds UI elements to acomplish that. </p>
<br>
<hr>
<br>

<p align="center">
  <img alt="Logo; A calendar going through a filter cone" src="promo/GIFs/Overview.gif">
</p>

## Added UI elements

### The Filter element

<p align="center">
  <img alt="PNG of the filter" src="promo/filter.png">
</p>

Using the filter element you can:

- Toggle visibility for all dubbed episodes on the calendar.
- Toggle visibility for dubbed episodes in a specific language.
- Include, show only, or hide episodes that are 'In Queue' (if logged in)
- Include, show only, or hide episodes that are premiering.
- You can combine any of the above to see what you want to see.

You can also lock filters! So, your choices are applied automatically when you go back to the release calendar or browse another week.

In the options page you can also hide this element, if the filter are locked they will still be applied.

### The Hidden Count elements

<p align="center">
  <img alt="GIF of some hidden count elements chaging" src="promo/GIFs/HiddenCount.gif">
</p>

This element displays the episodes that are hidden for all the days. When the count get changed there is a short animation to indicate that there was a change.

Both the animation and the element itself can be hidden in the extensions's option page.

### The Smaller Progress elements

<p align="center">
  <img alt="PNG of some hidden count elements changing" src="promo/small_progress.png">
</p>

By default Crunchroll only shows watch progress on episodes on the selected day. This extention add a watch progress bar to all episodes on all days. To not clutter the UI too much this is only shown on episodes when the watch progress is > 0.

---

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

- [CalDOM](https://github.com/dumijay/CalDOM/)
- [WebExtension `browser` API Polyfill](https://github.com/mozilla/webextension-polyfill/)
