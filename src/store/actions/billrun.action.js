import axios from "axios";


import {billrunService, invoiceService} from "../../services";
export const GET_ALL_BILLRUNS           = "[BILL-RUNS] GETS ALL";
export const REMOVE_SELECTED_BILLRUN    = "[BILL-RUN] REMOVE SELECTED";
export const TOGGLE_SUMMARY_PANEL       = "[INVOICES] TOGGLE SUMMARY PANEL";
export const TOGGLE_FILTER_STATUS       = "[INVOICES] TOGGLE FILTER STATUS";
export const TOGGLE_FILTER_PANEL        = "[INVOICES] TOGGLE FILTER PANEL";


export const CREATE_BILLRUN_SUCCESS     = "[BILL-RUNS] CREATE NEW BILL RUN SUCCESS";
export const CREATE_BILLRUN_START       = "[BILL-RUNS] CREATE NEW BILL RUN START";
export const CREATE_BILLRUN_FAILD       = "[BILL-RUNS] CREATE NEW BILL RUN FAILD";

export const GET_ALL_BILLRUN_SUCCESS    = "[BILL-RUNS] GET ALL BILL RUN SUCCESS";
export const GET_ALL_BILLRUN_START      = "[BILL-RUNS] GET ALL BILL RUN START";
export const GET_ALL_BILLRUN_FAILD      = "[BILL-RUNS] GET ALL BILL RUN FAILD";


export const DELETE_BILLRUN_SUCCESS    = "[BILL-RUNS] DELETE BILL RUN SUCCESS";
export const DELETE_BILLRUN_START      = "[BILL-RUNS] DELETE BILL RUN START";
export const DELETE_BILLRUN_FAILD      = "[BILL-RUNS] DELETE BILL RUN FAILD";


export const GET_BILLRUN_INVOICE_DETAIL_BILLRUN_SUCCESS    = "[BILL-RUNS] GET BILLRUN INVOICE DETAIL SUCCESS";
export const GET_BILLRUN_INVOICE_DETAIL_BILLRUN_START      = "[BILL-RUNS] GET BILLRUN INVOICE DETAIL START";
export const GET_BILLRUN_INVOICE_DETAIL_BILLRUN_FAILD      = "[BILL-RUNS] GET BILLRUN INVOICE DETAIL FAILD";

export const CHANGE_BILLRUN_STATUS       = "[BILL-RUNS] CHANGE BILL RUN STATUS";


export function getBillruns() {
    return dispatch => {
        const request = axios.get("/api/billruns/gets");

        return request.then(response => {
            return dispatch({
                type: GET_ALL_BILLRUNS,
                payload: response.data
            });
        });
    };
}
export function  changebillrunstatus() {
    return (dispatch) => {
        dispatch({
            type: CHANGE_BILLRUN_STATUS,
        });
    }

}
export function getAllBillruns(RegionIds, UserIds ,isBillPeriod,BillMonth,BillYear,FromDate,ToDate,SearchText) {
    return (dispatch) => {

        dispatch({
            type: GET_ALL_BILLRUN_START,
            payload: true
        });

        (async () => {
            let res = await billrunService.getAllBillrun(RegionIds, UserIds ,isBillPeriod,BillMonth,BillYear,FromDate,ToDate,SearchText);
            if (res.IsSuccess) {
                dispatch({
                    type: GET_ALL_BILLRUN_SUCCESS,
                    payload: res.Data
                });
            } else {
                dispatch({
                    type: GET_ALL_BILLRUN_FAILD,
                    payload: res
                });
            }
        })();
    };
}
export function deleteSeletedBillRun(RegionIds, billrunNo) {
    return (dispatch) => {

        dispatch({
            type: DELETE_BILLRUN_START,
            payload: true
        });

        (async () => {
            let res = await billrunService.deleteBillrun(RegionIds, billrunNo);
            if (res.IsSuccess) {
                dispatch({
                    type: DELETE_BILLRUN_SUCCESS,
                    payload: {...res.Data,billrunno: billrunNo},

                });
            } else {
                dispatch({
                    type: DELETE_BILLRUN_FAILD,
                    payload: res
                });
            }
        })();
    };
}

export function toggleFilterPanel(){
    return {
        type: TOGGLE_FILTER_PANEL
    }
}

export function toggleSummaryPanel(){
    return {
        type: TOGGLE_SUMMARY_PANEL
    }
}

export function toggleStatus(key, status){
    return {
        type: TOGGLE_FILTER_STATUS,
        payload: {[key]: status}
    }
}

export function removeBillrun(key, invoices) {
    return dispatch => {
        const request = axios.post("/api/billruns/remove", { id: key, invoices: invoices });

        return request.then(response => {
            return dispatch({
                type: REMOVE_SELECTED_BILLRUN,
                payload: response.data
            });
        });
    };
}


export  function createBillrun(RegionId, Year ,Month,User, UserId,Message,Description) {
    return (dispatch) => {

        dispatch({
            type: CREATE_BILLRUN_START,
            payload: true
        });

        (async () => {
            let res = await billrunService.createBillrun(RegionId, Year ,Month,User, UserId,Message,Description);
            if (res.IsSuccess) {
                dispatch({
                    type: CREATE_BILLRUN_SUCCESS,
                    payload: res
                });
            } else {
                dispatch({
                    type: CREATE_BILLRUN_FAILD,
                    payload: res
                });
            }
        })();
    };
}

/**
 * POST v1/accountsreceivable/GetBillRunByNumber
 * @param BillRunNo
 * @param RegionId
 * @returns {Function}
 */
export  function getinvoicedetailfrombillrun(RegionId,BillRunNo) {
    return (dispatch) => {

        dispatch({
            type: GET_BILLRUN_INVOICE_DETAIL_BILLRUN_START,
            payload: true
        });

        (async () => {
            let res = await billrunService.getInvoiceFromBillrun(RegionId,BillRunNo);
            if (res.IsSuccess) {
                dispatch({
                    type: GET_BILLRUN_INVOICE_DETAIL_BILLRUN_SUCCESS,
                    payload: res.Data
                });
            } else {
                dispatch({
                    type: GET_BILLRUN_INVOICE_DETAIL_BILLRUN_FAILD,
                    payload: res
                });
            }
        })();
    };
}
