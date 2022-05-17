class Week {

    #weekStart;
    #daysOfTheWeek = [];

    constructor(content, showHiddenCount = true) {
        const days = Array.from(content);
        days.forEach((day, index) => {
            let dateElem = day.querySelector('.specific-date');
            let time = new Date();
            time.setTime(Date.parse(dateElem.querySelector('time').dateTime));

            if (index == 0) {
                this.#weekStart = time;
            }
            this.#daysOfTheWeek[index] = new Day(time, showHiddenCount ? createHiddenCount(dateElem.parentNode) : null, day.querySelectorAll("li"));
        });
    }

    show(hideAllDubs, allowedDubs, hideInQueue, showInQueueOnly, hidePermiere, showPermiereOnly) {
        this.#daysOfTheWeek.forEach((day, index) => {
            day.show(hideAllDubs, allowedDubs, hideInQueue, showInQueueOnly, hidePermiere, showPermiereOnly);
        });
    }


}