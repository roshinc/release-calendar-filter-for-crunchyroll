import Day from "./day";
import {createHiddenCount} from "../lib/ui_modifier";
import WeekContext from "./week_context.js";

export default class Week {
    #weekStart;
    #daysOfTheWeek = [];
    #weekContext;

    constructor(content, tinyContents, showHiddenCount = true) {
        // initialize the week context
        this.#weekContext = new WeekContext(tinyContents);
        // destructuring the content and looping through it
        [...content].forEach((day, index) => {
            let dateElem = day.querySelector(".specific-date");
            let time = new Date();
            time.setTime(Date.parse(dateElem.querySelector("time").dateTime));

            if (index === 0) {
                this.#weekStart = time;
            }
            this.#daysOfTheWeek[index] = new Day(
                this.#weekContext,
                time,
                showHiddenCount ? createHiddenCount(dateElem.parentNode) : null,
                day.querySelectorAll("li")
            );
        });
    }

    show(
        hideAllSubs,
        hideAllDubs,
        allowedDubs,
        hideInQueue,
        showInQueueOnly,
        hidePremiere,
        showPremiereOnly
    ) {
        this.#daysOfTheWeek.forEach((day, index) => {
            day.show(
                hideAllSubs,
                hideAllDubs,
                allowedDubs,
                hideInQueue,
                showInQueueOnly,
                hidePremiere,
                showPremiereOnly
            );
        });
    }
}
