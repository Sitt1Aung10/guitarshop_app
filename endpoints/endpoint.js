import { Platform } from 'react-native';

const BASE_URL = `http://192.168.99.241:8000/api/`;

export default {
    baseurl: BASE_URL,
    allItems: `${BASE_URL}items`,
    orders: `${BASE_URL}orders`,
};