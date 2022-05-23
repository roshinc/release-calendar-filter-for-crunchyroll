const saveFilter = (filter) => {
    const filterHolder = {};
    filterHolder["filter"] = filter;
    // console.log(filterHolder);
    // localStorage.setItem('filter', JSON.stringify(filterHolder));
    // console.log(localStorage);
    chrome.storage.sync.set(filterHolder, function () {
        console.log('Value is set to ');
        console.log(filter);
        console.log(filterHolder);
    });
};


const restoreFilter = (callbackMethod, modifyUI = true) => {
    // const filterstr = localStorage.getItem('filter');
    // console.log(filterstr);
    // const parsedFilter = JSON.parse(filterstr);
    // console.log(parsedFilter);
    // if (filterstr) {
    //     callbackMethod(parsedFilter["filter"], modifyUI);
    // }
    // const t7 = performance.now();
    // console.log(`Call to restoreFilter took ${t7 - t6} milliseconds.`);

    chrome.storage.sync.get({
        filter: null
    }, function (items) {
        if (items.filter != null) {
            callbackMethod(items.filter, modifyUI);
            const t7 = performance.now();
            console.log(`Call to restoreFilter took ${t7 - t6} milliseconds.`);
        }
    });
}

const clearSavedFilter = () => {
    chrome.storage.sync.remove(['filter'], function (result) {
        console.log('Value cleared, currently is ' + result);

    });
}