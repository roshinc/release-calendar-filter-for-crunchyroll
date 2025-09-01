/*
 * All JS in this file will be run on any pages that match the pattern defined in manifest.
 */
import {initializeContentScript} from "../../src/js/lib/content_script_utils.js";
import {showFilterMenuLoading} from "../../src/js/classes/loading_state_manager.js";
import {CR_HEADER_DIV_SELECTOR_PATH} from "../../src/js/lib/constants.js";

let filterLoaderId = null;
// If the header exists, show the loading state
const header = document.querySelector(CR_HEADER_DIV_SELECTOR_PATH);
if (header) {
    // Show loading state where the filter menu will appear
    filterLoaderId = showFilterMenuLoading(header);
}

// Initialize the content script functionality
initializeContentScript(filterLoaderId);



