class Week {

    #weekStart;
    #daysOfTheWeek = [];

    constructor(content) {
        const days = Array.from(content);
        days.forEach((day, index) => {
          let time = new Date();
          time.setTime(Date.parse(day.querySelector('.specific-date time').dateTime));
          if(index == 0){
              this.#weekStart = time;
          }
          this.#daysOfTheWeek[index] = new Day(time, day.querySelectorAll("li"));
        });
    }

    hideDubs() {
        console.log("Hide on week called");
        this.#daysOfTheWeek.forEach((day, index) => {
            day.hideDubs();
        });
    }

    showDubs() {
        console.log("Show on week called");
        this.#daysOfTheWeek.forEach((day, index) => {
            day.showDubs();
        });
    }
    

}