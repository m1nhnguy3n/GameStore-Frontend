// utils
import axios from '../utils/axios';


export function addCdkeyApi(cdkeys) {
    return axios.post('cdkey', cdkeys);
}

export function getCdkeyApi(productId) {
    return axios.get(`/cdkey/${productId}`);
}