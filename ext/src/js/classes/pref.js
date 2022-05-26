class Pref {

    // Hold filter object
    #crrsFilter;

    // Hold toggle for reflow
    #reflowEnabled;

    constructor() { }

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


}

const preference = Pref.getInstance();

export default preference;