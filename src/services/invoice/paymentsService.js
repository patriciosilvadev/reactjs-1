import axios from 'axios';
import moment from 'moment'
const axios_instance = axios.create({
	headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
	withCredentials: false
});

const BASE_API_URL = 'https://apifmsplus.jkdev.com';
const BASE_MONGO_API_URL = 'https://apifmsplusplus_mongo.jkdev.com';

class paymentsService {
    /**
     * gets invoice lists
     * @param RegionId
     * @param FromDate
     * @param ToDate
     * @param SearchText
     * @returns {Promise<any>}
     */
	getAccountReceivablePaymentsList = (RegionId, FromDate, ToDate, SearchText, Status) => {
		const data = {
			"RegionId": RegionId,
			"FromDate": FromDate,
			"ToDate": ToDate,
			"SearchText": SearchText,
			"Status": Status,
		}
		return new Promise((resolve, reject) => {
			axios_instance.post(`${BASE_MONGO_API_URL}/v1/Payment/PaymentList`, data)
				.then(res => {
					if (res.status === 200) {
						resolve(res.data);
					} else if (res.status !== 200) {
						reject(res.data);
					}
				})
				.catch(error => {
					resolve(error);
				})
		});
	}

	createAccountReceivablePayment = (RegionId, PaymentType, ReferenceNo, PaymentDate, Note, PayItems) => {
		const data = {
			"RegionId": RegionId,
			"PaymentType": PaymentType,
			"ReferenceNo": ReferenceNo,
			"PaymentDate": PaymentDate,
			"Note": Note,
			"PayItems": PayItems,
		}
		return new Promise((resolve, reject) => {
			axios_instance.post(`${BASE_MONGO_API_URL}/v1/payment/create`, data)
				.then(res => {
					if (res.status === 200) {
						resolve(res.data);
					} else if (res.status !== 200) {
						reject(res.data);
					}
				})
				.catch(error => {
					resolve(error);
				})
		});
	}
}

const instance = new paymentsService();
export default instance;