export default class Filter {

    static #jsonVersion = 2;

    #weekContent;

    #hideAllSubs;
    #hideAllDubs;
    #showSomeDubs;
    #dubsShown;

    static #dubsLangList = ["English", "Spanish", "French", "German", "Portuguese", "Others"];
    #dubsLangListInternal = ["english", "spanish", "french", "german", "portuguese", "others"];

    #showInQueue;
    #showOnlyInQueue;

    #showPremiere;
    #showOnlyPremiere;

    /**
     * 
     * @param {Week} weekContent the content object
     */
    constructor(weekContent) {
        this.#setDefaults();
        this.#weekContent = weekContent;
    }

    restore(savedJson) {

        // undefined is version 1
        // const savedVersion = savedJson["version"];

        this.#hideAllSubs = savedJson["hideAlSubs"] == undefined ? false : true;
        console.log(this.#hideAllSubs);

        this.#hideAllDubs = savedJson["hideAllDub"];
        this.#dubsShown = savedJson["dubsShown"];

        this.#showInQueue = savedJson["showInQueue"];
        this.#showOnlyInQueue = savedJson["showOnlyInQueue"];

        this.#showPremiere = savedJson["showPremiere"];
        this.#showOnlyPremiere = savedJson["showOnlyPremiere"];

        if (!this.#showSomeDubs) {
            this.#show([]);
        } else {
            this.#show(this.#dubsShown);
        }
    }

    reset() {
        this.#setDefaults();
        this.#show([]);
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
        jsonArray["hideAllSubs"] = this.#hideAllSubs;
        jsonArray["hideAllDub"] = this.#hideAllDubs;
        jsonArray["dubsShown"] = this.#dubsShown;

        jsonArray["showInQueue"] = this.#showInQueue;
        jsonArray["showOnlyInQueue"] = this.#showOnlyInQueue;

        jsonArray["showPremiere"] = this.#showPremiere;
        jsonArray["showOnlyPremiere"] = this.#showOnlyPremiere;

        return jsonArray;
    }

    static dubLangs() {
        return Filter.#dubsLangList;
    }

    #show(dubsToShow) {
        this.#weekContent.show(this.#hideAllSubs, this.#hideAllDubs, dubsToShow, !this.#showInQueue, this.#showOnlyInQueue, !this.#showPremiere, this.#showOnlyPremiere);
    }

    hideAllSubs() {
        if (!this.#hideAllSubs) {

            this.#hideAllSubs = true;

            //Show all dubs
            //console.log("Show all subs");
            this.#show([]);
            // console.log("Done showing");
        }
    }

    showAllSubs() {
        if (this.#hideAllSubs) {

            this.#hideAllSubs = false;

            //Show all dubs
            //console.log("Show all subs");
            this.#show([]);
            // console.log("Done showing");
        }
    }

    hideAllDubs() {
        if (!this.#hideAllDubs || this.#showSomeDubs) {


            this.#hideAllDubs = true;
            this.#showSomeDubs = false;
            this.#dubsShown = [];

            //Hide all dubs
            // console.log("TODO: Hide all dubs");
            this.#show([]);
            // console.log("Done hiding");
        }
    }

    showAllDubs() {
        if (this.#hideAllDubs || this.#showSomeDubs) {

            this.#hideAllDubs = false;
            this.#showSomeDubs = false;
            this.#dubsShown = this.#dubsLangListInternal;

            //Show all dubs
            //console.log("Show all dubs");
            this.#show([]);
            // console.log("Done showing");
        }
    }

    showDubsOf(listToShow) {
        let allDubs = this.#dubsLangListInternal;
        let intersection = allDubs.filter(x => listToShow.includes(x));

        if (intersection.length == this.#dubsLangListInternal.length) {
            this.showAllDubs();
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
            this.#show(this.#dubsShown);
        } else {
            this.hideAllDubs();
        }
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