import {paymentlockboxservice} from "../../services";
import moment from 'moment';
export const PAYMENT_LOCKBOX_GET_ALL_DATA_START         = "[PAYMENT LOCKBOX] GET ALL DATA START";
export const PAYMENT_LOCKBOX_GET_ALL_DATA_SUCCESS       = "[PAYMENT LOCKBOX] GET ALL DATA SUCCESS";
export const PAYMENT_LOCKBOX_GET_ALL_DATA_FAILD         = "[PAYMENT LOCKBOX] GET ALL DATA FAILD";

export const PAYMENT_LOCKBOX_FILE_UPLOAD_START         = "[PAYMENT LOCKBOX] FILE UPLOAD START";
export const PAYMENT_LOCKBOX_FILE_UPLOAD_SUCCESS       = "[PAYMENT LOCKBOX] FILE UPLOAD SUCCESS";
export const PAYMENT_LOCKBOX_FILE_UPLOAD_FAILD         = "[PAYMENT LOCKBOX] FILE UPLOAD FAILD";

export const PAYMENT_LOCKBOX_GET_ALL_START         = "[PAYMENT LOCKBOX] GET ALL START";
export const PAYMENT_LOCKBOX_GET_ALL_SUCCESS       = "[PAYMENT LOCKBOX] GET ALL SUCCESS";
export const PAYMENT_LOCKBOX_GET_ALL_FAILD         = "[PAYMENT LOCKBOX] GET ALL FAILD";

export const PAYMENT_LOCKBOX_SHOW_MODAL_FORM       = "[PAYMENT LOCKBOX] SHOW MODAL FORM";

export function paymentlockboxgetalldata() {
    return (dispatch,getState) => {
        let regionId = getState().auth.login.defaultRegionId;
        let data={
            'regionid':regionId,
            'lockboxdate':moment().format('MM/DD/YYYY'),
            'filename':'BUF07.TXT',
            'preview':true
        };
        dispatch({
            type: PAYMENT_LOCKBOX_GET_ALL_DATA_START,
            payload: true
        });

        (async () => {
            let res = await paymentlockboxservice.getallpaymentlockbox(data);
            if (res.IsSuccess) {
                dispatch({
                    type: PAYMENT_LOCKBOX_GET_ALL_DATA_SUCCESS,
                    payload: res.Data
                });
            } else {
                dispatch({
                    type: PAYMENT_LOCKBOX_GET_ALL_DATA_FAILD,
                    payload: res.Message
                });
            }
        })();
    };
}
export function showPaymentLockBoxModalForm(visible) {
	return {
		type: PAYMENT_LOCKBOX_SHOW_MODAL_FORM,
		payload: visible
	}
}
export function paymentlockboxfileupload(file) {
    return (dispatch,getState) => {
        dispatch({
            type: PAYMENT_LOCKBOX_FILE_UPLOAD_START,
            payload: true
        });
        (async () => {
            let regionid=getState().auth.login.defaultRegionId;
            let res = await paymentlockboxservice.fileupload(file,regionid);
            if(res.uploadingnow && res.progress>0){
                console.log("res.progress",res.progress);
            }
            if (res.IsSuccess) {
                dispatch({
                    type: PAYMENT_LOCKBOX_FILE_UPLOAD_SUCCESS,
                    payload: res
                });
            } else {
                dispatch({
                    type: PAYMENT_LOCKBOX_FILE_UPLOAD_FAILD,
                    payload: res.message
                });
            }
        })();
    };
}
