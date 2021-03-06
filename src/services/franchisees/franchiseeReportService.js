/**
 * Franchisee Service
 */

import axios from 'axios';
import {BASE_MONGO_API_URL} from './../../services'

const axios_instance = axios.create({
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
    withCredentials: false
});

const BASE_API_URL='https://apifmsplus.jkdev.com';

class franchiseeReportService {

    /**
     * @method GET
     *
     * @param RegionId
     * @returns {Promise<any>}
     */
    getFranchiseeReportData = (RegionId) => {
        return new Promise((resolve, reject) => {
            axios.get(`/v1/franchiseereport`)
                .then( res => {
                    if(res.status===200) {
                        resolve(res.data);
                    }
                    else if(res.status!==200){
                        reject(res.data);
                    }
                })
                .catch(error=>{
                    resolve(error);
                })
        });
    };

}

const instance = new franchiseeReportService();
export default instance;
