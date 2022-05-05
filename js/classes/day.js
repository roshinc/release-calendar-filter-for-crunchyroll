class Day {

    #today;
    #todaysContentList = [];
    #todaysDubsList = [];
    #todaysInQueue = [];
    #todaysPermiere = [];

    #dubsHidden = false;

    constructor(today, content) {
        this.#today = today;
        this.#parseContent(content);
    }

    #parseContent(content) {
        const todaysContent = Array.from(content);

        todaysContent.forEach((content, index) => {
            const aContent = new Content(content);
            this.#todaysContentList[index] = aContent;
            if (aContent.isDubed) {
                this.#todaysDubsList.push(aContent);
            }
            if (aContent.isInQueue){
                this.#todaysInQueue.push(aContent);
            }
            if(aContent.isPermiere) {
                this.#todaysPermiere.push(aContent);
            }
        });
    }

    hideDubs() {
        this.#todaysDubsList.forEach((content, index) => {
            content.hide();
        });
    }

    showDubs() {
        this.#todaysDubsList.forEach((content, index) => {
            content.show();
        });
    }
}