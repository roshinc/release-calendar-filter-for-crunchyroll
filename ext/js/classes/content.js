class Content {
  static #regexp = /^(.*) (?:\(([A-Z][a-z]+) Dub\))$/;
  static #id_prefix = "cr-rs-content-";
  #id;
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

  constructor(content) {
    this.#createID();
    this.#parseContent(content);
  }

  blurb() {
    let about = [];
    let index = 0;

    let episodesWord = 'episode';
    if (this.#multiEpisode) {
      episodesWord = `${episodesWord}s`
    }

    about[index] = `Show ${this.#showTitle} [${this.#seasonTitle}] has ${episodesWord} ${this.#episodesAvailable} avalible at ${this.#dateTime}.`;
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

    return about.join(' ');;
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
    const releaseArticle = content.querySelector('article.js-release');
    //const featuredEpArticle = releaseArticle.querySelector('article.js-featured-episode');

    const releaseArticleDataset = releaseArticle.dataset;
    // disabled for local testing
    // fetch(releaseArticleDataset.popoverUrl, {
    //   method: 'get'
    // }).then(
    //   r => r.json()
    // ).then(function (data) {
    //   this.popOverJson = data;
    // }).catch(function (err) {
    //   // Error :(
    // });

    this.#episodesAvailable = releaseArticleDataset.episodeNum;
    this.#multiEpisode = this.#episodesAvailable.includes('-');
    this.#showTitle = releaseArticleDataset.slug;

    // time element
    let time = new Date();
    time.setTime(Date.parse(releaseArticle.querySelector('time.available-time').dateTime));
    this.#dateTime = time;

    // queue flag
    if (releaseArticle.querySelector('.queue-flag.queued')) {
      this.#inQueue = true;
    } else {
      this.#inQueue = false;
    }

    // premiere flag
    if (releaseArticle.querySelector('.premiere-flag')) {
      this.#isPremiere = true;
    } else {
      this.#isPremiere = false;
    }

    // season name
    const seasonH1 = releaseArticle.querySelector("h1.season-name");
    const seasonUrl = seasonH1.querySelector("a");
    //this.#seasonURL = seasonUrl.href;
    this.#seasonTitle = seasonUrl.querySelector('cite').textContent;

    // dub info
    const found = this.#seasonTitle.match(Content.#regexp);
    this.#isDub = found != null;
    if (this.#isDub) {
      this.#dubLanguage = found[2];
      this.#seasonTitle = found[1];
    }


    // Set id
    content.id = this.#createID(releaseArticleDataset.slug, releaseArticleDataset.episodeNum, this.#isDub, this.#dubLanguage);

    /**
     * <li>
    <article class="release js-release " data-episode-num="1-12" data-group-id="277376" data-popover-url="/simulcastcalendar/popover/26494" data-slug="my-roommate-is-a-cat" itemscope="" itemtype="https://schema.org/TVSeason">
          <time datetime="2022-04-19T12:00:00-04:00" class="available-time">12:00pm</time>
  
                <div class="premiere-flag">
          Premiere
        </div>
      
          <div>
        <div class="queue-flag " group_id="277376">
          <svg viewBox="0 0 48 48">
            <title>In Queue</title>
            <use xlink:href="/i/svg/simulcastcalendar/calendar_icons.svg#cr_bookmark"></use>
          </svg>
        </div>
  
        <h1 class="season-name">
          <a class="js-season-name-link" href="https://www.crunchyroll.com/my-roommate-is-a-cat" itemprop="url">
            <cite itemprop="name">My Roommate is a Cat (English Dub)</cite>
          </a>
        </h1>
      </div>
  
          <div class="availability">
        
  
    
    <a class="available-episode-link js-episode-link-available" href="https://www.crunchyroll.com/my-roommate-is-a-cat/episode-1-an-encounter-with-the-unknown-843288">
                  Episodes 1-12
                 Available
      
    </a>
      </div>
  
          
        <article class="featured-episode js-featured-episode " data-episode-num="1" itemprop="episode" itemscope="" itemtype="https://schema.org/TVEpisode">
      <meta content="2022-04-19T12:00:00-04:00" itemprop="datePublished">
  
          <a class="episode-info js-episode-info" href="https://www.crunchyroll.com/my-roommate-is-a-cat/episode-1-an-encounter-with-the-unknown-843288" itemprop="url">
                      <div class="episode-label">
            Premiere
          </div>
  
          <meta content="1" itemprop="episodeNumber">
        
                <div class="thumbnail-container js-episode-thumbnail">
    <svg class="play-icon" viewBox="0 0 48 48">
      <title>Play Video</title>
      <use xlink:href="/i/svg/simulcastcalendar/calendar_icons.svg#cr_play_transparent"></use>
    </svg>
  
    <img class="thumbnail" src="https://img1.ak.crunchyroll.com/i/spire1-tmb/5bf5c268b0cc27f155c7cbae4d0e2fe71547052555_thumb.jpg" alt="" itemprop="image">
  
        <svg class="premium-flag" viewBox="0 0 48 48">
        <title>Premium Only</title>
        <use xlink:href="/i/svg/simulcastcalendar/calendar_icons.svg#cr_crown"></use>
      </svg>
    </div>
  
  <progress value="0" max="100">
      <div class="progress-bar">
      <div class="progress" style="width: 0%;">
        Progress: 0%
      </div>
    </div>
  </progress>
    <h1 class="episode-name">
      <cite itemprop="name">An Encounter with the Unknown</cite>
    </h1>
            </a>
    </article>
    </article>
  </li>
     */
    //console.log(content);
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
      this.#id = `${Content.#id_prefix}${contentSlug}-${episodesAvalible}-${dubLangLower}`
    } else {
      this.#id = `${Content.#id_prefix}${contentSlug}-${episodesAvalible}`
    }

    return this.#id;
  }

  /**
  * Make this content hidden
  */
  hide() {
    document.getElementById(this.#id).classList.add('cr-rs-hide');
  }

  /**
   * Make this content visable
   */
  show() {
    document.getElementById(this.#id).classList.remove('cr-rs-hide');
  }
}