import { getNZUtcOffset } from "../day.helpers";

export type Place = {
    latitude: number;
    longitude: number;
    name: string;
    utcOffset: number;
    placeId?: string;
}

export const Wellington: Place = {
    name: "Wellington, New Zealand 🇳🇿",
    latitude: -41.2923814,
    longitude: 174.7787463,
    utcOffset: getNZUtcOffset(),
    placeId: undefined
}

export const DefaultPlace: Place = {
    name: "",
    latitude: 0,
    longitude: 0,
    utcOffset: 0, //new Date().getTimezoneOffset() * -1
    placeId: undefined
}
