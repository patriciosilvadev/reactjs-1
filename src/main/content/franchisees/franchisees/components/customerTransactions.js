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
    TableSummaryRow
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
    layoutTable: {
     '& table th:nth-child(2) span': {
            // display: 'none'
     },
     '& th':{
         borderBottom: `2px solid ${theme.palette.text.primary}`,
         borderTop: `2px solid ${theme.palette.text.primary}`,
     }
    },
    tableTheadRow: {
        '& tr': {
            height: 32
        },
        '& tr th': {
            padding: '0 8px'
        },
        '& tr th:first-child': {
            paddingLeft: '0px!important',
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
        '& tbody tr':{
            height: 36
        },
        '& tbody tr:nth-of-type(odd)': {
        },
        '& tbody tr td': {
            fontSize: 12,
            paddingLeft: 4,
            paddingRight: 4
        },
        '& tbody tr td:nth-child(3)': {
            width: '100%',
        },
        '& tbody tr:last-child td': {
            borderBottom: `2px solid ${theme.palette.text.primary}`,
        }
    },
    tableFootRow: {
        height: 42,
        '& td': {
            borderBottom: `1px solid ${theme.palette.text.primary}`,
        },
        '& td:nth-child(3)': {
            width: '100%',
        },
        '& td:nth-child(5)': {
            paddingRight: 0,
        },
    }
});

const CurrencyFormatter = ({value}) => (
    <NumberFormat value={value}
                  displayType={'text'}
                  fixedDecimalScale={true}
                  thousandSeparator
                  decimalScale={2}
                  prefix="$" renderText={value => <div className="sum-01">{value}</div>}/>
);

const CurrencyTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={CurrencyFormatter}
        {...props}
    />
);

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
const TableSummaryCellComponentBase = ({ classes, ...restProps }) => {
    if(restProps.column.name==='type'){
        return (
            <Table.Cell
                {...restProps}
                colSpan={3}
                className={classes.tableSummaryCell}>
                <strong>Total Revenue for this Franchisee</strong>
            </Table.Cell>
        );
    }
    else if(restProps.column.name==='TRX_AMT' || restProps.column.name==='TRX_TAX'|| restProps.column.name==='TRX_TOT'){
        return (
            <Table.Cell
                {...restProps}
                colSpan={1}
                className={classes.tableSummaryCell}>
                {CurrencyFormatter({value: restProps.children.props.children[0].props.params.value})}
            </Table.Cell>
        );

    }
    else
        return (
            <Table.Cell
                {...restProps}
                className={classes.tableSummaryCell}
            />
        );
};

export const TableComponent = withStyles(styles, { name: 'TableComponent' })(TableComponentBase);
export const TableSummaryComponent = withStyles(styles, { name: 'TableSummaryComponent' })(TableSummaryComponentBase);
export const TableHeadComponent = withStyles(styles, { name: 'TableHeadComponent' })(TableHeadComponentBase);
export const TableSummaryCellComponent = withStyles(styles, { name: 'TableSummaryCellComponent' })(TableSummaryCellComponentBase);

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
    }

    componentWillMount() {
    }

    componentWillUnmount() {

    }


    changeSorting = sorting => this.setState({ sorting });

    render() {
        const {classes, franchiseeReport} = this.props;
        if((franchiseeReport===null) || (franchiseeReport!==null && franchiseeReport.Data.PERIODS[0].FRANCHISEES[0].CustomerTrx===null))
            return (<div/>);

        let data = franchiseeReport.Data.PERIODS[0].FRANCHISEES[0].CustomerTrx.map(d=>{
            d.DESCR = FuseUtils.capital_letter(d.Description);
            d.CUS_NAME = FuseUtils.capital_letter(d.CustomerName);
            d.TRX_AMT = parseFloat(d.Amount);
            d.TRX_TAX = parseFloat(d.Tax);
            d.TRX_TOT = parseFloat(d.Total);
            return d;
        });

        const columns = [
            {name: "CustomerNumber", title: "Customer #",},
            {name: "CUS_NAME", title: "Customer Name"},
            {name: "DESCR", title: "Description"},
            {name: "InvoiceNo", title: "Invoice #"},
            // {name: "TRX_TYPE", title: "Type"},
            // {name: "TRX_AMT", title: "Amount"},
            // {name: "TRX_TAX", title: "Tax"},
            {name: "TRX_TOT", title: "Total"},
        ];

        let  tableColumnExtensions = [
            { columnName: 'CustomerNumber', width: 90, },
            { columnName: 'CUS_NAME', width: 220, },
            { columnName: 'DESCR', width: -1, },
            { columnName: 'InvoiceNo', width: 100},
            // { columnName: 'TRX_TYPE', width: 50,  align: 'center'},
            { columnName: 'TRX_AMT', width: 100,  align: 'right'},
            { columnName: 'TRX_TAX', width: 100,  align: 'right'},
            { columnName: 'TRX_TOT', width: 100,  align: 'right'},
        ];

        let totalSummaryItems = [
            { columnName: 'TRX_AMT',  type: 'sum'},
            { columnName: 'TRX_TAX',  type: 'sum'},
            { columnName: 'TRX_TOT',  type: 'sum'},
        ];

        return (
            <div className={classNames(classes.layoutTable, "flex flex-col mt-4 mb-12")}>
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
                    {data.length>0 && (
                    <SummaryState totalItems={totalSummaryItems} />
                    )}
                    {data.length>0 && (<IntegratedSummary /> )}

                    <VirtualTable height="auto"
                                  tableComponent={TableComponent}
                                  headComponent = {TableHeadComponent}
                                  columnExtensions={tableColumnExtensions}
                    />
                    <TableHeaderRow />
                    {data.length>0 && (
                        <TableSummaryRow  totalRowComponent={TableSummaryComponent}
                                          totalCellComponent = {TableSummaryCellComponent}
                        />
                    )}
                </Grid>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeTransaction: Actions.removeTransaction,
        openEditTransactionForm: Actions.openEditTransactionForm,
    }, dispatch);
}

function mapStateToProps({transactions, auth, franchiseeReports}) {
    return {
        regionId: auth.login.defaultRegionId,
        transactions: transactions.transactionsDB,
        transactionForm: transactions.transactionForm,
        transactionTypeList: transactions.transactionTypeList,
        franchiseeReport: franchiseeReports.franchiseeReport1,
        transactionDetail: transactions.transactionDetail,
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomerTransactions)));

