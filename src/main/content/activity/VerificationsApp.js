import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';

//Material UI core
import {
    Icon, Typography, Button, CircularProgress
} from '@material-ui/core';
import {withStyles} from "@material-ui/core";

//Theme
import {FusePageCustomSidebarScroll} from '@fuse';

// for store
import connect from "react-redux/es/connect/connect";
import * as Actions from 'store/actions';
import {bindActionCreators} from "redux";

//third party
import "react-table/react-table.css";
import classNames from 'classnames';


//Child Components
import TransactionListContent from './TransactionListContent';
import InvoiceListContent from './InvoiceListContent';
import CustomerListContent from './CustomerListContent';
import VerifiedDialogForm from "./VerifiedDialogForm";
import ReviseDialogForm from "./ReviseDialogForms";
import RejectDialogForm from "./RejectDialogForm";
import SummaryPanel from './SummaryPanel';
import FilterPanel from './FilterPanel';

const headerHeight = 80;

const hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const styles = theme => ({
    root: {
        background: "url('/assets/images/backgrounds/signin-bg.jpg') no-repeat",
        backgroundSize: 'cover',
    },
    layoutRoot: {
        flexDirection: 'row',
        '& .z-9999': {
            height: 64
        },
        '& .-pageSizeOptions': {
            display: 'none'
        },
        '& .openFilter': {
            width: 'inherit'
        },
        '& .openSummary': {
            width: 300
        },
        '& .p-12-impor': {
            paddingLeft: '1.2rem!important',
            paddingRight: '1.2rem!important',
        },
        '& .wordwrap': {
            whiteSpace: 'pre-line !important',
            wordWrap: 'break-word',
        }
    },
    card: {
        width: '100%',
        maxWidth: 384,
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
    layoutHeader: {
        height: headerHeight,
        minHeight: headerHeight,
        backgroundColor: theme.palette.secondary.main
    },
    layoutRightSidebar: {
        width: 0,
        [theme.breakpoints.down('sm')]: {
            width: 'inherit'
        }
    },
    layoutLeftSidebar: {
        width: 0,
        [theme.breakpoints.down('sm')]: {
            width: 'inherit'
        }
    },
    layoutSidebarHeader: {
        height: headerHeight,
        minHeight: headerHeight,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.main,
    },
    content: {
        position: 'relative'
    },
    addButton: {
        position: 'absolute',
        bottom: -28,
        left: 16,
        zIndex: 999,
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    sideButton: {
        backgroundColor: theme.palette.primary.light,
        height: 46,
        width: 46,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    removeButton: {
        position: 'absolute',
        bottom: -28,
        right: 16,
        zIndex: 999,
        backgroundColor: theme.palette.secondary.light,
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
        }
    },
    imageIcon: {
        width: 24,
        height: 24
    },
    separator: {
        width: 1,
        height: '100%',
        backgroundColor: theme.palette.divider
    },
    search: {
        width: 360,
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    tableTheadRow: {
        backgroundColor: theme.palette.primary.main
    },
    tableThEven: {
        backgroundColor: 'rgba(' + hexToRgb(theme.palette.secondary.main).r + ',' + hexToRgb(theme.palette.secondary.main).g + ',' + hexToRgb(theme.palette.secondary.main).b + ', .3)'
    },
    tableTdEven: {
        backgroundColor: 'rgba(' + hexToRgb(theme.palette.secondary.main).r + ',' + hexToRgb(theme.palette.secondary.main).g + ',' + hexToRgb(theme.palette.secondary.main).b + ', .1)'
    },
    filterPanelButton: {
        backgroundColor: theme.palette.secondary.main,
        minWidth: 42,
        padding: 8,
        justifyContent: 'center',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    summaryPanelButton: {
        backgroundColor: theme.palette.secondary.main,
        minWidth: 42,
        padding: 8,
        color: 'white',
        justifyContent: 'center',
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0, .9)',
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        opacity: 0.5
    },
    validationMenu: {
        color: "#07DF07",
    },
    invalidationMenu: {
        color: "#FF557F",
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    btntop: {
        marginRight: 20
    },
    iconSmall: {
        fontSize: 20,
    }
});

class VerificationsApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            s: '',
            temp: [],
            data: [],
            selection: [],
            selectAll: false,
            current_lat: 0,
            current_long: 0,
            regionId: this.props.regionId,
            statusId: this.props.statusId,
            longitude: this.props.longitude,
            latitude: this.props.latitude,
            location: this.props.location,
            searchText: this.props.searchText,
            isSubmittingForApproval: false,
            aTransactionSelections: [],
            openDialog: false,
            verifyOption: this.props.verifyOption
        };
        if(props.transactionTypeList===null)
            props.getFranchiseeTransactionTypeLists(props.regionId);

        if (!props.bLoadedVerifications) {
            this.props.getInvoiceTransactionPendingLists(props.regionId, props.fromDate, props.toDate);
        }
    }

    closeComposeForm = () => {
        switch (this.props.verificationForm.type) {
            case "new":
                this.props.closeNewVerificationForm();
                break;
            default:
                break
        }
    };

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.regionId !== prevProps.regionId ||
            this.props.fromDate !== prevProps.fromDate ||
            this.props.toDate !== prevProps.toDate ||
            this.props.statusId !== prevProps.statusId) {
            this.setState({
                regionId: this.props.regionId,
                statusId: this.props.statusId
            });
            this.props.getInvoiceTransactionPendingLists(this.props.regionId, this.props.fromDate, this.props.toDate);
        }
        if (this.props.aTransactionSelections !== prevProps.aTransactionSelections) {
            this.setState({"aTransactionSelections": this.props.aTransactionSelections});
        }
        if (this.props.verifyOption !== prevProps.verifyOption) {
            this.setState({verifyOption: this.props.verifyOption});
        }
    }

    componentWillMount() {
        if (this.props.verifications === null) {
            this.props.getInvoiceTransactionPendingLists(this.props.regionId, this.props.fromDate, this.props.toDate);
        }
        this.setState({"aTransactionSelections": this.props.aTransactionSelections});
        this.setState({openDialog: this.props.verifiedModal});

        let activity = this.props.nav.filter(item=>item.TabName==="Activity");
        if(activity.length)
            this.setState({HeaderIcon: activity[0].Icon});
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.aTransactionSelections !== this.props.aTransactionSelections) {
            if(JSON.stringify(this.state.selection) !== JSON.stringify(nextProps.aTransactionSelections))
                this.setState({ selection: [...nextProps.aTransactionSelections] });
        }
    }


    componentDidMount() {
        this.setState({verifyOption: this.props.verifyOption});
    }

    componentWillUnmount() {
    }

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    openVerificationDialog = () => {
        this.props.openVerificationDialog(true);
    };

    openReviseDialog = () => {
        this.props.openCloseReviseModal(true);
    };

    render() {
        const {classes, filterState, summaryState} = this.props;
        const {aTransactionSelections, HeaderIcon} = this.state;

        return (
            <React.Fragment>
                <FusePageCustomSidebarScroll
                    classes={{
                        root: classNames(classes.layoutRoot),
                        rightSidebar: classNames(classes.layoutRightSidebar, {'openSummary': summaryState}),
                        leftSidebar: classNames(classes.layoutLeftSidebar, {'openFilter': filterState}),
                        sidebarHeader: classes.layoutSidebarHeader,
                        header: classes.layoutHeader,
                        content: classes.content
                    }}
                    header={
                        <div className="flex w-full items-center">
                            <div className="flex row flex-1  p-8 sm:p-12 relative justify-between">
                                <div className="flex flex-row flex-1 justify-between">
                                    <div className="flex flex-shrink items-center">
                                        <div className="flex items-center">
                                            <Icon className="text-32 mr-12">{HeaderIcon}</Icon>
                                            <Typography variant="h6" className="hidden sm:flex">Activity |
                                                Verifications</Typography>
                                        </div>
                                    </div>
                                    <div className="flex flex-shrink items-center">
                                        <Button variant="contained" color="primary"
                                                disabled={(this.props.verifyOption==='transaction' && aTransactionSelections.length === 0) ||
                                                (this.props.verifyOption==='invoice' && this.props.aInvoiceSelections.length === 0) ||
                                                (this.props.verifyOption==='customer' && this.props.aCustomerSelections.length === 0)
                                                }
                                                className={classNames(classes.button, classes.btntop) } onClick={this.openVerificationDialog}>
                                            Verify
                                            <Icon className={classes.rightIcon}>verified_user</Icon>
                                        </Button>
                                        <Button variant="contained" color="primary"
                                                disabled={(this.props.verifyOption==='transaction' && aTransactionSelections.length === 0) ||
                                                (this.props.verifyOption==='invoice' && this.props.aInvoiceSelections.length === 0) ||
                                                (this.props.verifyOption==='customer' && this.props.aCustomerSelections.length === 0)}
                                                className={classNames(classes.button, classes.btntop)} onClick={this.openReviseDialog}>
                                            Request Changes
                                            <Icon className={classes.rightIcon}>rotate_90_degrees_ccw</Icon>
                                        </Button>
                                        <Button variant="contained" color="primary"
                                                className={classNames(classes.button, classes.btntop)} onClick={()=>this.props.getInvoiceTransactionPendingLists(this.props.regionId, this.props.fromDate, this.props.toDate)}>
                                            Refresh
                                            <Icon className={classes.rightIcon}>refresh</Icon>
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    }
                    content={
                        <div className="flex-1 flex-col absolute w-full h-full">
                            {this.state.temp && (
                                <Fragment>
                                    {this.state.verifyOption==='transaction' && (<TransactionListContent/>)}
                                    {this.state.verifyOption==='invoice' && (<InvoiceListContent/>)}
                                    {this.state.verifyOption==='customer' && (<CustomerListContent/>)}
                                </Fragment>
                            )}
                            <Fragment>
                                <VerifiedDialogForm />
                            </Fragment>
                            <Fragment>
                                <ReviseDialogForm />
                            </Fragment>
                            <Fragment>
                                <RejectDialogForm />
                            </Fragment>

                        </div>
                    }
                    leftSidebarHeader={
                        <Fragment>
                            <div
                                className={classNames("flex flex-row w-full h-full justify-between p-6 align-middle pl-24")}>
                                <h2 style={{marginBlockStart: '1em'}}>Filters</h2>
                            </div>
                        </Fragment>
                    }
                    leftSidebarContent={
                        <FilterPanel/>
                    }
                    rightSidebarHeader={
                        <div
                            className={classNames("flex flex-row w-full h-full justify-between p-6 align-middle pl-24")}>
                            <h2 style={{marginBlockStart: '1em'}}>Summary</h2>
                        </div>
                    }
                    rightSidebarContent={
                        <SummaryPanel/>
                    }

                    onRef={instance => {
                        this.pageLayout = instance;
                    }}
                >
                </FusePageCustomSidebarScroll>
                {this.props.bVerificationFetchStart && (
                    <div className={classes.overlay}>
                        <CircularProgress className={classes.progress} color="secondary"  />
                    </div>
                )}
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        toggleFilterPanel: Actions.toggleVerificationFilterPanel,
        toggleSummaryPanel: Actions.toggleVerificationSummaryPanel,
        openNewVerificationForm: Actions.openNewVerificationForm,
        closeNewVerificationForm: Actions.closeNewVerificationForm,
        openCloseReviseModal: Actions.openCloseReviseDialog,
        openVerificationDialog : Actions.openVerificationDialog ,
        openCloseRejectModal: Actions.openCloseRejectDialog,
        getFranchiseeTransactionTypeLists : Actions.getFranchiseeTransactionTypeLists,
        // getInvoiceTransactionPendingLists: Actions.getInvoiceTransactionPendingLists,
        getInvoiceTransactionPendingLists : Actions.getInvoiceTransactionPendingLists1,
    }, dispatch);
}

function mapStateToProps({verifications, auth, fuse, transactions}) {
    return {
        verifications: verifications.verificationsDB,
        bLoadedVerifications: verifications.bLoadedVerifications,
        bVerificationFetchStart: verifications.bVerificationFetchStart,
        aTransactionSelections: verifications.aTransactionSelections,
        aInvoiceSelections: verifications.aInvoiceSelections,
        aCustomerSelections: verifications.aCustomerSelections,
        regionId: auth.login.defaultRegionId,
        nav: fuse.navigation,
        transactionTypeList: transactions.transactionTypeList,
        transactionStatus: verifications.transactionStatus,
        summaryState: verifications.bOpenedSummaryPanel,
        filterState: verifications.bOpenedFilterPanel,
        verificationForm: verifications.verificationForm,
        statusId: verifications.statusId,
        searchText: verifications.searchText,
        verifiedModal: verifications.verifiedModal,
        reviseModal: verifications.reviseModal,
        rejectModal: verifications.rejectModal,
        fromDate: verifications.fromDate,
        toDate: verifications.toDate,
        verifyOption: verifications.verifyOption,
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(VerificationsApp)));

