// Convert saveData to a string, then to binary, then save to LocalStorage.
export var saveData = function (namespace, saveData) {
    let jsonSaveData = JSON.stringify(saveData);
    localStorage[namespace] = btoa(jsonSaveData);
};


// Turn saveData from binary, to a string, then return object.
export var loadData = function(namespace, slot) {
    // If no save data at all, create it for the first time
    if (!localStorage[namespace]) {
        let newSaveData = {};
        newSaveData[slot] = {};
        saveData(namespace, newSaveData);
    }

    // Save data exists, but no slot
    let existingData = JSON.parse(atob(localStorage[namespace]));
    if (!existingData[slot]) {
        existingData[slot] = {};
    }

    return existingData[slot];
}


export var loadAllData = function(namespace) {
    let existingData = JSON.parse(atob(localStorage[namespace]));
    return existingData;
}
