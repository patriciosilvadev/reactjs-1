import React, {Component} from 'react';

// core components
import {
    Hidden, Icon, IconButton, Input, Paper, Button
} from '@material-ui/core';

//Janiking
import JanikingPagination from 'Commons/JanikingPagination';


import {withStyles, Checkbox} from "@material-ui/core";
import {withRouter} from 'react-router-dom';

// for store
import {bindActionCreators} from "redux";
import connect from "react-redux/es/connect/connect";
import * as Actions from 'store/actions';

// third party
import moment from 'moment'
import ReactTable from "react-table";
import "react-table/react-table.css";
import _ from 'lodash';
import classNames from 'classnames';
import InvoiceReport from './invoiceReport'
import {ON_MESSAGE} from "../../../chatPanel/store/actions/chat.actions";

const hexToRgb = (hex) =>{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const styles = theme => ({
    layoutTable: {
        flexDirection: 'row',
        '& .z-9999': {
            height: 64
        },
        '& .-pageSizeOptions': {
            display: 'none'
        },
        '& .p-12-impor': {
            paddingLeft: '1.2rem!important',
            paddingRight: '1.2rem!important',
        },
        '& .ReactTable .rt-noData': {
            top: '250px',
            border: '1px solid coral'
        },
        '& .ReactTable .rt-thead.-headerGroups': {
            display: 'none'
        },
        '& .ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover': {
            background: 'rgba(' + hexToRgb(theme.palette.secondary.main).r + ',' + hexToRgb(theme.palette.secondary.main).g + ',' + hexToRgb(theme.palette.secondary.main).b + ', .8)',
            color: 'white!important'
        },
        '& .ReactTable .rt-tbody': {
            overflowY: 'scroll',
            overflowX: 'hidden'
        },
        '& .ReactTable .rt-tr-group':{
            flex: '0 0 auto'
        },
        '& .ReactTable .rt-thead .rt-th:nth-child(1)': {
            justifyContent: 'center'
        },
        '& .ReactTable .rt-thead.-headerGroups .rt-th:nth-child(2)': {
            width:'inherit!important',
            minWidth:'inherit!important',
        },
        '& .ReactTable .rt-thead .rt-th:last-child': {
            justifyContent: 'flex-end'
        },
    },
    content:{
        position: 'relative'
    },
    search: {
        width: 360,
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    tableTheadRow:{
        // backgroundColor: 'rgba(' + hexToRgb(theme.palette.primary.main).r + ',' + hexToRgb(theme.palette.primary.main).g + ',' + hexToRgb(theme.palette.primary.main).b +', .2)'
        backgroundColor: theme.palette.primary.main
    },
    tableThEven:{
        backgroundColor: 'rgba(' + hexToRgb(theme.palette.secondary.main).r + ',' + hexToRgb(theme.palette.secondary.main).g + ',' + hexToRgb(theme.palette.secondary.main).b +', .3)'
    },
    tableTdEven:{
        // backgroundColor: 'rgba(' + hexToRgb(theme.palette.secondary.main).r + ',' + hexToRgb(theme.palette.secondary.main).g + ',' + hexToRgb(theme.palette.secondary.main).b +', .1)'
    },
});

class InvoiceListContent extends Component {
    state = {
        s: '',
        temp: [],
        data: [],
        selection: [],
        selectAll: false,

        selectedInvoice: null,
        isOpen: false,
        invoiceDetail: null,
        CustomerFor: [],
        CustomerSoldTo:[],
        selectedInvoice: null
    };

    onChange = (event, { newValue, method }) => {
        this.setState({
            value: newValue.toString()
        });
    };

    toggleSelection = (key, shift, row) => {
        /*
          https://react-table.js.org/#/story/select-table-hoc
          Implementation of how to manage the selection state is up to the developer.
          This implementation uses an array stored in the component state.
          Other implementations could use object keys, a Javascript Set, or Redux... etc.
        */
        // start off with the existing state
        let selection = [...this.state.selection];
        const keyIndex = selection.indexOf(key);
        // check to see if the key exists
        if (keyIndex >= 0) {
            // it does exist so we will remove it using destructing
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            // it does not exist so add it
            selection.push(key);
        }
        // update the state
        this.setState({ selection });
    };

    toggleAll = (instance) => {
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            let currentRecords = instance.data;
            // we just push all the IDs onto the selection array
            let page = this.state.page;
            let pageSize = this.state.pageSize;
            let start_index = page * pageSize;
            let end_index = start_index+pageSize;
            currentRecords.forEach(item => {
                if(item._index>=start_index && item._index<end_index)
                    selection.push(item._original.InvoiceId);
            });
        }
        this.setState({ selectAll, selection });
    };

    isSelected = key => {
        /*
          Instead of passing our external selection state we provide an 'isSelected'
          callback and detect the selection state ourselves. This allows any implementation
          for selection (either an array, object keys, or even a Javascript Set object).
        */
        return this.state.selection.includes(key);
    };

    logSelection = () => {
        console.log("selection:", this.state.selection);
    };

    toggleLeftSidebar = () => {};
    constructor(props){
        super(props);

        this.fetchData = this.fetchData.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.data!==prevProps.data)
            this.setState({data: this.props.data});
    }

    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
    }

    componentWillMount(){
        this.setState({data: this.props.data})
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);
    }

    escFunction(event){
        if(event.keyCode === 27) {
            this.setState({s: ''});
            this.setState({data: this.props.data})
        }
    }

    removeInvoices = ()=> {
        if(this.state.selection.length===0){
            alert("Please choose invoice(s) to delete");
            return;
        }
        if (window.confirm("Do you really want to remove the selected invoice(s)")) {
            this.props.deleteInvoicesAction(this.state.selection, this.props.invoices);
            this.setState({selection: [], selectAll: false})
        }
    };

    fetchData(state, instance) {
        this.setState({
            pageSize: state.pageSize,
            page: state.page,
        });
    }
    onEditInvoice = row => {
        this.props.openEditInvoiceForm(row);
    };

    invoicereport =(ev)=>{
        ev.stopPropagation();
        console.log("invoice report");
        this.props.getInvoiceDetail();
        console.log('asd=',this.props.invoicesdetail);
        this.setState({
            isOpen: !this.state.isOpen
        });
        this.setState({
            invoiceDetail: this.props.invoicesdetail,
        });
    }
    toggleModal = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }


    render()
    {
        const { classes} = this.props;
        const { toggleSelection, toggleAll, isSelected} = this;

        return (
            <div className={classNames(classes.layoutTable, "flex flex-col h-full")}>
                <ReactTable
                    data={this.state.data}
                    minRows = {0}
                    PaginationComponent={JanikingPagination}
                    onFetchData={this.fetchData}
                    getTheadThProps={(state, rowInfo, column, instance) =>{
                        let border = '1px solid rgba(255,255,255,.6)';
                        if(column.Header==='Actions') border = 'none';

                        return {
                            style:{
                                fontSize: '1.6rem',
                                fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
                                fontWeight: 400,
                                lineHeight: 1.75,
                                color: 'white',
                                borderRight: border
                            },
                        }
                    }}
                    getTheadProps={(state, rowInfo, column, instance) =>{
                        return {
                            style:{
                                fontSize: 13,
                            },
                            className: classes.tableTheadRow
                        }
                    }}
                    getTdProps={(state, rowInfo, column, instance) =>{

                        return {
                            style:{
                                textAlign: 'center',
                                flexDirection: 'row',
                                fontSize: 12,
                                padding: "0",
                            },
                        }
                    }}
                    getTrProps={(state, rowInfo, column) => {
                        return {
                            className: "cursor-pointer",
                            onClick  : (e, handleOriginal) => {
                                if ( rowInfo )
                                {
                                    if(this.props.filterState) this.props.toggleFilterPanel();
                                    if(this.props.summaryState) this.props.toggleSummaryPanel();
                                    this.props.openEditInvoiceForm(rowInfo.original);
                                }
                            }
                        }
                    }}
                    columns={[
                        {
                            columns: [
                                {
                                    Header   : (instance) => (
                                        <Checkbox
                                            onClick={(event) => {
                                                event.stopPropagation();
                                            }}
                                            onChange={(event) => toggleAll(instance) }
                                            checked={this.state.selectAll}
                                            style={{color: 'white'}}
                                        />
                                    ),
                                    accessor : "",
                                    Cell     : row => {
                                        return (<Checkbox
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                }}
                                                checked={isSelected(row.value.InvoiceId)}
                                                onChange={() => toggleSelection(row.value.InvoiceId)}
                                            />
                                        )
                                    },
                                    className: "justify-center",
                                    sortable : false,
                                    width    : 72
                                }
                            ],
                            className: classNames("justify-center")
                        },
                        {
                            columns: [
                                {
                                    Header: "Invoice #",
                                    accessor: "InvoiceNo",
                                    filterAll: true,
                                    width: 120,
                                    Cell: props => <Button onClick={this.invoicereport}>{props.value}</Button> ,
                                    className: classNames(classes.tableTdEven, "flex items-center  justify-center")
                                },
                                {
                                    Header: "Description",
                                    accessor: "InvoiceDescription",
                                    width: 420,
                                    className: classNames("flex items-center  justify-start p-12-impor")
                                },
                                {
                                    Header: "Customer #",
                                    accessor: "CustomerNo",
                                    className: classNames(classes.tableTdEven, "flex items-center  justify-center"),
                                    width: 120
                                },
                                {
                                    Header: "Customer Name",
                                    accessor: "CustomerName",
                                    width: 280,
                                    className: classNames("flex items-center  justify-start p-12-impor")
                                },
                                {
                                    Header: "Balance",
                                    accessor: "InvoiceBalanceAmount",
                                    Cell     : row => {
                                        return '$'+parseFloat(row.original.InvoiceBalanceAmount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                                    },
                                    className: classNames(classes.tableTdEven, "flex items-center  justify-end p-12-impor"),
                                    width: 120
                                },
                                {
                                    Header: "Total",
                                    Cell     : row => {
                                        return '$'+parseFloat(row.original.InvoiceTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                                    },
                                    accessor: "InvoiceTotal",
                                    className: classNames("flex items-center  justify-end p-12-impor"),
                                    width: 120
                                },
                                {
                                    Header: "Invoice Date",
                                    id: "InvoiceDate",
                                    accessor: d => moment(d.InvoiceDate).format('MM/DD/YYYY'),
                                    className: classNames(classes.tableTdEven, "flex items-center  justify-center"),
                                    width: 120
                                },
                                {
                                    Header: "Due Date",
                                    id: "DueDate",
                                    accessor: d => moment(d.DueDate).format('MM/DD/YYYY'),
                                    className: classNames("flex items-center  justify-center"),
                                    width: 120
                                },
                                {
                                    Header: "Status",
                                    accessor: "TransactionStatus",
                                    className: classNames(classes.tableTdEven, "flex items-center  justify-center"),
                                    width: 120
                                },
                                {
                                    Header: "Actions",
                                    width : 128,
                                    Cell  : row => (
                                        <div className="flex items-center actions">
                                            <IconButton
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    if (window.confirm("Do you really want to remove this invoice")) {
                                                        this.props.removeInvoiceAction(row.original.InvoiceId, this.props.invoices);
                                                        if(this.state.selection.length>0){
                                                            _.remove(this.state.selection, function(id) {
                                                                return id === row.original.InvoiceId;
                                                            });
                                                        }
                                                    }
                                                }}
                                            >
                                                <Icon>delete</Icon>
                                            </IconButton>
                                            <IconButton
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    this.props.openEditInvoiceForm(row.original);
                                                }}
                                            >
                                                <Icon>edit</Icon>
                                            </IconButton>
                                        </div>
                                    )
                                }
                            ]
                        },
                        {
                            columns:[
                                {
                                    Header: '',
                                    cell: ()=>(
                                        <div className="flex w-full justify-end"/>
                                    )
                                }
                            ]
                        }
                    ]}
                    defaultPageSize={100}
                    className={classNames( "-striped -highlight")}
                    totalRecords = {this.state.data.length}
                    style={{
                        height: '100%',
                    }}
                />

                <InvoiceReport show={this.state.isOpen} onClose={this.toggleModal} getData={this.state.invoiceDetail}>

                </InvoiceReport>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        deleteInvoicesAction: Actions.deleteInvoices,
        removeInvoiceAction: Actions.removeInvoice,
        openEditInvoiceForm: Actions.openEditInvoiceForm,
        closeEditInvoiceForm: Actions.closeEditInvoiceForm,
        getInvoiceDetail: Actions.getInvoiceDetail,
        toggleFilterPanel: Actions.toggleFilterPanel,
        toggleSummaryPanel: Actions.toggleSummaryPanel,
    }, dispatch);
}

function mapStateToProps({invoices, auth})
{
    return {
        invoices: invoices.invoicesDB,
        invoicesdetail: invoices.invoiceDetail,
        transactionStatus: invoices.transactionStatus,
        regionId: auth.login.defaultRegionId,
        InvoiceForm: invoices.InvoiceForm,
        filterState: invoices.bOpenedFilterPanel,
        summaryState: invoices.bOpenedSummaryPanel,
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(InvoiceListContent)));

