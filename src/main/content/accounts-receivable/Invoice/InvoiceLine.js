import React from 'react';
import NumberFormat from 'react-number-format';
import {withRouter} from 'react-router-dom';

//Material UI core and icons
import {
    Table, TableBody, TableCell, TableRow, Snackbar, SnackbarContent,
    Paper, Icon, IconButton, Select, OutlinedInput, MenuItem, FormControl, Fab
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';

// third party
import _ from 'lodash';
import Chance from "chance";
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import "react-table/react-table.css";

//Store
import {bindActionCreators} from "redux";
import connect from "react-redux/es/connect/connect";
import * as Actions from 'store/actions';
import keycode from "keycode";

//Snackbar
const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles1 = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.dark,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
        </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

MySnackbarContent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const chance = new Chance();
let counter = 0;

function createFranchisee(parent_id,id, franchisee="Franchisee", name="Franchisee Name", amount=0) {
    return {
        id: parent_id,
        fid: id,
        franchisee,
        name,
        amount,
        type: 'franch'
    }
}

function createData(billing='Regular Billing', service='Adjust-Balance', description=' ', quantity=' ', amount=' ', tax=" ", markup=0, extended=0)
{
    return {
        id: counter++,
        billing,
        service,
        description,
        quantity,
        amount,
        tax,
        markup,
        extended,
        franchisees: [],
        type: 'line'
    };
}

const rows = [
    {
        id            : 'billing',
        numeric       : false,
        disablePadding: false,
        label         : 'Billing'
    },
    {
        id            : 'service',
        numeric       : false,
        disablePadding: false,
        label         : 'Service'
    },
    {
        id            : 'description',
        numeric       : false,
        disablePadding: false,
        label         : 'Description'
    },
    {
        id            : 'quantity',
        numeric       : true,
        disablePadding: false,
        label         : 'Quantity'
    },
    {
        id            : 'amount',
        numeric       : true,
        disablePadding: false,
        label         : 'Amount'
    },
    {
        id            : 'markup',
        numeric       : true,
        disablePadding: false,
        label         : 'Markup (%)'
    },
    {
        id            : 'extend_amount',
        numeric       : true,
        disablePadding: false,
        label         : 'Extended Amount'
    }
];

const styles = theme => ({
    root        : {
        width    : '100%',
        marginTop: theme.spacing.unit * 2,
        head: {
            color: 'black',
        },
        '& thead tr th':{
            color: 'black!important',
            fontWeight: 700,
            fontSize: '1.1rem',
            padding: "4px 24px",
            borderRight: '1px solid darkgray'
        },
        '& tbody tr td':{
            padding: "4px 12px",
            width: 120
        },
        '& .ReactTable .rt-thead.-headerGroups': {
            display: 'none'
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
        '& .ReactTable .rt-thead .rt-th:last-child': {
            justifyContent: 'flex-end'
        },
        InvoiceLineHeadRoot:{
            backgroundColor: 'lightgray',
        },
        selectRoot:{
            backgroundColor: 'green'
        }
    },
    outlined: {
        padding: "12px 24px 12px 12px!important"
    },
    billing:{
        width: 180,
        fontSize: '1.3rem'
    },
    services:{
        width: 200,
        fontSize: '1.3rem'
    },
    description:{
        width: '420px!important',
        flexGrow: 1.0,
    },
    markup:{
        width: '120px!important'
    },
    extended:{
        width: '120px!important'
    },
    quantity:{
        '& div': {
            width: '60px!important',
            textAlign: 'center',
            float: 'none'
        }
    },
    actionsWrap: {
        width: '180px!important'
    },
    table       : {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    lineButton: {
        width: 32,
        height: 32,
        minHeight: 32,
        [theme.breakpoints.down('sm')]: {
            width: 24,
            height: 24,
            minHeight: 24,
        }
    },
    lineCancelButton:{
        width: 32,
        height: 32,
        minHeight: 32,
        backgroundColor: '#ff4850',
        color: 'white',
        '&:hover':{
            backgroundColor: '#ff2a32',
        },
        [theme.breakpoints.down('sm')]: {
            width: 24,
            height: 24,
            minHeight: 24,
            padding: 0
        }
    },
    tableCellAction: {
        [theme.breakpoints.down('sm')]: {
            padding: '0!important'
        }
    },
    franchisees: {
        '& td': {
            borderBottom: 'none',
        },
        '& td:nth-child(1)': {
            width: 400
        },
        '& td:nth-child(3)': {
            width: 120,
            '& div':{
                border: '1px solid lightgray',
                borderRadius: '6px',
                padding: '8px 12px'
            }
        },
        '& td:nth-child(4)': {
            width: 420,
            '& div':{
                border: '1px solid lightgray',
                borderRadius: '6px',
                padding: '8px 12px'
            }
        },
        '& td:nth-child(5)': {
            width: 100,
            '& div':{
                border: '1px solid lightgray',
                borderRadius: '6px',
                padding: '8px 12px'
            }
        }
    },
    distribution: {
        '& span': {
            backgroundColor: 'lightgrey',
            padding: '8px 12px',
            borderRadius: 20
        }
    },
    tableTheadRow:{
        // backgroundColor: 'rgba(' + hexToRgb(theme.palette.primary.main).r + ',' + hexToRgb(theme.palette.primary.main).g + ',' + hexToRgb(theme.palette.primary.main).b +', .2)'
        backgroundColor: theme.palette.primary.main
    },
});

class InvoiceLineTable extends React.Component {
    state = {
        order      : 'asc',
        // orderBy    : 'billing',
        selected   : [],
        data       : [
            createData("Regular Billing", "Adjust-Balance", " ",' '),
        ],
        page       : 0,
        rowsPerPage: 10,
        labelWidth: 0,
        openSnack: false,
        snackMessage: 'Please fill the data'
    };

    constructor(props) {
        super(props);
        this.addInvoiceLineFunction = this.addInvoiceLineFunction.bind(this);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.addInvoiceLineFunction, false);
    }

    addInvoiceLineFunction(event){
        if(keycode(event)==='enter' || keycode(event)==='down'){
            this.addLineData();
        }
    }

    handleChangeBilling = (event, n) => {
        let newData = this.state.data.map(row=>{
            let temp = row;
            if(n.id===row.id){
                temp[event.target.name] = event.target.value
            }
            return temp;
        });

        this.setState({data: newData})
    };

    componentDidMount(){
        document.addEventListener("keydown", this.addInvoiceLineFunction, false);

        let id = 0;
        const data = [...this.state.data];
        let newData = data.map(record=>{
            record.id = id++;
            return record;
        });
        this.setState({data: newData})
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevState.data!==this.state.data){
            this.props.updateInvoiceLine(this.state.data);
        }
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openSnack: false });
    };

    addLineData=()=>{
        const lineData = [...this.state.data];
        const lastRow = lineData[lineData.length-1];

        if(lastRow.description===' ') {
            this.setState({snackMessage: 'Please enter description'})
            this.setState({openSnack: true});
            return;
        }

        if(lastRow.quantity===' ') {
            this.setState({snackMessage: 'Please enter quantity'})
            this.setState({openSnack: true});
            return;
        }

        if(lastRow.amount===' ') {
            this.setState({snackMessage: 'Please enter amount'})
            this.setState({openSnack: true});
            return;
        }

        const data = [...this.state.data, createData()];
        let id = 0;
        let newData = data.map(record=>{
            record.id = id++;
            return record;
        });
        this.setState({data: newData})
    };

    addFranchiseeLine = (n) =>{
        const data = [...this.state.data];
        let fline = createFranchisee(n.id, n.franchisees.length);
        n.franchisees = [...n.franchisees, fline];

        let newData = data.map(record=>{
            if(record.id===n.id)
                record = n;
            return record;
        });
        this.setState({data: newData})
    };

    removeLineData=(line)=>{
        const data = [...this.state.data];
        _.remove(data, function (row) {
            return row.id === line.id;
        });
        let id = 0;
        let newData = data.map(record=>{
            record.id = id++;
            return record;
        });

        this.setState({data: newData})
    };

    removeFranch=(parent_id, child_id)=>{
        const data = [...this.state.data];

        data.forEach(d=>{
            if(d.franchisees.length>0 && d.id===parent_id){
                let franchisees = d.franchisees;
                _.remove(franchisees, function (record) {
                    return record.fid === child_id
                })
            }
        });

        data.forEach(d=>{
            if(d.franchisees.length>0 && d.id===parent_id){
                let fid=0;
                let franchisees = d.franchisees;
                let newData = franchisees.map(record=>{
                    record.fid = fid++;
                    return record;
                });
                d.franchisees = newData
            }
        });
        this.setState({data: data});
    };

    renderEditable(cellInfo, id) {
        if (cellInfo.id>this.state.data.length-1) return;
        let prefix = '';
        if (id==='amount' || id==='tax' || id==='extended') {
            if(this.state.data[cellInfo.id][id]!==' ')
            prefix = "$";
        }

        if(this.state.data[cellInfo.id][id].length===0) return;

        let value='';
        value= this.state.data[cellInfo.id][id];

        if (id==='amount' || id==='tax' || id==='extended') {
            if(this.state.data[cellInfo.id][id]!==' ')
                value = parseFloat(this.state.data[cellInfo.id][id]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        }
        return (
            <div
                style={{ backgroundColor: "#fafafa", padding: 12, border: "1px solid lightgray", borderRadius: 6, width: '100%' }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.data];
                    data[cellInfo.id][id] = (e.target.innerHTML).replace('$','').replace(',','');

                    if(id==='amount' || id==='markup') {
                        if(this.state.data[cellInfo.id][id]!==' ')
                        data[cellInfo.id][id] = parseFloat(data[cellInfo.id][id]);
                    }

                    if(id==='quantity') {
                        if(this.state.data[cellInfo.id][id]!==' ')
                        data[cellInfo.id][id] = parseInt(data[cellInfo.id][id]);
                    }
                    this.setState({ data });
                }}
                dangerouslySetInnerHTML={{
                    __html: prefix + value
                }}
            />
        );
    }
    renderEditableMarkup(cellInfo, id) {
        if (cellInfo.id>this.state.data.length-1) return;
        return (
            <div
                style={{ backgroundColor: "#fafafa", padding: 12, border: "1px solid lightgray", width: '100%', borderRadius: 6 }}
                contentEditable={cellInfo.billing==="Client Supplies" ? true: false}
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.data];
                    data[cellInfo.id][id] = e.target.innerHTML;
                    this.setState({ data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.id][id]
                }}
            />
        );
    }

    render()
    {
        const {classes} = this.props;
        const {data} = this.state;

        let all_data = [];

        data.forEach(d=>{
            if(d.franchisees.length===0) return all_data.push(d);
            let franchisees = d.franchisees;
            all_data.push(d);
            franchisees.forEach(f=>{
                all_data.push(f);
            });
        });

        return (
            <Paper className={classNames(classes.root)}>
                <div className={classNames(classes.tableWrapper, "flex flex-col h-full")}>
                    <Table className={classNames(classes.table, "flex flex-col h-full")} aria-labelledby="tableTitle" style={{display: 'block'}}>
                        <TableBody className="flex flex-col" style={{overflowY: 'scroll'}}>
                            {
                                all_data.map((n, index) => {
                                    if(n.type==='line')
                                        return (
                                            <TableRow hover key={n.id} style={{height: 52}}>
                                                <TableCell component="td" scope="row" >
                                                    <FormControl variant="outlined" className={classNames(classes.selectRoot, classes.formControl)} style={{marginBottom: '0!important'}}>
                                                        <Select
                                                            classes={{
                                                                outlined: classNames(classes.outlined, classes.billing)
                                                            }}
                                                            value={n.billing}
                                                            onChange={(ev)=>this.handleChangeBilling(ev, n)}
                                                            input={
                                                                <OutlinedInput
                                                                    labelWidth={this.state.labelWidth}
                                                                    name="billing"
                                                                    id="billing"
                                                                />
                                                            }
                                                        >
                                                            <MenuItem value="">
                                                                <em>Select</em>
                                                            </MenuItem>
                                                            <MenuItem value="Regular Billing">Regular Billing</MenuItem>
                                                            <MenuItem value="Additional Billing Office">Additional Billing Office</MenuItem>
                                                            <MenuItem value="Extra Work">Extra Work</MenuItem>
                                                            <MenuItem value="Client Supplies">Client Supplies</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell>
                                                    <FormControl variant="outlined" className={classes.formControl} style={{marginBottom: '0!important'}}>
                                                        <Select
                                                            classes={{
                                                                outlined: classNames(classes.outlined,classes.services)
                                                            }}
                                                            value={n.service}
                                                            onChange={(ev)=>this.handleChangeBilling(ev, n)}
                                                            input={
                                                                <OutlinedInput
                                                                    labelWidth={this.state.labelWidth}
                                                                    name="service"
                                                                    id="service"
                                                                />
                                                            }
                                                        >
                                                            <MenuItem value="">
                                                                <em>Select</em>
                                                            </MenuItem>
                                                            <MenuItem value="Adjust-Balance">Adjust - Balance</MenuItem>
                                                            <MenuItem value="Adjust-Refund">Adjust - Refund</MenuItem>
                                                            <MenuItem value="Adjust-WriteOff">Adjust - WriteOff</MenuItem>
                                                            <MenuItem value="Buffing">Buffing</MenuItem>
                                                            <MenuItem value="Carpet Clean">Carpet Clean</MenuItem>
                                                            <MenuItem value="Customer Suppliers">Customer Suppliers</MenuItem>
                                                            <MenuItem value="Emergency Clean">Emergency Clean</MenuItem>
                                                            <MenuItem value="Event Center">Event Center</MenuItem>
                                                            <MenuItem value="Floor Services">Floor Services</MenuItem>
                                                            <MenuItem value="Furniture Cleaning Service">Furniture Cleaning Service</MenuItem>
                                                            <MenuItem value="High Dusting">High Dusting</MenuItem>
                                                            <MenuItem value="Hotel">Hotel</MenuItem>
                                                            <MenuItem value="In-House Work">In-House Work</MenuItem>
                                                            <MenuItem value="Initial and Deep Clean">Initial and Deep Clean</MenuItem>
                                                            <MenuItem value="Initial One-Time Clean">Initial One-Time Clean</MenuItem>
                                                            <MenuItem value="Make Ready">Make Ready</MenuItem>
                                                            <MenuItem value="Miscellaneous - Special">Miscellaneous - Special</MenuItem>
                                                            <MenuItem value="Other">Other</MenuItem>
                                                            <MenuItem value="Porter Services">Porter Services</MenuItem>
                                                            <MenuItem value="Power Washing">Power Washing</MenuItem>
                                                            <MenuItem value="Regular Billing">Regular Billing</MenuItem>
                                                            <MenuItem value="Regular Cleaning - Day">Regular Cleaning - Day</MenuItem>
                                                            <MenuItem value="Regular Cleaning - Night">Regular Cleaning - Night</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell classes={{root:classNames(classes.description)}}>{this.renderEditable(n, 'description')}</TableCell>
                                                <TableCell classes={{root:classNames(classes.quantity, "mr-24 ml-24")}}>{this.renderEditable(n, 'quantity')}</TableCell>
                                                <TableCell numeric>{this.renderEditable(n, 'amount')}</TableCell>
                                                <TableCell classes={{root:classNames(classes.markup, "mr-24 ml-24")}} numeric>{this.renderEditableMarkup(n, 'markup')}</TableCell>
                                                <TableCell classes={{root:classNames(classes.extended, "mr-24 ml-24")}} numeric>${parseFloat((n.amount*n.quantity)*(1+parseFloat(n.markup)/100)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</TableCell>
                                                <TableCell classes={{root:classNames(classes.actionsWrap, "mr-24 ml-24")}} padding="checkbox">
                                                    <Fab color="secondary" aria-label="add"
                                                         className={classNames(classes.lineButton, "mr-12")}
                                                         onClick={()=>this.addFranchiseeLine(n)}
                                                    >
                                                        <Icon>call_merge</Icon>
                                                    </Fab>
                                                    <Fab color="secondary" aria-label="add"
                                                         className={classNames(classes.lineButton, "mr-12")}
                                                         onClick={()=>this.addLineData()}
                                                    >
                                                        <Icon>add</Icon>
                                                    </Fab>
                                                    {this.state.data.length>1 && (
                                                        <Fab aria-label="remove"
                                                             onClick={()=>this.removeLineData(n)}
                                                             className={classNames(classes.lineCancelButton, "mr-12")}>
                                                            <Icon>close</Icon>
                                                        </Fab>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    else //franch
                                        return (
                                            <TableRow hover key={chance.guid()} style={{height: 48}} classes={{root: classes.franchisees}}>
                                                <TableCell rowSpan={3} />
                                                <TableCell classes={{root:classNames(classes.distribution)}}  colSpan={2}><span>Distribution</span></TableCell>
                                                <TableCell className="" ><div>{n.franchisee}</div></TableCell>
                                                <TableCell className="" ><div>{n.name}</div></TableCell>
                                                <TableCell className="" numeric><div>{n.amount}</div></TableCell>
                                                <TableCell className="" >
                                                    <Fab aria-label="remove"
                                                         onClick={()=>this.removeFranch(n.id, n.fid)}
                                                         className={classNames(classes.lineCancelButton, "mr-12")} style={{width: 24, height: 24, minHeight: 24}}>
                                                        <Icon>close</Icon>
                                                    </Fab></TableCell>
                                            </TableRow>
                                        )
                                })}
                        </TableBody>
                    </Table>
                    <ReactTable
                        data={all_data}
                        minRows = {0}
                        showPagination ={false}
                        getTheadThProps={(state, rowInfo, column, instance) =>{
                            let border = '1px solid rgba(255,255,255,.6)';
                            if(column.Header==='Action') border = 'none';

                            return {
                                style:{
                                    fontSize: 13,
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
                        columns={[
                            {
                                columns: [
                                    {
                                        Header: "Billing",
                                        accessor: "billing",
                                        Cell: row=>{
                                            return (
                                                <FormControl variant="outlined" className={classNames(classes.selectRoot, classes.formControl)} style={{marginBottom: '0!important'}}>
                                                    <Select
                                                        classes={{
                                                            outlined: classNames(classes.outlined, classes.billing)
                                                        }}
                                                        value={row.original.billing}
                                                        onChange={(ev)=>this.handleChangeBilling(ev, row.original)}
                                                        input={
                                                            <OutlinedInput
                                                                labelWidth={this.state.labelWidth}
                                                                name="billing"
                                                                id="billing"
                                                            />
                                                        }
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select</em>
                                                        </MenuItem>
                                                        <MenuItem value="Regular Billing">Regular Billing</MenuItem>
                                                        <MenuItem value="Additional Billing Office">Additional Billing Office</MenuItem>
                                                        <MenuItem value="Extra Work">Extra Work</MenuItem>
                                                        <MenuItem value="Client Supplies">Client Supplies</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )
                                        },
                                        width: 200,
                                        className: classNames(classes.tableTdEven, "flex items-center  justify-center"),
                                    },
                                    {
                                        Header: "Service",
                                        accessor: "service",
                                        Cell: row=>{
                                            return (
                                                <FormControl variant="outlined" className={classes.formControl} style={{marginBottom: '0!important'}}>
                                                    <Select
                                                        classes={{
                                                            outlined: classNames(classes.outlined,classes.services)
                                                        }}
                                                        value={row.original.service}
                                                        onChange={(ev)=>this.handleChangeBilling(ev, row.original)}
                                                        input={
                                                            <OutlinedInput
                                                                labelWidth={this.state.labelWidth}
                                                                name="service"
                                                                id="service"
                                                            />
                                                        }
                                                    >
                                                        <MenuItem value="">
                                                            <em>Select</em>
                                                        </MenuItem>
                                                        <MenuItem value="Adjust-Balance">Adjust - Balance</MenuItem>
                                                        <MenuItem value="Adjust-Refund">Adjust - Refund</MenuItem>
                                                        <MenuItem value="Adjust-WriteOff">Adjust - WriteOff</MenuItem>
                                                        <MenuItem value="Buffing">Buffing</MenuItem>
                                                        <MenuItem value="Carpet Clean">Carpet Clean</MenuItem>
                                                        <MenuItem value="Customer Suppliers">Customer Suppliers</MenuItem>
                                                        <MenuItem value="Emergency Clean">Emergency Clean</MenuItem>
                                                        <MenuItem value="Event Center">Event Center</MenuItem>
                                                        <MenuItem value="Floor Services">Floor Services</MenuItem>
                                                        <MenuItem value="Furniture Cleaning Service">Furniture Cleaning Service</MenuItem>
                                                        <MenuItem value="High Dusting">High Dusting</MenuItem>
                                                        <MenuItem value="Hotel">Hotel</MenuItem>
                                                        <MenuItem value="In-House Work">In-House Work</MenuItem>
                                                        <MenuItem value="Initial and Deep Clean">Initial and Deep Clean</MenuItem>
                                                        <MenuItem value="Initial One-Time Clean">Initial One-Time Clean</MenuItem>
                                                        <MenuItem value="Make Ready">Make Ready</MenuItem>
                                                        <MenuItem value="Miscellaneous - Special">Miscellaneous - Special</MenuItem>
                                                        <MenuItem value="Other">Other</MenuItem>
                                                        <MenuItem value="Porter Services">Porter Services</MenuItem>
                                                        <MenuItem value="Power Washing">Power Washing</MenuItem>
                                                        <MenuItem value="Regular Billing">Regular Billing</MenuItem>
                                                        <MenuItem value="Regular Cleaning - Day">Regular Cleaning - Day</MenuItem>
                                                        <MenuItem value="Regular Cleaning - Night">Regular Cleaning - Night</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            )
                                        },
                                        width: 200,
                                        className: classNames(classes.tableTdEven, "flex items-center  justify-center"),
                                    },
                                    {
                                        Header: "Description",
                                        accessor: "description",
                                        Cell: row=>{
                                            return (this.renderEditable(row.original, 'description'))
                                        },
                                    },
                                    {
                                        Header: "Quantity",
                                        accessor: "quantity",
                                        Cell: row=>{
                                            return (this.renderEditable(row.original, 'quantity'))
                                        },
                                        className: classNames(classes.tableTdEven, "flex items-center  justify-center text-center"),
                                        width: 80
                                    },
                                    {
                                        Header: "Amount",
                                        accessor: "amount",
                                        Cell: row=>{
                                            return (this.renderEditable(row.original, 'amount'))
                                        },
                                        className: classNames(classes.tableTdEven, "flex items-center  justify-center text-right"),
                                        width: 100
                                    },
                                    {
                                        Header: "Tax",
                                        accessor: "tax",
                                        Cell: row=>{
                                            return (this.renderEditable(row.original, 'tax'))
                                        },
                                        className: classNames(classes.tableTdEven, "flex items-center  justify-center text-right"),
                                        width: 100
                                    },
                                    {
                                        Header: "Markup(%)",
                                        accessor: "markup",
                                        Cell: row=>{
                                            return (this.renderEditableMarkup(row.original, 'markup'))
                                        },
                                        className: classNames(classes.tableTdEven, "flex items-center  text-right justify-end"),
                                        width: 100
                                    },
                                    {
                                        Header: "Extended Amount",
                                        accessor: "markup",
                                        Cell: row=>{
                                            return ("$"+parseFloat((row.original.amount*row.original.quantity)*(1+parseFloat(row.original.markup)/100)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'))
                                        },
                                        className: classNames(classes.tableTdEven, "flex items-center  w-full text-center justify-end pr-12"),
                                        width: 140
                                    },
                                    {
                                        Header: "Action",
                                        width: 200,
                                        Cell: row=>{
                                            return (
                                                <div className="flex flex-row items-center w-full justify-center">
                                                    <Fab color="secondary" aria-label="add"
                                                         className={classNames(classes.lineButton, "mr-12")}
                                                         onClick={()=>this.addFranchiseeLine(row.original)}
                                                    >
                                                        <Icon>call_merge</Icon>
                                                    </Fab>
                                                    <Fab color="secondary" aria-label="add"
                                                         className={classNames(classes.lineButton, "mr-12")}
                                                         onClick={()=>this.addLineData()}
                                                    >
                                                        <Icon>add</Icon>
                                                    </Fab>
                                                    {this.state.data.length>1 && (
                                                        <Fab aria-label="remove"
                                                             onClick={()=>this.removeLineData(row.original)}
                                                             className={classNames(classes.lineCancelButton, "mr-12")}>
                                                            <Icon>close</Icon>
                                                        </Fab>
                                                    )}
                                                </div>
                                            )
                                        }
                                    },
                                ]
                            }
                        ]}
                        className={classNames( "-striped -highlight")}
                        defaultPageSize={200}
                        style={{
                            height: '100%',
                        }}
                    />
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openSnack}
                    autoHideDuration={3000}
                    onClose={this.handleClose}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleClose}
                        variant="error"
                        message={this.state.snackMessage}
                    />
                </Snackbar>
            </Paper>
        );
    }
}

InvoiceLineTable.propTypes = {
    classes: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        updateInvoiceLine: Actions.updateInvoiceLine
    }, dispatch);
}

function mapStateToProps({invoices })
{
    return {
        invoiceForm: invoices.invoiceForm
    }
}

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(InvoiceLineTable)));
