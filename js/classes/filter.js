class Filter {

    #hideDubs = false;
    #dubsShownList = ["English", "Spanish", "French", "German", "Portuguese", "Others"];
    #inQueueToggle = "show";
    #permierToggle = "show";

    constructor(hideDubs, dubsShownList, inQueueToggle, premier) {

    }

    showDubs() {
        return this.#hideDubs;
    }

    showDubOf(language) {
        return this.#dubsShownList.includes(language);
    }


}