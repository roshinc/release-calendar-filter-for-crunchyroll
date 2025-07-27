class Pref {

    // Hold filter object
    #crrsFilter;

    // Hold toggle for reflow
    #reflowEnabled;

    // Hold saved languages
    #savedLanguages;

    constructor() {
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Pref();
        }

        return this.instance;
    }

    /**
     * @param {Filter} crrsFilter
     */
    set crrsFilter(crrsFilter) {
        console.log("Setting filter");
        console.log(crrsFilter);
        this.#crrsFilter = crrsFilter;
    }

    get crrsFilter() {
        return this.#crrsFilter;
    }

    /**
     * @param {boolean} reflowEnabled
     */
    set reflowEnabled(reflowEnabled) {
        this.#reflowEnabled = reflowEnabled;
    }

    get reflowEnabled() {
        return this.#reflowEnabled;
    }

    set savedLanguages(savedLanguages) {
        this.#savedLanguages = savedLanguages;
    }

    get savedLanguages() {
        return this.#savedLanguages;
    }


}

const preference = Pref.getInstance();

export default preference;