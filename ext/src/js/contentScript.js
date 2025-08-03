/*
 * All JS in this file will be run on any pages that match the pattern defined in manifest.
 */

import {initializeContentScript} from "./lib/content_script_utils.js";

window.onload = function () {
    // Initialize the content script functionality
    initializeContentScript();

};


