import * as Actions from "../actions/";
import * as UserActions from "../../auth/store/actions/";
import {GET_FRANCHISEE_REPORTS_FETCH_START} from "../actions/";

const initialState = {
    franchiseeReports: null,
    franchiseeReport: null,
    franchiseeReport1: null,
    bLoadedFranchiseeReports: false,
    bFetchingFranchiseeReport: false,
    bOpenedFilterPanelFranchiseeReports: false,
    FranchiseesReportForm: {
        type : 'new',
        props: {
            open: false
        },
        data : null
    },
    reportDate: '01/2019'
};


const franchiseeReports = function(state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_FRANCHISEE_REPORTS:
        {
            return {
                ...state,
                franchiseeReports: action.payload,
                bLoadedFranchiseeReports: true,
            };
        }
        case Actions.GET_FRANCHISEE_REPORT_DETAIL:
        {
            return {
                ...state,
                franchiseeReport: action.payload,
            }
        }
        case Actions.GET_FRANCHISEE_REPORTS_FETCH_START:
        {
            return {
                ...state,
                bFetchingFranchiseeReport: true
            }
        }
        case Actions.CREATE_FRANCHISEE_REPORT_DETAIL:
        {
            return {
                ...state,
                franchiseeReport1: action.payload,
                bFetchingFranchiseeReport: false
            }
        }
        case Actions.CREATE_FRANCHISEE_REPORT_DETAIL_ERROR:
        {
            return {
                ...state,
                franchiseeReport1: null,
                bFetchingFranchiseeReport: true
            }
        }
        case Actions.TOGGLE_FRANCHISEES_REPORTS_FILTER_PANEL:
        {
            return {
                ...state, bOpenedFilterPanelFranchiseeReports: !state.bOpenedFilterPanelFranchiseeReports
            }
        }
        case Actions.OPEN_EDIT_FRANCHISEES_FORM:
        {
            return {
                ...state,
                createFranchisees: {
                    type : 'edit',
                    props: {
                        open: true
                    },
                    data : action.data
                }
            };
        }
        case Actions.CLOSE_EDIT_FRANCHISEES_FORM:
        {
            return {
                ...state,
                createFranchisees: {
                    type : 'edit',
                    props: {
                        open: false
                    },
                    data : null
                }
            };
        }
        case Actions.UPDATE_REPORT_DATE:
        {
            return {
                ...state, reportDate: action.payload
            }
        }
        case Actions.CLOSE_EDIT_TRANSACTION_FORM:
        case Actions.CLOSE_NEW_TRANSACTION_FORM:
            return {...state, franchiseeReport1: null};
        case Actions.NULLIFY_FRANCHISEE_REPORT:
        case Actions.NULLIFY_FRANCHISEE_NEW_REPORT:
            return {...state, franchiseeReport1: null};
        case UserActions.USER_LOGGED_OUT:
        {
            return {
                ...initialState
            }
        }
        default:
        {
            return state;
        }
    }
};

export default franchiseeReports;
