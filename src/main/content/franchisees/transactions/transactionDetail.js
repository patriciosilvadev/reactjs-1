import React, {Component} from 'react';

// Material-UI core components
import {
    Icon, Fab, Typography, Hidden, IconButton, Button, Paper, Input, CircularProgress, Toolbar} from '@material-ui/core';
import {withStyles} from "@material-ui/core";
import {withRouter} from 'react-router-dom';

//Custom Components
import FilterPanel from './filterPanel';

// theme components
import {FusePageCustom, FuseAnimate} from '@fuse';

// for store
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";
import * as Actions from '../../../../store/actions';

// third party
import classNames from 'classnames';

import TransactionDxGridLists from './transactionDxGridLists';
import TransactionForm from './transactionForm'
import _ from "lodash";

const headerHeight = 80;

const hexToRgb = (hex) =>{
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const styles = theme => ({
    layoutRoot: {
        flexDirection: 'row',
        '& .z-9999': {
            height: 64
        },
        '& .openFilter':{
            width: 'inherit'
        },
    },
    layoutHeader       : {
        height   : headerHeight,
        minHeight: headerHeight,
        backgroundColor: theme.palette.secondary.main
    },
    layoutLeftSidebar : {
        width: 0,
        [theme.breakpoints.down('sm')]: {
            width: 'inherit'
        }
    },
    layoutSidebarHeader: {
        height   : headerHeight,
        minHeight: headerHeight,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.main,
    },
    content:{
        position: 'relative'
    },
    search: {
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
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
    sideButton          : {
        backgroundColor: theme.palette.primary.light,
        height: 46,
        width: 46,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    tableTheadRow:{
        // backgroundColor: 'rgba(' + hexToRgb(theme.palette.primary.main).r + ',' + hexToRgb(theme.palette.primary.main).g + ',' + hexToRgb(theme.palette.primary.main).b +', .2)'
        backgroundColor: theme.palette.primary.main,
        padding: 12
    },
    imageIcon: {
        width: 24
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
    progress: {
        margin: theme.spacing.unit * 2,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    btntop: {
        marginRight: 20,
        '& span': {
            textTransform: 'none'
        }
    },
});

class TransactionDetail extends Component {
    state = {
        s: '',
        data: [],
        selection: [],
        regionId: 0,
        checkedCompleted: true,
        checkedOpen: true,
        selectedTransaction: null,
        franchisees: null,
    };

    constructor(props){
        super(props);

        if(!props.bLoadedTransactions) {
            props.getTransactions(props.regionId);
        }

        if (!props.bLoadedFranchisees) {
            props.getFranchisees(props.regionId, props.fstatusId, props.fLocation, props.fLongitude, props.fLatitude, props.fSearchText);
        }
    }

    search = (val)=> {
        const temp = this.state.data.filter( d => {
            console.log('value=', d);
            return d.Name.indexOf(val) !== -1 || !val ||
                d.FranchiseeNo.indexOf(val) !== -1 ||
                // d.TrxType.toString().indexOf(val) !== -1
                d.Number.indexOf(val) !== -1 ||
                d.ExtendedPrice.toString().indexOf(val) !== -1 ||
                d.Tax.toString().indexOf(val) !== -1 ||
                d.Fees.toString().indexOf(val) !== -1 ||
                d.TotalTrxAmount.toString().indexOf(val) !== -1
        });

        this.setState({temp: temp});
    };


    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });
    };
    componentWillMount(){
        const {regionId, fstatusId, fLocation, fLongitude, fLatitude, fSearchText} = this.props;

        this.setState({checkedCompleted: this.props.transactionStatus.checkedCompleted});
        this.setState({checkedOpen: this.props.transactionStatus.checkedOpen});
        this.getTransactions();
        this.props.getFranchisees(regionId, fstatusId, fLocation, fLongitude, fLatitude, fSearchText);
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        let bChanged = false;
        const {fstatusId, fLocation, fLongitude, fLatitude, fSearchText} = this.props;

        if(this.props.regionId !== prevProps.regionId) {
            this.setState({regionId: prevProps.regionId});
            bChanged = true;
        }

        if(this.props.transactionStatus.checkedCompleted !== prevProps.transactionStatus.checkedCompleted) {
            this.setState({checkedCompleted: !this.state.checkedCompleted});
            bChanged = true;
        }

        if(this.props.transactionStatus.checkedOpen !== prevProps.transactionStatus.checkedOpen) {
            this.setState({checkedOpen: !this.state.checkedOpen});
            bChanged = true;
        }

        if(this.props.regionId !== prevProps.regionId){
            this.props.getFranchisees(this.props.regionId, fstatusId, fLocation, fLongitude, fLatitude, fSearchText);
        }

        if(this.props.bTransactionsUpdated && this.props.bTransactionsUpdated!==prevProps.bTransactionsUpdated)
            this.props.getTransactions(this.props.regionId);

        if(bChanged)
            this.getTransactions();

        if(prevProps.transactions!== this.props.transactions){
            this.getTransactions();
        }

        if(prevState.s!==this.state.s) {
            this.search(this.state.s);
        }

        if(this.props.removedTrxKey!==undefined && this.props.removedTrxKey!==prevProps.removedTrxKey)
            this.props.getTransactions(this.props.regionId);

    }

    componentWillReceiveProps(nextProps) {
        if(this.props.transactions!==nextProps.transactions)
            this.getTransactions(nextProps.transactions);

        if(nextProps.franchisees!==null && this.props.franchisees!==nextProps.franchisees){
            this.setState({franchisees: nextProps.franchisees.Data.Region[0].FranchiseeList});
        }
    }

    onNewTransaction = () => {
        if(this.props.filterState) this.props.toggleFilterPanel();

        this.props.openNewTransactionForm();
    };

    getTransactions =(rawData=this.props.transactions) =>{
        if(rawData.transactionsDB===null) return;

        let temp0 = rawData.transactionsDB.Data;
        let temp=[];
        let all_temp=[];
        const statusStrings = ['Open', 'Completed'];
        const keys=['checkedOpen', 'checkedCompleted'];

        this.setState({temp: temp0});
        this.setState({data: temp0});
    };

    render()
    {
        const {classes, filterState, toggleFilterPanel, transactionForm} = this.props;

        let menuItem = null;

        if(this.props.navigation.length>0){
            let menu = _.filter(this.props.navigation, n=>n.Slug==='franchisees');
            if(menu.length>0) menuItem = menu[0];
        }


        return (
            <React.Fragment>
                <FusePageCustom
                    classes={{
                        root: classes.layoutRoot,
                        header: classes.layoutHeader,
                        content: classes.content,
                        leftSidebar : classNames(classes.layoutLeftSidebar, {'openFilter': filterState}),
                        sidebarHeader: classes.layoutSidebarHeader,
                    }}
                    leftSidebarHeader={
                        <div className={classNames("flex flex-row w-full h-full justify-between p-12 align-middle pr-0", {'filteropen': filterState})}>
                            <h4 style={{marginBlockStart: '1em'}}>Filter Panel</h4>
                            <FuseAnimate animation="transition.expandIn" delay={200}>
                                <div>

                                    <IconButton onClick={(ev)=>toggleFilterPanel()}>
                                        <Icon>close</Icon>
                                    </IconButton>
                                </div>
                            </FuseAnimate>
                        </div>
                    }
                    leftSidebarContent={
                        <TransactionForm franchisees={this.state.franchisees} selectedTransaction={this.state.selectedTransaction}/>
                    }
                    header={
                        <div className="flex w-full items-center">
                            {(this.state.temp && !transactionForm.props.open) && (
                                <div className="flex row flex-1  p-8 sm:p-12 relative justify-between">
                                    <div className="flex flex-row flex-1 justify-between">
                                        <div className="flex flex-shrink items-center">
                                            <div className="flex items-center">
                                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                                    <Icon className="text-32 mr-12">{menuItem!==null ? menuItem.Icon : 'account_box'}</Icon>
                                                </FuseAnimate>
                                                <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                                    <Typography variant="h6" className="hidden sm:flex">Franchisees | Transactions</Typography>
                                                </FuseAnimate>
                                            </div>
                                        </div>
                                        <div className="flex flex-shrink items-center">
                                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                                <Button variant="contained" color="primary"
                                                        className={classNames(classes.btntop) } onClick={this.onNewTransaction}>
                                                    New Transaction
                                                    <Icon className={classes.rightIcon}>add</Icon>
                                                </Button>
                                            </FuseAnimate>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(this.state.temp && transactionForm.props.open) && (
                                <div className="flex row flex-1  p-8 sm:p-12 relative justify-between">
                                    <div className="flex flex-row flex-1 justify-between">
                                        <div className="flex flex-shrink items-center">
                                            <div className="flex items-center">
                                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                                    <Toolbar className="pl-12 pr-0">
                                                        <img className="mr-12" src="assets/images/invoices/invoice-icon-white.png" alt="new transaction" style={{width: 32, height: 32}}/>
                                                    </Toolbar>
                                                </FuseAnimate>

                                                {this.props.transactionForm.type === 'edit' && (
                                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                                        <Typography variant="h6" className="hidden sm:flex">Franchisees | Edit Transaction</Typography>
                                                    </FuseAnimate>
                                                )}
                                                {this.props.transactionForm.type === 'new' && (
                                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                                        <Typography variant="h6" className="hidden sm:flex">Franchisees | New Transaction</Typography>
                                                    </FuseAnimate>
                                                )}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    }
                    content={
                        <div className="flex-1 flex-col absolute w-full h-full">
                            {(this.state.temp && !transactionForm.props.open) && (
                                <div className={classNames("flex flex-col h-full")}>
                                    <div className="flex flex-row items-center p-12">
                                        <div className="flex justify-start items-center">
                                            <Hidden smDown>
                                                <Button
                                                    onClick={(ev) => toggleFilterPanel()}
                                                    aria-label="toggle filter panel"
                                                    color="secondary"
                                                    disabled={filterState ? true : false}
                                                    className={classNames(classes.filterPanelButton)}
                                                >
                                                    <img className={classes.imageIcon} src="assets/images/invoices/filter.png" alt="filter"/>
                                                </Button>
                                            </Hidden>
                                            <Hidden smUp>
                                                <Button
                                                    onClick={(ev) => this.pageLayout.toggleLeftSidebar()}
                                                    aria-label="toggle filter panel"
                                                    className={classNames(classes.filterPanelButton)}
                                                >
                                                    <img className={classes.imageIcon} src="assets/images/invoices/filter.png" alt="filter"/>
                                                </Button>
                                            </Hidden>
                                        </div>
                                        <div className="flex items-center w-full h-44 mr-12 ml-12">
                                            <Paper className={"flex items-center h-44 w-full lg:mr-12 xs:mr-0"} elevation={1}>
                                                <Input
                                                    placeholder="Search..."
                                                    className={classNames(classes.search, 'pl-16')}
                                                    // className="pl-16"
                                                    disableUnderline
                                                    fullWidth
                                                    value={this.state.s}
                                                    onChange={this.handleChange('s')}
                                                    inputProps={{
                                                        'aria-label': 'Search'
                                                    }}
                                                />
                                                <Icon color="action" className="mr-16">search</Icon>
                                            </Paper>
                                        </div>
                                    </div>
                                    {/*<TransactionLists data={this.state.temp}/>*/}
                                    <TransactionDxGridLists data={this.state.temp}/>
                                </div>
                            )}
                            {(this.state.temp && transactionForm.props.open) && (
                                <TransactionForm franchisees={this.state.franchisees} selectedTransaction={this.state.selectedTransaction}/>
                            )}
                        </div>
                    }
                    onRef={instance => {
                        this.pageLayout = instance;
                    }}
                >
                </FusePageCustom>
                {(this.props.bFranchiseesFetchStart || this.props.bStartFetchTransactions) && (
                    <div className={classes.overlay}>
                        <CircularProgress className={classes.progress} color="secondary"  />
                    </div>
                )}
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getTransactions: Actions.getTransactions,
        toggleFilterPanel: Actions.toggleTransactionFilterPanel,
        openNewTransactionForm: Actions.openNewTransactionForm,
        openEditTransactionForm: Actions.openEditTransactionForm,
        getFranchisees: Actions.getFranchisees,
    }, dispatch);
}

function mapStateToProps({transactions, auth, franchisees, fuse})
{
    return {
        transactions: transactions,
        transactionForm: transactions.transactionForm,
        bLoadedTransactions: transactions.bLoadedTransactions,
        bTransactionsUpdated: transactions.bTransactionsUpdated,
        bStartFetchTransactions: transactions.bStartFetchTransactions,
        filterState: transactions.bOpenedTransactionFilterPanel,
        transactionStatus: transactions.transactionStatus,
        removedTrxKey: transactions.removedTrxKey,

        regionId: auth.login.defaultRegionId,

        bLoadedFranchisees: franchisees.bLoadedFranchisees,
        franchisees: franchisees.franchiseesDB,
        fstatusId: franchisees.statusId,
        fLocation: franchisees.Location,
        fLongitude: franchisees.Longitude,
        fLatitude: franchisees.Latitude,
        fSearchText: franchisees.SearchText,
        bFranchiseesFetchStart: franchisees.bFranchiseesFetchStart,
        navigation: fuse.navigation
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(TransactionDetail)));
