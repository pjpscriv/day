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
    utcOffset: 720 // +12 hours
}

export const DefaultPlace: Place = {
    name: "Location",
    latitude: 0,
    longitude: 0,
    utcOffset: new Date().getTimezoneOffset() * -1
}
