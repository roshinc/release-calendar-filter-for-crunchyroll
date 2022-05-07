class Filter {

    #weekContent;

    #hideAllDubs = false;
    #showSomeDubs = false;
    #dubsShown = [];

    static #dubsLangList = ["English", "Spanish", "French", "German", "Portuguese", "Others"];
    #dubsLangListInternal = ["english", "spanish", "french", "german", "portuguese", "others"];

    #showInQueue = true;
    #showOnlyInQueue = false;

    #showPremiere = true;
    #showOnlyPremiere = false;


    constructor(weekContent) {
        this.#weekContent = weekContent;
    }

    static dubLangs() {
        return Filter.#dubsLangList;
    }

    #show(dubsToShow) {
        this.#weekContent.show(this.#hideAllDubs, dubsToShow, !this.#showInQueue, this.#showOnlyInQueue, !this.#showPremiere, this.#showOnlyPremiere);
    }

    hideAllDubs() {
        if (!this.#hideAllDubs || this.#showSomeDubs) {


            this.#hideAllDubs = true;
            this.#showSomeDubs = false;
            this.#dubsShown = [];

            //TODO: Hide all dubs
            console.log("TODO: Hide all dubs");
            this.#show([]);
            console.log("Done hiding");
        }
    }

    showAllDubs() {
        if (this.#hideAllDubs || this.#showSomeDubs) {

            this.#hideAllDubs = false;
            this.#showSomeDubs = false;
            this.#dubsShown = this.#dubsLangListInternal;

            //TODO: Show all dubs
            console.log("TODO: Show all dubs");
            this.#show([]);
            console.log("Done showing");
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
            let toShow = intersection.filter(x => !this.#dubsShown.includes(x));
            let toHide = this.#dubsShown.filter(x => !intersection.includes(x));

            console.log("TODO: Show dubs of");
            console.log("To Show: " + toShow);
            console.log("To Hide: " + toHide);

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

            console.log("TODO: Hide in queue");
            this.#show(this.#dubsShown);
        }
    }

    showInQueue() {
        if (!this.#showInQueue || this.#showOnlyInQueue) {

            this.#showInQueue = true;
            this.#showOnlyInQueue = false;

            console.log("TODO: Show in queue");
            this.#show(this.#dubsShown);
        }
    }

    showInQueueOnly() {
        if (!this.#showOnlyInQueue) {

            this.#showInQueue = true;
            this.#showOnlyInQueue = true;

            console.log("TODO: Show in queue only");
            this.#show(this.#dubsShown);
        }
    }

    hidePermiere() {
        if (this.#showPremiere) {

            this.#showPremiere = false;
            this.#showOnlyPremiere = false;

            console.log("TODO: Hide premiere");
            this.#show(this.#dubsShown);
        }
    }

    showPermiere() {
        if (!this.#showPremiere || this.#showOnlyPremiere) {

            this.#showPremiere = true;
            this.#showOnlyPremiere = false;

            console.log("TODO: Show premiere");
            this.#show(this.#dubsShown);
        }
    }

    showPermiereOnly() {
        if (!this.#showOnlyPremiere) {

            this.#showPremiere = true;
            this.#showOnlyPremiere = true;

            console.log("TODO: Show premiere only");
            this.#show(this.#dubsShown);
        }
    }


}