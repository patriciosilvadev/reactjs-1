import axios from "axios";
import { customersService } from "services";

export const GET_ALL_CUSTOMERS = "[CUSTOMERS] GETS ALL";
export const GET_ALL_DOCUMENTS = "[CUSTOMERS] DOCUMENTS GETS ALL";
export const DELETE_SELECTED_CUSTOMERS = "[CUSTOMERS] DELETE SELECTED";
export const REMOVE_SELECTED_CUSTOMER = "[CUSTOMER] REMOVE SELECTED";
export const TOGGLE_SUMMARY_PANEL = "[CUSTOMERS] TOGGLE SUMMARY PANEL";
export const TOGGLE_FILTER_STATUS = "[CUSTOMERS] TOGGLE FILTER STATUS";
export const TOGGLE_FILTER_PANEL = "[CUSTOMERS] TOGGLE FILTER PANEL";
export const TOGGLE_MAP_VIEW = '[CUSTOMERS] TOGGLE MAP VIEW';

// for Add/Edit
export const OPEN_NEW_CUSTOMER_FORM = '[CUSTOMERS APP] OPEN NEW CUSTOMER FORM';
export const CLOSE_NEW_CUSTOMER_FORM = '[CUSTOMERS APP] CLOSE NEW CUSTOMER FORM';
export const OPEN_EDIT_CUSTOMER_FORM = '[CUSTOMERS APP] OPEN EDIT CUSTOMER FORM';
export const CLOSE_EDIT_CUSTOMER_FORM = '[CUSTOMERS APP] CLOSE EDIT CUSTOMER FORM';
export const ADD_CUSTOMER = '[CUSTOMERS APP] ADD CUSTOMER';
export const UPDATE_CUSTOMER = '[CUSTOMERS APP] UPDATE CUSTOMER';

export const SELECT_LOCATION_FILTER = '[CUSTOMERS APP] SELECT LOCATION FILTER';
export const APPLY_SEARCH_TEXT = '[CUSTOMERS APP] APPLY SEARCH TEXT';

export const GET_CUSTOMERS_FETCH_START = "[CUSTOMERS APP] GET CUSTOMERS FETCH START";

export const GET_ACCOUNT_TYPE_LIST = "[CUSTOMERS APP] GET ACCOUNT TYPE LIST";
export const GET_ACCOUNT_EXCUTIVE_LIST = "[CUSTOMERS APP] GET ACCOUNT EXCUTIVE LIST";
export const GET_CUSTOMER_STATUS_LIST = "[CUSTOMERS APP] GET CUSTOMER STATUS LIST";
export const GET_ACCOUNT_TYPES_GROUPS = "[CUSTOMERS APP] GET ACCOUNT TYPES GROUPS";
export const OPEN_EMAIL_TO_CUSTOMER_DIALOG = "[CUSTOMERS APP] OPEN_EMAIL_TO_CUSTOMER_DIALOG";


export const CREATE_CUSTOMER = "[CUSTOMERS APP] CREATE_CUSTOMER";
export const CREATE_CUSTOMER_START = "[CUSTOMERS APP] CREATE_CUSTOMER_START";

export const GET_CUSTOMER = "[CUSTOMERS APP] GET_CUSTOMER";
export const GET_CUSTOMER_START = "[CUSTOMERS APP] GET_CUSTOMER_START";
export const SET_FILTER_CUSTOMER_STATUSES = "[CUSTOMERS APP] SET_FILTER_CUSTOMER_STATUSES";

export const SET_CUSTOMER_FORM_FINDERS_FEES_DIALOG_PAYLOAD = "[CUSTOMERS APP] SET_CUSTOMER_FORM_FINDERS_FEES_DIALOG_PAYLOAD";
export const GET_FINDERS_FEES_BY_CUSTOMER_NO_START = "[CUSTOMERS APP] GET_FINDERS_FEES_BY_CUSTOMER_NO_START";
export const GET_FINDERS_FEES_BY_CUSTOMER_NO = "[CUSTOMERS APP] GET_FINDERS_FEES_BY_CUSTOMER_NO";

export const FINDERS_FEE_CONFIGS = "[CUSTOMERS APP] FINDERS_FEE_CONFIGS";
export const FINDERS_FEE_CONFIGS_START = "[CUSTOMERS APP] FINDERS_FEE_CONFIGS_START";
export const SET_FINDERS_FEES_CALCULATION_METHOD = "[CUSTOMERS APP] SET_FINDERS_FEES_CALCULATION_METHOD";

export const GET_CUSTOMER_SERVICE_LIST_START = "[CUSTOMERS-service APP] GET_CUSTOMER_SERVICE_LIST_START";
export const GET_CUSTOMER_SERVICE_LIST = "[CUSTOMERS-service APP] GET_CUSTOMER_SERVICE_LIST";
export const GET_CUSTOMER_COLLECTION_LIST_START = "[CUSTOMERS-service APP] GET_CUSTOMER_COLLECTION_LIST_START";
export const GET_CUSTOMER_COLLECTION_LIST = "[CUSTOMERS-service APP] GET_CUSTOMER_COLLECTION_LIST";
export const GET_CUSTOMER_BILLING_LIST_START = "[CUSTOMERS-service APP] GET_CUSTOMER_BILLING_LIST_START";
export const GET_CUSTOMER_BILLING_LIST = "[CUSTOMERS-service APP] GET_CUSTOMER_BILLING_LIST";

export const SHOW_LOG_CALL_MODAL_FORM = "[CUSTOMERS-service APP] SHOW_LOG_CALL_MODAL_FORM";

export function getCustomers(regionId, statusId, StatusNames, AccountTypeListName, location = "all", latitude = "", longitude = "", searchText = "") {
	// return dispatch => {
	// const request = axios.get("/api/customers/gets");

	// return request.then(response => {
	//     return dispatch({
	//         type: GET_ALL_CUSTOMERS,
	//         payload: response.data
	//     });
	// });

	// };
	return (dispatch) => {

		dispatch({
			type: GET_CUSTOMERS_FETCH_START,
			payload: true
		});

		(async () => {
			regionId = regionId === 0 ? [2, 7, 9, 13, 14, 16, 18, 20, 21, 22, 23, 24, 25, 26, 28, 29, 31, 46, 55, 64, 82] : [regionId]
			statusId = statusId === 0 ? Array.from({ length: 10 }).map((item, index) => (index + 1)) : [statusId]
			console.log(regionId, statusId)
			let response = await customersService.getCustomersList(regionId, statusId, StatusNames, AccountTypeListName, location, latitude, longitude, searchText);
			dispatch({
				type: GET_ALL_CUSTOMERS,
				payload: response
			});
		})();
	}
}
export function getFindersFeesByCustomerNo(RegionId, CustomerNo) {
	return (dispatch) => {

		dispatch({
			type: GET_FINDERS_FEES_BY_CUSTOMER_NO_START,
		});

		(async () => {
			let response = await customersService.getFindersFeesByCustomerNo(RegionId, CustomerNo);
			dispatch({
				type: GET_FINDERS_FEES_BY_CUSTOMER_NO,
				payload: response
			});
		})();
	}
}
export function getAccountTypeList() {
	return (dispatch) => {

		(async () => {
			let response = await customersService.getAccountTypeList();
			dispatch({
				type: GET_ACCOUNT_TYPE_LIST,
				payload: response
			});
		})();
	}
}
export function getAccountExecutiveList() {
	return (dispatch) => {

		(async () => {
			let response = await customersService.getAccountExecutiveList();
			dispatch({
				type: GET_ACCOUNT_EXCUTIVE_LIST,
				payload: response
			});
		})();
	}
}
export function getCustomerStatusList() {
	return (dispatch) => {

		(async () => {
			let response = await customersService.getCustomerStatusList();
			dispatch({
				type: GET_CUSTOMER_STATUS_LIST,
				payload: response
			});
		})();
	}
}
export function getAccountTypesGroups() {
	return (dispatch) => {

		(async () => {
			let response = await customersService.getAccountTypesGroups();
			dispatch({
				type: GET_ACCOUNT_TYPES_GROUPS,
				payload: response
			});
		})();
	}
}
export function createCustomer(regionId, param) {
	return (dispatch) => {
		dispatch({
			type: CREATE_CUSTOMER_START,
			payload: true
		});

		(async () => {
			let response = await customersService.createCustomer(regionId, param);
			dispatch({
				type: CREATE_CUSTOMER,
				payload: response
			});
		})();
	}
}
export function getCustomer(regionId, customerId) {
	return (dispatch) => {
		dispatch({
			type: GET_CUSTOMER_START,
			payload: true
		});

		(async () => {
			let response = await customersService.getCustomer(regionId, customerId);
			dispatch({
				type: GET_CUSTOMER,
				payload: response
			});
		})();
	}
}
export function getDocuments() {
	return (dispatch) => {
		(async () => {
			let documentsList = await customersService.getCustomerDocuments();
			console.log(documentsList)
			dispatch({
				type: GET_ALL_DOCUMENTS,
				payload: documentsList
			});
		})();
	}
}

export function toggleFilterPanel() {
	return {
		type: TOGGLE_FILTER_PANEL
	}
}

export function toggleSummaryPanel() {
	return {
		type: TOGGLE_SUMMARY_PANEL
	}
}

export function toggleMapView() {
	return {
		type: TOGGLE_MAP_VIEW
	}
}
export function toggleStatus(key, status) {
	return {
		type: TOGGLE_FILTER_STATUS,
		payload: { [key]: status }
	}
}

export function selectLocationFilter(filter_value) {
	return {
		type: SELECT_LOCATION_FILTER,
		payload: filter_value
	}
}

export function applySearchText(s) {
	return {
		type: APPLY_SEARCH_TEXT,
		payload: s
	}
}

export function deleteCustomers(keys, customers) {
	return dispatch => {
		const request = axios.post("/api/customers/delete", { ids: keys, customers: customers });

		return request.then(response => {
			return dispatch({
				type: DELETE_SELECTED_CUSTOMERS,
				payload: response.data
			});
		});
	};
}

export function removeCustomer(key, customers) {
	return dispatch => {
		const request = axios.post("/api/customers/remove", { id: key, customers: customers });

		return request.then(response => {
			return dispatch({
				type: REMOVE_SELECTED_CUSTOMER,
				payload: response.data
			});
		});
	};
}

export function openNewCustomerForm() {
	return {
		type: OPEN_NEW_CUSTOMER_FORM
	}
}

export function closeNewCustomerForm() {
	return {
		type: CLOSE_NEW_CUSTOMER_FORM
	}
}

export function showLogCallModalForm(visible) {
	return {
		type: SHOW_LOG_CALL_MODAL_FORM,
		payload: visible
	}
}

export function openEditCustomerForm(regionId, customerId, customerNo) {
	return (dispatch) => {
		dispatch({
			type: GET_CUSTOMER_START,
			payload: true
		});

		(async () => {
			let customer = await customersService.getCustomer(regionId, customerId);
			let findersFees = await customersService.getFindersFeesByCustomerNo(regionId, customerNo);
			let findersFeesConfig = await customersService.findersfeeConfigs();
			dispatch({
				type: OPEN_EDIT_CUSTOMER_FORM,
				payload: { customer, findersFees, findersFeesConfig }
			});
		})();
	}
}
export function findersfeeConfigs() {
	return (dispatch) => {
		dispatch({
			type: FINDERS_FEE_CONFIGS_START,
			payload: true
		});

		(async () => {
			let res = await customersService.findersfeeConfigs();
			dispatch({
				type: FINDERS_FEE_CONFIGS,
				payload: res
			});
		})();
	}
}
//////////////////////////////////////////////////////////
//														//
//			CUSTOMER-SERVICE Forms Tab Grid				//
//														//
//////////////////////////////////////////////////////////
export function getCustomerServiceList(regionId, CustomerNo, fromDate, toDate) {
	return (dispatch) => {
		dispatch({
			type: GET_CUSTOMER_SERVICE_LIST_START,
			payload: true
		});

		(async () => {
			let res = await customersService.getCustomerServiceList(regionId, CustomerNo, fromDate, toDate);
			dispatch({
				type: GET_CUSTOMER_SERVICE_LIST,
				payload: res
			});
		})();
	}
}
export function getCustomerCollectionList(regionId, CustomerNo, fromDate, toDate) {
	return (dispatch) => {
		dispatch({
			type: GET_CUSTOMER_COLLECTION_LIST_START,
			payload: true
		});

		(async () => {
			let res = await customersService.getCustomerCollectionList(regionId, CustomerNo, fromDate, toDate);
			dispatch({
				type: GET_CUSTOMER_COLLECTION_LIST,
				payload: res
			});
		})();
	}
}
export function getCustomerBillingList(regionId, CustomerNo) {
	return (dispatch) => {
		dispatch({
			type: GET_CUSTOMER_BILLING_LIST_START,
			payload: true
		});

		(async () => {
			let res = await customersService.getCustomerBillingList(regionId, CustomerNo);
			dispatch({
				type: GET_CUSTOMER_BILLING_LIST,
				payload: res
			});
		})();
	}
}




export function setFindersFeesCalculationMethod(s) {
	return {
		type: SET_FINDERS_FEES_CALCULATION_METHOD,
		payload: s
	}
}

export function closeEditCustomerForm() {
	return {
		type: CLOSE_EDIT_CUSTOMER_FORM
	}
}

export function openEmailToCustomerDialog(open) {
	return {
		type: OPEN_EMAIL_TO_CUSTOMER_DIALOG,
		payload: open
	}
}

export function setFilterCustomerStatuses(statuses) {
	return {
		type: SET_FILTER_CUSTOMER_STATUSES,
		payload: statuses
	}
}

export function setCustomerFormFindersFeesDialogPayload(payload) {
	return {
		type: SET_CUSTOMER_FORM_FINDERS_FEES_DIALOG_PAYLOAD,
		payload: payload
	}
}

export function addCustomer(newCustomer) {
	return (dispatch, getState) => {

		console.log('state', getState());

		// const {routeParams} = getState().contactsApp.contacts;

		const request = axios.post('/api/contacts-app/add-contact', {
			newCustomer
		});

		return request.then((response) =>
			Promise.all([
				dispatch({
					type: ADD_CUSTOMER
				})
			]).then(() => dispatch(getCustomers()))
		);
	};
}

export function updateCustomer(customer) {
	return (dispatch, getState) => {

		// const {routeParams} = getState().contactsApp.contacts;

		const request = axios.post('/api/contacts-app/update-contact', {
			customer
		});

		return request.then((response) =>
			Promise.all([
				dispatch({
					type: UPDATE_CUSTOMER
				})
			]).then(() => dispatch(getCustomers()))
		);
	};
}
