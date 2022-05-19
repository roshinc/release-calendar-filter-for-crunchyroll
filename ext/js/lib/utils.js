const reflowHiddenCount = () => {

    if (reflowEnabled != undefined && reflowEnabled != true)
        return;

    let hiddenCounts = document.querySelectorAll(`.${CRRS_HIDDEN_COUNT_CLASS_NAME}`);

    hiddenCounts.forEach(element => {
        element.classList.remove("changed");
        void element.offsetHeight;
    });
};