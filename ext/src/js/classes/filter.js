import { ALL_DUB_LANGUAGES } from "../lib/constants";
export default class Filter {

    /** 
     * Holds the version of json that will be generated
     */
    static #jsonVersion = 2;

    /**
     * Holds A {Week} object for current filter
    */
    #weekContent;

    /** 
     * if {true} all subs should be hidden, 
     * if {false} all subs should be shown
    */
    #hideAllSubs;
    /** 
     * if {true} all dubs should be hidden, 
     * if {false} dubs should be shown 
     * but can be limited with additional flags.
    */
    #hideAllDubs;
    /** 
     * if {true} only dubs for the langs in 
     * {dubsShown} should be shown, 
     * if {false} this flag 
     * should be ignored.
    */
    #showSomeDubs;
    /**
     * {Array} of dubs to be shown.
    */
    #dubsShown;

    /**
    * {Array} of dub langs options shown on the UI. 'Others' should always be present.
    */;
    #dubsLangOptionsListInternal = [];

    /** 
    * if {true} in queue should be shown 
    * but can be limited with additional flags.
    * if {false} all in queue should be hidden.
    */
    #showInQueue;
    /** 
    * if {true} only in queue should be shown, 
    * if {false} this flag should be ignored.
    */
    #showOnlyInQueue;

    /** 
    * if {true} premiere should be shown 
    * but can be limited with additional flags.
    * if {false} all premiere should be hidden.
    */
    #showPremiere;
    /** 
    * if {true} only in premiere should be shown, 
    * if {false} this flag should be ignored.
    */
    #showOnlyPremiere;

    /**
     * 
     * @param {Week} weekContent the content object
     */
    constructor(weekContent, savedShownLanguages) {
        this.#setDefaults();
        this.#weekContent = weekContent;
        this.setDubLangs(savedShownLanguages);
    }

    restore(savedJson) {

        // undefined is version 1
        const savedVersion = savedJson["version"];
        // Check if version is not current version
        if (savedVersion != Filter.#jsonVersion) {
            console.log("Old version");
            // assume version 1
            // reset to defaults
            this.reset();
            return;
        }

        this.#dubsLangOptionsListInternal = savedJson["dubsLangOptionsListInternal"];

        this.#hideAllSubs = savedJson["hideAllSubs"];

        this.#hideAllDubs = savedJson["hideAllDub"];
        this.#dubsShown = savedJson["dubsShown"];
        this.#showSomeDubs = this.#dubsShown != null && this.#dubsShown.length > 0;

        this.#showInQueue = savedJson["showInQueue"];
        this.#showOnlyInQueue = savedJson["showOnlyInQueue"];

        this.#showPremiere = savedJson["showPremiere"];
        this.#showOnlyPremiere = savedJson["showOnlyPremiere"];
        if (!this.#showSomeDubs) {
            this.#show();
        } else {
            this.#show(this.#dubsShown);
        }
    }

    reset() {
        this.#setDefaults();
        this.#show();
    }

    #setDefaults() {
        this.#hideAllSubs = false;
        this.#hideAllDubs = false;
        this.#showSomeDubs = false;
        this.#dubsShown = [];
        this.#showInQueue = true;
        this.#showOnlyInQueue = false;

        this.#showPremiere = true;
        this.#showOnlyPremiere = false;
    }
    /** 
     * @returns {JSON} JSON for this filter that can
     *  be used to save state.
     */
    createJson() {
        let jsonArray = {};
        jsonArray["version"] = Filter.#jsonVersion;

        jsonArray["dubsLangOptionsListInternal"] = this.#dubsLangOptionsListInternal;

        jsonArray["hideAllSubs"] = this.#hideAllSubs;
        jsonArray["hideAllDub"] = this.#hideAllDubs;
        jsonArray["dubsShown"] = this.#dubsShown;

        jsonArray["showInQueue"] = this.#showInQueue;
        jsonArray["showOnlyInQueue"] = this.#showOnlyInQueue;

        jsonArray["showPremiere"] = this.#showPremiere;
        jsonArray["showOnlyPremiere"] = this.#showOnlyPremiere;

        return jsonArray;
    }

    /**
     * Sets the dub options shown on the UI
     * @param {Array} dubOptions 
     */
    setDubLangs(dubOptions) {
        if (dubOptions && dubOptions.length > 0) {
            this.#dubsLangOptionsListInternal = dubOptions.map(x => x.toLocaleLowerCase());
        }
    }

    #show(dubsToShow = []) {
        this.#weekContent.show(this.#hideAllSubs, this.#hideAllDubs, dubsToShow, !this.#showInQueue, this.#showOnlyInQueue, !this.#showPremiere, this.#showOnlyPremiere);
    }

    /*
    Senarios for dubbed and subbed content.
    Default: Show All Subs and Dubs
    Hide: Show All Subs and No Dubs
    Show: Show All Subs and Wanted Dubs
    Only: Show Wanted Dubs and no Subs

    | Subs | Dubs | Valid |         Method               |
    |  H   |  H   |   N   |           -                  |
    |  S   |  S   |   Y   | showAllSubsAndWantedDubs     |
    |  H   |  S   |   Y   | hideAllSubsAndShowWantedDubs |
    |  S   |  H   |   Y   | showAllSubsAndHideAllDubs    |
    */

    /**
    * This will hide all subs and show wanted 
    * (all, if needed) dubs
    */
    hideAllSubsAndShowWantedDubs(listToShow) {
        //If the subs are not hidden, hide them
        if (!this.#hideAllSubs) {
            this.#hideAllSubs = true;
        }
        //If the dubs are not shown, show them
        if (this.#hideAllDubs && !this.#showSomeDubs) {
            // set properties for showing some dubs
            this.#setShowDubsOfProperties(listToShow);
        }

        //apply filter
        if (!this.#showSomeDubs) {
            this.#show();
        } else {
            this.#show(this.#dubsShown);
        }
    }

    /**
     * This will show all subs and wanted 
     * (all, if needed) dubs
     */
    showAllSubsAndWantedDubs(listToShow) {
        //if the subs are hidden, shown them
        if (this.#hideAllSubs) {
            this.#hideAllSubs = false;
        }

        //If the dubs are not shown, show them
        if (this.#hideAllDubs && !this.#showSomeDubs) {
            // set properties for showing some dubs
            this.#setShowDubsOfProperties(listToShow);
        }

        //apply filter
        if (!this.#showSomeDubs) {
            this.#show();
        } else {
            this.#show(this.#dubsShown);
        }
    }
    /**
    * This will show all subs and hide 
    * all dubs
    */
    showAllSubsAndHideAllDubs() {
        // if the dubs are shown, hide them
        if (!this.#hideAllDubs || this.#showSomeDubs) {


            this.#hideAllDubs = true;
            this.#showSomeDubs = false;
            this.#dubsShown = [];
        }
        //if the subs are hidden, shown them
        if (this.#hideAllSubs) {
            this.#hideAllSubs = false;
        }

        //apply filter
        this.#show();
    }

    #setShowDubsOfProperties(listToShow) {
        const allDubs = ALL_DUB_LANGUAGES.map(x => x.toLocaleLowerCase());
        const otherDubs = allDubs.filter(x => !this.#dubsLangOptionsListInternal.includes(x));

        // If the list to show has 'others' in it, add all the other dubs to the list
        if (listToShow.includes("others")) {
            listToShow = listToShow.concat(otherDubs);
            allDubs.push("others");
        }

        let intersection = allDubs.filter(x => listToShow.includes(x));

        if (intersection.length == allDubs.length) {
            this.#hideAllDubs = false;
            this.#showSomeDubs = false;
            this.#dubsShown = [];
        }
        else if (intersection.length > 0) {
            this.#hideAllDubs = false;
            this.#showSomeDubs = true;
            // actions
            // let toShow = intersection.filter(x => !this.#dubsShown.includes(x));
            // let toHide = this.#dubsShown.filter(x => !intersection.includes(x));

            //console.log("TODO: Show dubs of");
            //console.log("To Show: " + toShow);
            //console.log("To Hide: " + toHide);

            this.#dubsShown = intersection;
        } else {
            this.#hideAllDubs = false;
            this.#showSomeDubs = false;
        }
    };

    showDubsOf(listToShow) {
        console.log("show dub of called");
        this.#setShowDubsOfProperties(listToShow);
        this.#show(this.#dubsShown);
    }

    hideInQueue() {
        if (this.#showInQueue) {

            this.#showInQueue = false;
            this.#showOnlyInQueue = false;

            //console.log("TODO: Hide in queue");
            this.#show(this.#dubsShown);
        }
    }

    showInQueue() {
        if (!this.#showInQueue || this.#showOnlyInQueue) {

            this.#showInQueue = true;
            this.#showOnlyInQueue = false;

            //console.log("TODO: Show in queue");
            this.#show(this.#dubsShown);
        }
    }

    showInQueueOnly() {
        if (!this.#showOnlyInQueue) {

            this.#showInQueue = true;
            this.#showOnlyInQueue = true;

            //console.log("TODO: Show in queue only");
            this.#show(this.#dubsShown);
        }
    }

    hidePermiere() {
        if (this.#showPremiere) {

            this.#showPremiere = false;
            this.#showOnlyPremiere = false;

            //console.log("TODO: Hide premiere");
            this.#show(this.#dubsShown);
        }
    }

    showPermiere() {
        if (!this.#showPremiere || this.#showOnlyPremiere) {

            this.#showPremiere = true;
            this.#showOnlyPremiere = false;

            //console.log("TODO: Show premiere");
            this.#show(this.#dubsShown);
        }
    }

    showPermiereOnly() {
        if (!this.#showOnlyPremiere) {

            this.#showPremiere = true;
            this.#showOnlyPremiere = true;

            //console.log("TODO: Show premiere only");
            this.#show(this.#dubsShown);
        }
    }


}