import React, {Component} from 'react';

//DevExtreme React-Grid
import {
    PagingState,
    IntegratedPaging,
    DataTypeProvider,
    SummaryState,
    IntegratedSummary,
} from '@devexpress/dx-react-grid';

import {
    Grid,
    Table,
    VirtualTable,
    TableHeaderRow,
    TableSummaryRow, PagingPanel
} from '@devexpress/dx-react-grid-material-ui';


import {withStyles} from "@material-ui/core";
import {withRouter} from 'react-router-dom';

// for store
import {bindActionCreators} from "redux";
import connect from "react-redux/es/connect/connect";
import * as Actions from 'store/actions';

// third party
import "react-table/react-table.css";
import classNames from 'classnames';
import NumberFormat from 'react-number-format';

//Theme Utilities
import FuseUtils from '@fuse/FuseUtils';

const styles = theme => ({
    tableTheadRow: {
        backgroundColor: theme.palette.primary.main,
        '& tr': {
            height: 48
        },
        '& tr th': {
            color: 'white'
        },
        '& tr th:nth-child(3)': {
            width: '100%'
        }
    },
    imageIcon: {
        width: 24
    },
    tableStriped: {
        marginBottom: '0!important',
        '& tbody tr:nth-of-type(odd)': {
        },
        '& tbody tr td': {
            fontSize: 11,
            paddingLeft: 4,
            paddingRight: 4
        },
        '& tbody tr td:nth-child(3)': {
            width: '100%',
        },

    },
    tableFootRow: {
        '& td:nth-child(3)': {
            width: '100%',
        },
    }
});

const TableComponentBase = ({ classes, ...restProps }) => (
    <Table.Table
        {...restProps}
        className={classes.tableStriped}
    />
);

const TableHeadComponentBase = ({ classes, ...restProps }) => (
    <Table.TableHead
        {...restProps}
        className={classes.tableTheadRow}
    />
);

const TableSummaryComponentBase = ({ classes, ...restProps }) => (
    <Table.Row
        {...restProps}
        className={classes.tableFootRow}
    />
);

export const TableComponent = withStyles(styles, { name: 'TableComponent' })(TableComponentBase);
export const TableSummaryComponent = withStyles(styles, { name: 'TableSummaryComponent' })(TableSummaryComponentBase);
export const TableHeadComponent = withStyles(styles, { name: 'TableHeadComponent' })(TableHeadComponentBase);

const CurrencyFormatter = ({value}) => (
    <NumberFormat value={value}
                  displayType={'text'}
                  fixedDecimalScale={true}
                  thousandSeparator
                  decimalScale={2}
                  prefix="$" renderText={value => <div>{value}</div>}/>
);

const CurrencyTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={CurrencyFormatter}
        {...props}
    />
);

class CustomerTransactions extends Component {
    state = {
        pageSizes: [5, 10, 25, 50, 100],
        currentPage: 0,
        pageSize: 100,
    };

    constructor(props) {
        super(props);

        this.changeCurrentPage = currentPage => this.setState({currentPage});
        this.changePageSize = pageSize => this.setState({pageSize});
    }

    onChange = (event, {newValue, method}) => {
        this.setState({
            value: newValue.toString()
        });
    };


    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentDidMount() {
        //'/franchisees/reports/:regionid/:year/:month/:franchiseenumber',
        if( this.props.transactionDetail!==null) {
            let trxDetail = this.props.transactionDetail.Data;
            console.log('trxDetail=', trxDetail);
            this.props.getReport({
                regionId: this.props.regionId,
                year: '2017',
                month: '1',
                franchiseenumber: trxDetail.dlr_code
            });
        }
    }

    componentWillMount() {
    }

    componentWillUnmount() {

    }


    changeSorting = sorting => this.setState({ sorting });

    render() {
        const {classes, franchiseeReport} = this.props;
        if(franchiseeReport===null || franchiseeReport!==null && franchiseeReport.Data.CUS_TRXS===null)
            return (<div/>);

        let data = franchiseeReport.Data.CUS_TRXS.map(d=>{
            d.DESCR = FuseUtils.capital_letter(d.DESCR);
            d.CUS_NAME = FuseUtils.capital_letter(d.CUS_NAME);
            d.TRX_AMT = parseFloat(d.TRX_AMT);
            d.TRX_TAX = parseFloat(d.TRX_TAX);
            d.TRX_TOT = parseFloat(d.TRX_TOT);
            return d;
        });

        const columns = [
            {name: "CUST_NO", title: "Cus. #",},
            {name: "CUS_NAME", title: "Cus. Name"},
            {name: "DESCR", title: "Description"},
            {name: "INV_NO", title: "Invoice #"},
            {name: "TRX_TYPE", title: "Type"},
            {name: "TRX_AMT", title: "Amount"},
            {name: "TRX_TAX", title: "Tax"},
            {name: "TRX_TOT", title: "Total"},
        ];

        let  tableColumnExtensions = [
            { columnName: 'CUST_NO', width: 80, },
            { columnName: 'CUS_NAME', width: 220, },
            { columnName: 'DESCR', width: -1, },
            { columnName: 'INV_NO', width: 80},
            { columnName: 'TRX_TYPE', width: 50,  align: 'center'},
            { columnName: 'TRX_AMT', width: 100,  align: 'right'},
            { columnName: 'TRX_TAX', width: 100,  align: 'right'},
            { columnName: 'TRX_TOT', width: 100,  align: 'right'},
        ];

        let totalSummaryItems = [
            { columnName: 'TRX_AMT',  title: 'Amount Sum', type: 'sum'},
            { columnName: 'TRX_TAX',  type: 'sum'},
            { columnName: 'TRX_TOT',  type: 'sum'},
        ];

        return (
            <div className={classNames(classes.layoutTable, "flex flex-col mt-4 mb-24")}>
                <h2>Customer Transactions</h2>
                <Grid rows={data} columns={columns}>
                    <PagingState
                        currentPage={this.state.currentPage}
                        onCurrentPageChange={this.changeCurrentPage}
                        pageSize={this.state.pageSize}
                        onPageSizeChange={this.changePageSize}
                    />
                    <CurrencyTypeProvider
                        for={['TRX_AMT', 'TRX_TAX', 'TRX_TOT']}
                    />

                    <IntegratedPaging/>
                    <SummaryState
                        totalItems={totalSummaryItems}
                    />
                    <IntegratedSummary />

                    <VirtualTable height="auto"
                                  tableComponent={TableComponent}
                                  headComponent = {TableHeadComponent}
                                  columnExtensions={tableColumnExtensions}
                    />
                    <TableHeaderRow />
                    {/*<PagingPanel pageSizes={this.state.pageSizes} />*/}
                    <TableSummaryRow  totalRowComponent={TableSummaryComponent}/>
                </Grid>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeTransaction: Actions.removeTransaction,
        openEditTransactionForm: Actions.openEditTransactionForm,
        getReport: Actions.getReport,
    }, dispatch);
}

function mapStateToProps({transactions, auth, franchiseeReports}) {
    return {
        regionId: auth.login.defaultRegionId,
        transactions: transactions.transactionsDB,
        transactionTypeList: transactions.transactionTypeList,
        franchiseeReport: franchiseeReports.franchiseeReport,
        transactionDetail: transactions.transactionDetail,
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomerTransactions)));

