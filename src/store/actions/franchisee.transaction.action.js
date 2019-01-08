import axios from "axios";

export const GET_ALL_FRANCHISEE_TRANSACTIONS = "[FRANCHISEE-TRANSACTIONS] GETS ALL";
export const REMOVE_SELECTED_FRANCHISEE_TRANSACTION = "[FRANCHISEE-TRANSACTION] REMOVE SELECTED";
export const TOGGLE_TRANSACTION_FILTER_PANEL = "[FRANCHISEE-TRANSACTION] TOGGLE TRANSACTION FILTER PANEL";
export const TOGGLE_TRANSACTION_FILTER_STATUS = "[FRANCHISEE-TRANSACTION] TOGGLE TRANSACTION FILTER STATUS";

export function getTransactions() {
    return dispatch => {
        const request = axios.get("/api/transactions/gets");

        return request.then(response => {
            return dispatch({
                type: GET_ALL_FRANCHISEE_TRANSACTIONS,
                payload: response.data
            });
        });
    };
}

export function removeTransaction(key, transactions) {
    return dispatch => {
        const request = axios.post("/api/transactions/remove", { key: key, transactions: transactions });

        return request.then(response => {
            return dispatch({
                type: REMOVE_SELECTED_FRANCHISEE_TRANSACTION,
                payload: response.data
            });
        });
    };
}

export function toggleTransactionFilterPanel(){
    return {
        type: TOGGLE_TRANSACTION_FILTER_PANEL
    }
}

export function toggleTransactionStatus(key, status){
    return {
        type: TOGGLE_TRANSACTION_FILTER_STATUS,
        payload: {[key]: status}
    }
}
