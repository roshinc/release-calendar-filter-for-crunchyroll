import { createProgressBar } from "../lib/ui_modifier";

export default class Content {
  static #regexp = /^(.*) ?(?:\(([A-Z][a-z]+(?:-(?:[A-Z]{2}))?) Dub\)?)$/;
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
  /* 
   #topEpisodeName;
   #topEpisodeURL;
   #thumbnailURL;
   #seasonURL;
   
  popOverJson;
  */

  constructor(content, index) {
    //this.#createID(index);
    this.#contentIndex = index;
    this.#parseContent(content);
  }

  blurb() {
    let about = [];
    let index = 0;

    let episodesWord = "episode";
    if (this.#multiEpisode) {
      episodesWord = `${episodesWord}s`;
    }

    about[index] = `Show ${this.#showTitle} [${
      this.#seasonTitle
    }] has ${episodesWord} ${this.#episodesAvailable} avalible at ${
      this.#dateTime
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

  get isPermiere() {
    return this.#isPremiere;
  }

  #parseContent(content) {
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

    // season name
    const seasonH1 = releaseArticle.querySelector("h1.season-name");
    const seasonUrl = seasonH1.querySelector("a");
    this.#seasonTitle = seasonUrl.querySelector("cite").textContent;

    // dub info
    const found = this.#seasonTitle.match(Content.#regexp);
    this.#isDub = found != null;
    if (this.#isDub) {
      this.#dubLanguage = found[2];
      this.#seasonTitle = found[1];
    }

    // progress bar
    const currentProgress = releaseArticle.querySelector("progress");
    if (currentProgress.value > 0) {
      createProgressBar(releaseArticle, currentProgress.value);
    }

    // Set id
    content.id = this.#createID(
      releaseArticleDataset.slug,
      releaseArticleDataset.episodeNum,
      this.#isDub,
      this.#dubLanguage
    );
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
      this.#id = `${
        Content.#id_prefix
      }${contentSlug}-${episodesAvalible}-${dubLangLower}-${this.#dateTime.getDay()}-${
        this.#contentIndex
      }`;
    } else {
      this.#id = `${Content.#id_prefix}${contentSlug}-${episodesAvalible}-${
        this.#contentIndex
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
