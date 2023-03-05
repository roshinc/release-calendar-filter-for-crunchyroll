import Content from "./content";
import { ALL_DUB_LANGUAGES } from "../lib/constants";
export default class Day {
  #today;
  #todaysContentList = [];
  #todaysDubsList = [];
  #todaysSubsList = [];
  #todaysInQueue = [];
  #todaysPermiere = [];
  #todaysDubsThatShouldBeShownInSubOnlyAlso = [];

  #hiddenCount;
  #numOfHiddenContent;
  #numOfShownContent;

  constructor(today, hiddenCount, content) {
    this.#today = today;
    this.#hiddenCount = hiddenCount;
    this.#parseContent(content);
  }

  #parseContent(content) {
    const todaysContent = Array.from(content);
    todaysContent.forEach((content, index) => {
      const aContent = new Content(content, index);
      this.#todaysContentList[index] = aContent;
      if (aContent.isDubed) {
        this.#todaysDubsList.push(aContent);
      }
      if (!aContent.isDubed) {
        this.#todaysSubsList.push(aContent);
      }
      if (aContent.isInQueue) {
        this.#todaysInQueue.push(aContent);
      }
      if (aContent.isPermiere) {
        this.#todaysPermiere.push(aContent);
      }
      if (aContent.isForceShowInSubOnlyAlso) {
        this.#todaysDubsThatShouldBeShownInSubOnlyAlso.push(aContent);
      }
    });
  }

  show(
    hideAllSubs,
    hideAllDubs,
    allowedDubs,
    hideInQueue,
    showInQueueOnly,
    hidePermiere,
    showPermiereOnly
  ) {
    let hiddenContent = [];

    if (hideAllSubs) {
      hiddenContent.push.apply(hiddenContent, this.#todaysSubsList);
    }

    if (hideAllDubs) {
      //if the force show in sub list is not empty, we want to show those dubs
      if (this.#todaysDubsThatShouldBeShownInSubOnlyAlso.length > 0) {
        // create a list of all the dubs that are not in the force show list
        const dubsToHide = this.#todaysDubsList.filter(
          (x) => !this.#todaysDubsThatShouldBeShownInSubOnlyAlso.includes(x)
        );
        // add the dubs to the hidden list
        hiddenContent.push.apply(hiddenContent, dubsToHide);
      } else {
        hiddenContent.push.apply(hiddenContent, this.#todaysDubsList);
      }
    } else {
      // set a boolean to check if the 'other' option in allowedDubs
      const isOtherAllowed = allowedDubs.includes("others");
      // get ths list of all known dub languages
      const knownDubsLangs = ALL_DUB_LANGUAGES.map((x) => x.toLowerCase());
      if (allowedDubs.length > 0) {
        this.#todaysDubsList.forEach((content, index) => {
          if (!allowedDubs.includes(content.dubLang.toLowerCase())) {
            // if the 'other' option is allowed, we want to also show dubs that are not in the known list
            if (
              isOtherAllowed &&
              !knownDubsLangs.includes(content.dubLang.toLowerCase())
            ) {
              console.log("Unknown dub language: " + content.dubLang);
            } else {
              hiddenContent.push(content);
            }
          }
        });
      }
    }
    if (hideInQueue) {
      hiddenContent.push.apply(hiddenContent, this.#todaysInQueue);
    }

    if (hidePermiere) {
      hiddenContent.push.apply(hiddenContent, this.#todaysPermiere);
    }
    const seen = new Set();
    let uniqueListToHide = hiddenContent.filter((el) => {
      const duplicate = seen.has(el.id);
      seen.add(el.id);
      return !duplicate;
    });

    let toShow = this.#todaysContentList.filter(
      (x) => !uniqueListToHide.includes(x)
    );

    if (showInQueueOnly && showPermiereOnly) {
      toShow = toShow.filter((x) => x.isInQueue || x.isPermiere);
      uniqueListToHide = this.#todaysContentList.filter(
        (x) => !toShow.includes(x)
      );
    } else if (showInQueueOnly) {
      toShow = toShow.filter((x) => x.isInQueue);
      uniqueListToHide = this.#todaysContentList.filter(
        (x) => !toShow.includes(x)
      );
    } else if (showPermiereOnly) {
      toShow = toShow.filter((x) => x.isPermiere);
      uniqueListToHide = this.#todaysContentList.filter(
        (x) => !toShow.includes(x)
      );
    }

    this.#hideContentInArray(uniqueListToHide);
    this.#showContentInArray(toShow);
    if (this.#hiddenCount != null) {
      this.#hiddenCount.state.count = uniqueListToHide.length;
      this.#hiddenCount.state.changed =
        !(this.#todaysContentList.length == 0) &&
        (this.#numOfHiddenContent != uniqueListToHide.length ||
          this.#numOfShownContent != toShow.length);

      this.#numOfHiddenContent = uniqueListToHide.length;
    }
    this.#numOfShownContent = toShow.length;
  }

  #hideContentInArray(contents) {
    contents.forEach((content, index) => {
      content.hide();
    });
  }

  #showContentInArray(contents) {
    contents.forEach((content, index) => {
      content.show();
    });
  }
}
