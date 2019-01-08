import axios from 'axios';

const axios_instance = axios.create({
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
    withCredentials: false
});

const BASE_API_URL='https://apifmsplus_c.jkdev.com';

class initialService {
    loadHomeScreen =  () => {
        return new Promise((resolve, reject) => {
            axios_instance.get(`${BASE_API_URL}/v1/apps/get?appid=2&env=local&device=web`)
                .then( res => {
                    if(res.status===200) {
                        resolve(res.data);
                    }
                    else if(res.status!==200){
                        reject(res.data);
                    }
                })
        });
    };
}

const initialServiceInstance = new initialService();
export default initialServiceInstance;