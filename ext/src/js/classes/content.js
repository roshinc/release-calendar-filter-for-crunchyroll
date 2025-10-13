import {createProgressBar} from "../lib/ui_modifier";
import {getPopoverID} from '../lib/utils.js';

export default class Content {


    static #id_prefix = "cr-rs-content-";
    #id;
    #contentIndex;
    #dateTime;
    #showTitle;
    #seasonTitle;
    #episodesAvailable;
    #multiEpisode;
    #isPremiere;
    #inQueue;
    #isDub;
    #dubLanguage;
    #forceShowInSubOnlyAlso = false;

    #weekContext;

    constructor(content, index, weekContext) {
        //this.#createID(index);
        this.#contentIndex = index;
        this.#weekContext = weekContext;
        this.#parseContent(content);
    }

    blurb() {
        let about = [];
        let index = 0;

        let episodesWord = "episode";
        if (this.#multiEpisode) {
            episodesWord = `${episodesWord}s`;
        }

        about[index] = `Show ${this.#showTitle} [${this.#seasonTitle
        }] has ${episodesWord} ${this.#episodesAvailable} avalible at ${this.#dateTime
        }.`;
        index++;

        if (this.#inQueue) {
            about[index] = "This show is in your queue.";
            index++;
        }

        if (this.#isPremiere) {
            about[index] = "This show is premiering with this episode.";
            index++;
        }

        if (this.#isDub) {
            about[index] = `This is dubbed in ${this.#dubLanguage}`;
            index++;
        }

        return about.join(" ");
    }

    get id() {
        return this.#id;
    }

    get isDubed() {
        return this.#isDub;
    }

    get dubLang() {
        return this.#dubLanguage;
    }

    get isInQueue() {
        return this.#inQueue;
    }

    get isPremiere() {
        return this.#isPremiere;
    }

    get isForceShowInSubOnlyAlso() {
        return this.#forceShowInSubOnlyAlso;
    }

    #parseContent(content) {
        let shouldSeasonTitleBeModified = false;
        const releaseArticle = content.querySelector("article.js-release");

        const releaseArticleDataset = releaseArticle.dataset;

        this.#episodesAvailable = releaseArticleDataset.episodeNum;
        this.#multiEpisode = this.#episodesAvailable.includes("-");
        this.#showTitle = releaseArticleDataset.slug;

        // time element
        let time = new Date();
        time.setTime(
            Date.parse(releaseArticle.querySelector("time.available-time").dateTime)
        );
        this.#dateTime = time;

        // queue flag
        if (releaseArticle.querySelector(".queue-flag.queued")) {
            this.#inQueue = true;
        } else {
            this.#inQueue = false;
        }

        // premiere flag
        if (releaseArticle.querySelector(".premiere-flag")) {
            this.#isPremiere = true;
        } else {
            this.#isPremiere = false;
        }


        /*
         * If the tinyContents are provided, and the current content has a popoverId,
         * we will try to find the corresponding TinyContent object
         * We can use this to get the real values for parsing.
         */
        const tinyContents = this.#weekContext.tinyContents;
        // season name
        const seasonH1 = releaseArticle.querySelector("h1.season-name");
        const seasonUrl = seasonH1.querySelector("a");
        this.#seasonTitle = seasonUrl.querySelector("cite").textContent;
        const originalSeasonTitle = this.#seasonTitle;

        if (tinyContents) {
            const popoverId = getPopoverID(releaseArticleDataset);
            if (popoverId) {
                // Find the TinyContent object with the matching popoverId
                const tinyContent = tinyContents.find(tc => tc.popoverId === popoverId);
                if (tinyContent) {
                    shouldSeasonTitleBeModified = true;
                    // console.log(`TinyContent found: ${tinyContent.blurb()}`);
                    // season name
                    //console.log(`Replacing season title with TinyContent: ${tinyContent.seasonTitle}, original: ${this.#seasonTitle}`);
                    this.#seasonTitle = tinyContent.seasonTitle;
                } else {
                    console.warn(`TinyContent with popoverId ${popoverId} not found.`);
                }
            }
        }

        // console.log(`Starting name check with season title: ${this.#seasonTitle}`);

        if (shouldSeasonTitleBeModified) {
            // If the season title does not start with the original season title, restore it
            if (!this.#seasonTitle.startsWith(originalSeasonTitle)) {
                console.log(`Restore needed for ${this.#seasonTitle}`);
                seasonUrl.querySelector("cite").textContent = originalSeasonTitle;
            } else {
                seasonUrl.querySelector("cite").textContent = this.#seasonTitle;
            }
        }

        // dubbed
        const detectedResponse = this.#weekContext.dubDetector.detect(this.#seasonTitle);
        if (detectedResponse.isDub) {
            this.#isDub = detectedResponse.isDub;
            this.#dubLanguage = detectedResponse.dubLanguage;
            this.#forceShowInSubOnlyAlso = detectedResponse.forceShowInSubOnlyAlso;
            this.#seasonTitle = detectedResponse.title;
            console.log(`Detected dubbed content: ${detectedResponse}`);
            console.log(detectedResponse)
        }


        // progress bar
        const currentProgress = releaseArticle.querySelector("progress");
        // Test series doesn't have progress (Sign of things to come or just an oversite)
        if (currentProgress && currentProgress.value > 0) {
            createProgressBar(releaseArticle, currentProgress.value);
        }

        // Set id
        content.id = this.#createID(
            releaseArticleDataset.slug,
            releaseArticleDataset.episodeNum,
            this.#isDub,
            this.#dubLanguage
        );
        // create a class for this content with the dub language, if it is dubbed
        let contentClass = "cr-rs-no-dub";
        if (this.#isDub) {
            contentClass = "cr-rs-" + this.#dubLanguage.toLowerCase();
        }

        // Check if the class is not already present
        if (!content.classList.contains(contentClass)) {
            // Add the class
            content.classList.add(contentClass);
        }
    }

    /**
     * Creates a recreatable id for this content.
     *
     * @param {string} contentSlug the sulg of this content
     * @param {string} episodesAvalible the episode (or range of) in this content
     * @param {boolean} isDubbed is this content dubbed?
     * @param {string} dubLang if dubbed what lang?
     * @returns {string} the id for this content
     */
    #createID(contentSlug, episodesAvalible, isDubbed, dubLang) {
        if (isDubbed) {
            let dubLangLower = dubLang.toLowerCase();
            this.#id = `${Content.#id_prefix
            }${contentSlug}-${episodesAvalible}-${dubLangLower}-${this.#dateTime.getDay()}-${this.#contentIndex
            }`;
        } else {
            this.#id = `${Content.#id_prefix}${contentSlug}-${episodesAvalible}-${this.#contentIndex
            }-${this.#dateTime.getDay()}-${this.#contentIndex}`;
        }

        return this.#id;
    }

    /**
     * Make this content hidden
     */
    hide() {
        document.getElementById(this.#id).classList.add("cr-rs-hide");
    }

    /**
     * Make this content visable
     */
    show() {
        document.getElementById(this.#id).classList.remove("cr-rs-hide");
    }
}
