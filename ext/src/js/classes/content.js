import {createProgressBar} from "../lib/ui_modifier";
import {getPopoverID} from '../lib/utils.js';

export default class Content {
    static #regexp =
        /^(.*) ?(?:\(([A-Z][a-z]+(?:-(?:[A-Z]{2}))?(?: ?[A-Z][a-z]+)?) Dub\)?)$/;
    // This is a special case for English dubs, which are not marked as such in the season title
    static #regexp_for_english_dub_special_case = /^(.*) ?(?:\(Dub\)?)$/;
    // This is a special case for the Crunchyroll Anime Awards
    static #regexp_for_cr_anime_awards =
        /^(?!.*Japanese)(.*) (?:\(([A-Z][a-z]+(?:-(?:[A-Z]{2}))?) Audio\)?)$/;
    // This is a special case for the Crunchyroll Anime Awards english dub
    static #regexp_for_cr_anime_awards_english_dub =
        /^(The \d{4} Crunchyroll Anime Awards)$/;

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

    constructor(content, index, tinyContents) {
        //this.#createID(index);
        this.#contentIndex = index;
        this.#parseContent(content, tinyContents);
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

    #parseContent(content, tinyContents) {
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
            console.log(`Restore needed for ${this.#seasonTitle}`);
            // If the season title does not start with the original season title, restore it
            if (!this.#seasonTitle.startsWith(originalSeasonTitle)) {
                seasonUrl.querySelector("cite").textContent = originalSeasonTitle;
            } else {
                seasonUrl.querySelector("cite").textContent = this.#seasonTitle;
            }
        }

        // dub info
        const found = this.#seasonTitle.match(Content.#regexp);
        this.#isDub = found != null;
        if (this.#isDub) {
            this.#dubLanguage = found[2];
            // Replace the spaces in the dub language with dashes
            // for handling languages with multiple words e.g. European Portuguese
            this.#dubLanguage = this.#dubLanguage.replace(" ", "-");
            this.#seasonTitle = found[1];
        }

        // if it was not detected as a dub, check if it is the special case of english dub
        if (!this.#isDub) {
            const found = this.#seasonTitle.match(
                Content.#regexp_for_english_dub_special_case
            );
            this.#isDub = found != null;
            if (this.#isDub) {
                this.#dubLanguage = "English";
                this.#seasonTitle = found[1];
                console.log(`English dub special case detected: ${this.#seasonTitle}`);
            }
        }

        // if it was not detected as a dub, check if it is the special case of the Crunchyroll Anime Awards
        if (!this.#isDub) {
            const found = this.#seasonTitle.match(
                Content.#regexp_for_cr_anime_awards
            );
            this.#isDub = found != null;
            if (this.#isDub) {
                this.#dubLanguage = found[2];
                this.#seasonTitle = found[1];
                console.log(
                    `CR Anime Awards special case detected: ${this.#seasonTitle} - ${this.#dubLanguage
                    }`
                );
            }
        }

        // if it was not detected as a dub, check if it is the special case of the Crunchyroll Anime Awards english dub
        if (!this.#isDub) {
            const found = this.#seasonTitle.match(
                Content.#regexp_for_cr_anime_awards_english_dub
            );
            this.#isDub = found != null;
            if (this.#isDub) {
                this.#dubLanguage = "English";
                this.#seasonTitle = found[1];
                console.log(
                    `CR Anime Awards english dub special case detected: ${this.#seasonTitle
                    }`
                );
                // this special case also requires it to be shown in sub only mode
                this.#forceShowInSubOnlyAlso = true;
            }
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
