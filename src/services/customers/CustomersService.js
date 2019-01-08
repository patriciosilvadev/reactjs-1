import axios from 'axios';

const axios_instance = axios.create({
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
    withCredentials: false
});

const BASE_API_URL='https://apifmsplus.jkdev.com';
const BASE_MONGO_API_URL='https://apifmsplusplus_mongo.jkdev.com';

class CustomersService {
    /**
     * @param regionId
     * @param statusId
     * @param location
     * @param latitude
     * @param longitude
     * @param searchText
     * @returns {Promise<any>}
     */
    getCustomersList =  (regionId ,statusId, location="all", latitude="", longitude="", searchText="") => {
        const data = {
            "RegionId": regionId,
            "StatusId": statusId,
            "Location": location,
            "Latitude": latitude,
            "Longitude": longitude,
            "SearchText": searchText
        };
        return new Promise((resolve, reject) => {
			console.log(data)
            axios_instance.post(`${BASE_API_URL}/v1/Customer/CustomerList`,data)
                .then( res => {
					console.log("service", res.status)
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
	getCustomerStatusList(){
		return new Promise((resolve, reject) => {
            axios_instance.get(`${BASE_API_URL}/v1/lists/getcustomerstatuslist?RegionId=99999`)
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
	}

	getAccountTypeList(){
		return new Promise((resolve, reject) => {
            axios_instance.get(`${BASE_API_URL}/v1/lists/GetAccountTypeList?RegionId=99999`)
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
	}
}

const instance = new CustomersService();
export default instance;