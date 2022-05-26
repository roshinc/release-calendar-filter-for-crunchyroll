export const saveFilter = (filter) => {
    const filterHolder = {};
    filterHolder["filter"] = filter;
    chrome.storage.sync.set(filterHolder, function () {
        console.log('Value is set to ');
        console.log(filter);
        console.log(filterHolder);
    });
};


export const restoreFilter = (callbackMethod, modifyUI = true) => {
    chrome.storage.sync.get({
        filter: null
    }, function (items) {
        if (items.filter != null) {
            callbackMethod(items.filter, modifyUI);
        }
    });
}

export const clearSavedFilter = () => {
    chrome.storage.sync.remove(['filter'], function (result) {
        console.log('Value cleared, currently is ' + result);
    });
}