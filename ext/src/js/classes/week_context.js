import DubDetector from "./dub_detector.js";

export default class WeekContext {
    #dubDetector;
    #tinyContents = null;


    constructor(tinyContents = null) {
        this.#tinyContents = tinyContents;
        this.#dubDetector = new DubDetector();
    }

    get dubDetector() {
        return this.#dubDetector;
    }

    get tinyContents() {
        return this.#tinyContents;
    }
}

