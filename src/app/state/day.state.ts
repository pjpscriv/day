import { QueryAutocompletePrediction } from "../types/google-maps.type";
import { DefaultPlace, Place, Wellington } from "../types/place.type";

export type StoreState<T> = {
    isLoading: boolean;
    item: T;
    error?: string;
}

export type DayState = {
    suggestedLocations: StoreState<QueryAutocompletePrediction[]>;
    time: Date;
    place: Place;
}

export const initialState: DayState = {
    suggestedLocations: { isLoading: false, item: [] },
    time: new Date(),
    place: Wellington
}

const tokyo = { description: 'Tokyo, Japan', place_id: 'ChIJ51cu8IcbXWARiRtXIothAS4', matched_substrings: [], terms: [] };
const delhi = { description: 'Delhi, India', place_id: 'ChIJLbZ-NFv9DDkRQJY4FbcFcgM', matched_substrings: [], terms: [] };
const shanghai = { description: 'Shanghai, China', place_id: 'ChIJMzz1sUBwsjURoWTDI5QSlQI', matched_substrings: [], terms: [] };
const saoPaulo = { description: 'São Paulo, Brazil', place_id: 'ChIJrVgvRn1ZzpQRF3x74eJBUh4', matched_substrings: [], terms: [] };
const mexicoCity = { description: 'Mexico City, Mexico', place_id: 'ChIJJyk1sTYAzoURW4rR6E6e_d4', matched_substrings: [], terms: [] };
const cairo = { description: 'Cairo, Egypt', place_id: 'ChIJ674hC6Y_WBQRujtC6Jay33', matched_substrings: [], terms: [] };
const mumbai = { description: 'Mumbai, India', place_id: 'ChIJwe1EZjDG5zsRaYxkjY_tpF0', matched_substrings: [], terms: [] };
const beijing = { description: 'Beijing, China', place_id: 'ChIJuSwU55ZS8DURiqkPryBWYrk', matched_substrings: [], terms: [] };
const dhaka = { description: 'Dhaka, Bangladesh', place_id: 'ChIJgWsCh7C4VTcRwgRZ3btjpY8', matched_substrings: [], terms: [] };
const osaka = { description: 'Osaka, Japan', place_id: 'ChIJ4eIGNFXmAGAR5y9q5G7BW8U', matched_substrings: [], terms: [] };
const newYork = { description: 'New York, NY, USA', place_id: 'ChIJOwg_06VPwokRYv534QaPC8g', matched_substrings: [], terms: [] };
const tehran = { description: 'Tehran, Iran', place_id: 'ChIJ2dzzH0kAjj8RvCRwVnxps_A', matched_substrings: [], terms: [] };
const karachi = { description: 'Karachi, Pakistan', place_id: 'ChIJv0sdZQY-sz4RIwxaVUQv-Zw', matched_substrings: [], terms: [] };

export const mostPopulatedCities = [
    tokyo, // 🇯🇵
    delhi, // 🇮🇳
    shanghai, // 🇨🇳
    saoPaulo, // 🇧🇷
    mexicoCity, // 🇲🇽
    cairo, // 🇪🇬
    // mumbai, // 🇮🇳
    // beijing, // 🇨🇳
    dhaka, // 🇧🇩
    // osaka, // 🇯🇵
    newYork, // 🇺🇸
    tehran, // 🇮🇷
    karachi // 🇵🇰
];