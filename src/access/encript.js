import CryptoJS from "crypto-js";
import {toUpper} from "lodash";
import {PRIVATE_API_KEY} from './requestedData';

export default (key = '') => {
    if(key) return CryptoJS.MD5(key)
    else return toUpper(CryptoJS.MD5(PRIVATE_API_KEY))
}