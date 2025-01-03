import { QueryAutocompletePrediction } from "./google-maps.types";

// Biggest cities in the world
const tokyo = { description: 'Tokyo, Japan', place_id: 'ChIJ51cu8IcbXWARiRtXIothAS4', matched_substrings: [], terms: [], emoji: '🇯🇵' };
const delhi = { description: 'Delhi, India', place_id: 'ChIJLbZ-NFv9DDkRQJY4FbcFcgM', matched_substrings: [], terms: [], emoji: '🇮🇳' };
const shanghai = { description: 'Shanghai, China', place_id: 'ChIJMzz1sUBwsjURoWTDI5QSlQI', matched_substrings: [], terms: [], emoji: '🇨🇳' };
const saoPaulo = { description: 'São Paulo, Brazil', place_id: 'ChIJrVgvRn1ZzpQRF3x74eJBUh4', matched_substrings: [], terms: [], emoji: '🇧🇷' };
const mexicoCity = { description: 'Mexico City, Mexico', place_id: 'ChIJJyk1sTYAzoURW4rR6E6e_d4', matched_substrings: [], terms: [], emoji: '🇲🇽' };
const cairo = { description: 'Cairo, Egypt', place_id: 'ChIJ674hC6Y_WBQRujtC6Jay33k', matched_substrings: [], terms: [], emoji: '🇪🇬' };
const mumbai = { description: 'Mumbai, India', place_id: 'ChIJwe1EZjDG5zsRaYxkjY_tpF0', matched_substrings: [], terms: [], emoji: '🇮🇳' };
const beijing = { description: 'Beijing, China', place_id: 'ChIJuSwU55ZS8DURiqkPryBWYrk', matched_substrings: [], terms: [], emoji: '🇨🇳' };
const dhaka = { description: 'Dhaka, Bangladesh', place_id: 'ChIJgWsCh7C4VTcRwgRZ3btjpY8', matched_substrings: [], terms: [], emoji: '🇧🇩' };
const osaka = { description: 'Osaka, Japan', place_id: 'ChIJ4eIGNFXmAGAR5y9q5G7BW8U', matched_substrings: [], terms: [], emoji: '🇯🇵' };
const newYork = { description: 'New York, NY, USA', place_id: 'ChIJOwg_06VPwokRYv534QaPC8g', matched_substrings: [], terms: [], emoji: '🇺🇸' };
const tehran = { description: 'Tehran, Iran', place_id: 'ChIJ2dzzH0kAjj8RvCRwVnxps_A', matched_substrings: [], terms: [], emoji: '🇮🇷' };
const karachi = { description: 'Karachi, Pakistan', place_id: 'ChIJv0sdZQY-sz4RIwxaVUQv-Zw', matched_substrings: [], terms: [], emoji: '🇵🇰' };

// Coolest cities in the world
const wellington = { description: 'Wellington, New Zealand', place_id: 'ChIJy3TpSfyxOG0RcLQTomPvAAo', matched_substrings: [], terms: [], emoji: '🇳🇿' };
const montreal = { description: 'Montréal, Canada', place_id: 'ChIJDbdkHFQayUwR7-8fITgxTmU', matched_substrings: [], terms: [], emoji: '🇨🇦' };

export const mostPopulatedCities: QueryAutocompletePrediction[] = [
    tokyo,
    delhi,
    montreal,
    shanghai,
    saoPaulo,
    mexicoCity,
    cairo,
    // mumbai,
    // beijing,
    dhaka,
    // osaka,
    wellington,
    newYork,
    tehran,
    karachi
].map((city) => ({ ...city, description: `${city.description} ${city.emoji}` }));
