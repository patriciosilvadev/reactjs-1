import * as Actions from "../actions";
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import * as UserActions from "../../auth/store/actions";

const initialState = {
    dashboardDB: null,
    data:null,
};

const dashboard = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_WIDGETS:
            // return {
            //     ...state,
            //     data: {...action.payload}
            // };
            return {...state, data: action.payload}
        case UserActions.USER_LOGGED_OUT:
        {
            return {
                ...initialState
            }
        }
        default:
            return state;
    }
};
const persistConfig = {
    key: 'dashboard',
    storage: storage,
    blacklist: ['dashboardDB']
};
// export default dashboard;
export default persistReducer(persistConfig, dashboard);