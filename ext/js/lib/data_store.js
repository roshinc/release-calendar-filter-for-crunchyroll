const saveFilter = (filter) => {
    const filterHolder = {};
    filterHolder["filter"] = filter;
    chrome.storage.sync.set(filterHolder, function () {
        console.log('Value is set to ');
        console.log(filter);
        console.log(filterHolder);
    });
};


const restoreFilter = (callbackMethod, modifyUI = true) => {
    chrome.storage.sync.get(['filter'], function (result) {
        console.log('Value currently is ' + result);
        console.log(result);
        if (result['filter']) {
            callbackMethod(result['filter'], modifyUI);
        }
    });
}

const clearSavedFilter = () => {
    chrome.storage.sync.remove(['filter'], function (result) {
        console.log('Value cleared, currently is ' + result);

    });
}