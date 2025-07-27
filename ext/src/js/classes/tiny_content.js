import {getPopoverID} from '../lib/utils.js';

export default class TinyContent {

    #popoverId;
    #contentIndex;
    #showTitle;
    #seasonTitle;

    constructor(releaseArticle, index) {
        this.#contentIndex = index;
        this.#parseContent(releaseArticle);
    }

    blurb() {
        let about = [];
        let index = 0;

        let episodesWord = "episode";

        about[index] = `Show ${this.#showTitle} [${this.#seasonTitle
        }] has ${episodesWord} available. The popover ID is ${this.#popoverId}.`;
        index++;

        return about.join(" ");
    }

    get popoverId() {
        return this.#popoverId;
    }


    get contentIndex() {
        return this.#contentIndex;
    }

    get showTitle() {
        return this.#showTitle;
    }

    get seasonTitle() {
        return this.#seasonTitle;
    }

    #parseContent(releaseArticle) {

        const releaseArticleDataset = releaseArticle.dataset;

        this.#popoverId = getPopoverID(releaseArticleDataset);

        this.#showTitle = releaseArticleDataset.slug;

        // season name
        const seasonH1 = releaseArticle.querySelector("h1.season-name");
        const seasonUrl = seasonH1.querySelector("a");

        this.#seasonTitle = seasonUrl.querySelector("cite").textContent;


    }
}
