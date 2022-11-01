export type Place = {
    latitude: number;
    longitude: number;
    name: string;
}

export const Wellington: Place = {
    name: "Wellington, New Zealand",
    latitude: -41.2923814,
    longitude: 174.7787463
}

export const DefaultPlace: Place = {
    name: "Location",
    latitude: 0,
    longitude: 0
}
