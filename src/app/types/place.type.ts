export type Place = {
    latitude: number;
    longitude: number;
    name: string;
    utcOffset: number;
}

export const Wellington: Place = {
    name: "Wellington, New Zealand",
    latitude: -41.2923814,
    longitude: 174.7787463,
    utcOffset: getNZUtcOffset()
}

export const DefaultPlace: Place = {
    name: "",
    latitude: 0,
    longitude: 0,
    utcOffset: 0 //new Date().getTimezoneOffset() * -1
}


function getNZUtcOffset() {
    const now = new Date();
    const year = now.getFullYear();

    // Get the last Sunday in September
    const startOfDST = new Date(year, 8, 30); // September 30
    while (startOfDST.getDay() !== 0) {
        startOfDST.setDate(startOfDST.getDate() - 1);
    }

    // Get the first Sunday in April
    const endOfDST = new Date(year, 3, 1); // April 1
    while (endOfDST.getDay() !== 0) {
        endOfDST.setDate(endOfDST.getDate() + 1);
    }

    const isDST = now < endOfDST || startOfDST <= now;
    const utcOffSet = isDST ? (13 * 60) : (12 * 60);

    return utcOffSet;
}
