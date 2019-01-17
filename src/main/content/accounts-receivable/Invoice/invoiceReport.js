import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles,Card, CardContent, Typography, TextField, Checkbox} from "@material-ui/core";
import {withRouter} from 'react-router-dom';


class InvoiceReport extends Component {
    state = {
        isOpen: false,
        invoiceDetail: [],
        Items: [],
        Region: [],
        CustomerSoldTo:[],
        CustomerFor:[],

    };
    componentWillReceiveProps(nextProps) {

        if(nextProps.Detail) {
            console.log('Detail', nextProps.Detail)
            this.setState({
                invoiceDetail:nextProps.Detail.Data,
                Items: nextProps.Detail.Data.Items,
                Region: nextProps.Detail.Data.Region,
            });
        }
    }
    componentWillMount(){
        this.setState({
            invoiceDetail:this.props.Detail.Data,
            Items: this.props.Detail.Data.Items,
            Region: this.props.Detail.Data.Region,
        });
    }
    render()
    {
        if(!this.props.show) {
            return null;
        }

        return (

            <div onClick={this.props.onClose}  className="backdrop"  style={{position: 'absolute',
                top: -110,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex:99999,
                height: 'fit-content',
                backgroundColor: 'rgba(0,0,0,0.3)',
                padding: 50}}>
                <div onClick={this.props.onClose} id ="divToPrint" className="modal" style={{ backgroundColor: '#fff',
                    borderRadius: 5,
                    maxWidth: 800,
                    minHeight: 300,
                    margin: '0 auto',
                    padding: 30}}>
                    <div style={{width: '100%'}}>
                        <table style={{width: '100%'}}>
                            <thead>
                            <tr>
                                <th className="text-center" width='20%' align="left">
                                    <Typography color="inherit">
                                        <img src="https://res.cloudinary.com/janiking/image/upload/v1545837406/apps/web/appid2/logo-full.png" alt=""/>
                                    </Typography>
                                </th>
                                <th width='50%' className="text-left">
                                    Remit To:
                                    <Typography>{this.state.Region.Displayname}</Typography>
                                    <Typography>P.O.BOX 415291</Typography>
                                    <Typography>{this.state.Region.Address}</Typography>
                                    <Typography>{this.state.Region.Phone}</Typography>
                                </th>
                                <th>
                                    <table style={{width:'100%',borderCollapse: 'collapse',border:'solid 1px'}}>
                                        <tbody>
                                        <tr >
                                            <td style={{border:'solid 1px'}} colSpan="2">Invoice</td>
                                        </tr>
                                        <tr>
                                            <td style={{border:'solid 1px'}}>
                                                <Typography> <strong>Date</strong> </Typography>
                                                <Typography>{this.state.invoiceDetail.InvoiceDate}</Typography>
                                            </td>
                                            <td style={{border:'solid 1px'}}>
                                                <Typography><strong>Number</strong></Typography>
                                                <Typography>{this.state.invoiceDetail.CompanyNo}</Typography>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{border:'solid 1px'}}>
                                                <Typography><strong>Due Date</strong></Typography>
                                                <Typography>{this.state.invoiceDetail.DueDate}</Typography>
                                            </td>
                                            <td style={{border:'solid 1px'}}>
                                                <Typography><strong>Cust#</strong></Typography>
                                                <Typography>{this.state.invoiceDetail.CustomerNumber}</Typography>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{border:'solid 1px'}}>
                                                <Typography><strong style={{fontSize:'11px'}}>Invoice Amount</strong></Typography>
                                                <Typography>$31,180.55</Typography>
                                            </td>
                                            <td style={{border:'solid 1px'}}>
                                                <Typography><strong style={{fontSize:'11px'}}>Amount Remitted</strong></Typography>
                                                <Typography><br/></Typography>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </th>
                            </tr>
                            </thead>
                        </table>
                        <table style={{width:'85%'}} align="center">
                            <tbody>
                            <tr>
                                <td width='60%' className="text-left">
                                    <Typography><strong>Sold To:</strong></Typography>
                                    <Typography>{this.state.invoiceDetail.CustomerName}</Typography>
                                    <Typography><br/></Typography>
                                    <Typography>ONE BILLS DRIVE</Typography>
                                </td>
                                <td width='40%' className="text-left">
                                    <Typography><strong>For:</strong></Typography>
                                    <Typography>{this.state.invoiceDetail.CustomerName}</Typography>
                                    <Typography>OPERATIONS CENTER</Typography>
                                    <Typography>ONE BILLS DRIVE</Typography>
                                </td>
                            </tr>

                            <tr>
                                <td width='50%' className="text-left">
                                    <Typography><span>{this.state.CustomerSoldTo.AddressLine1}</span><span style={{paddingLeft:50}}>{this.state.CustomerSoldTo.State}</span><span style={{paddingLeft:30}}>{this.state.CustomerSoldTo.ZipCode}</span></Typography>
                                </td>
                                <td width='' className="text-left">
                                    <Typography><span>{this.state.CustomerFor.AddressLine1}</span><span style={{paddingLeft:50}}>{this.state.CustomerFor.State}</span><span style={{paddingLeft:30}}>{this.state.CustomerFor.ZipCode}</span></Typography>
                                </td>
                            </tr>
                            </tbody>

                        </table>
                        <table style={{width:'85%'}} align="center">
                            <tbody>
                            <tr>
                                <td className="text-center" width='100%'>
                                    <Typography><span style={{fontSize:'11px'}}>Make All Chekcs Payable To:JANI-KING OF BUFFALO,INC,</span></Typography>
                                    <Typography><span style={{fontSize:'11px'}}>RETURN THIS PORTION WITH YOUR PAYMENT</span></Typography>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div style ={{ width:'100%',borderBottom:'2px solid rgb(0, 0, 0)'}}></div>
                        <table style={{width:'85%'}} align="center">
                            <tbody>
                            <tr>
                                <td width ="20%"></td>
                                <td width ="60%" className="text-center">
                                    <Typography><strong><span style={{fontSize:'18px'}}>JANI-KING OF BUFFALO,INC</span></strong></Typography>
                                    <Typography><strong><span style={{fontSize:'14px'}}>Commercial Cleaning Services</span></strong></Typography>
                                    <Typography><span>(716)</span> <span>636-4840</span></Typography>
                                    <Typography><br/></Typography>
                                    <Typography><br/></Typography>
                                    <Typography><br/></Typography>

                                </td>
                                <td width ="20%">
                                    <Typography color="inherit">
                                        <img src="https://res.cloudinary.com/janiking/image/upload/v1545837406/apps/web/appid2/logo-full.png" alt=""/>
                                    </Typography>
                                </td>
                            </tr>
                            </tbody>

                        </table>
                        <table style={{width:'85%'}} align="center">
                            <tbody>
                            <tr>
                                <td width='60%' className="text-left">
                                    <Typography><strong>Sold To:</strong></Typography>
                                    <Typography>{this.state.CustomerSoldTo.Name}</Typography>
                                    <Typography><br/></Typography>
                                    <Typography>ONE BILLS DRIVE</Typography>
                                </td>
                                <td width='40%' className="text-left">
                                    <Typography><strong>For:</strong></Typography>
                                    <Typography>{this.state.CustomerFor.Name}</Typography>
                                    <Typography>OPERATIONS CENTER</Typography>
                                    <Typography>ONE BILLS DRIVE</Typography>
                                </td>
                            </tr>

                            <tr>
                                <td width='50%' className="text-left">
                                    <Typography><span>{this.state.CustomerSoldTo.AddressLine1}</span><span style={{paddingLeft:50}}>{this.state.CustomerSoldTo.State}</span><span style={{paddingLeft:30}}>{this.state.CustomerSoldTo.ZipCode}</span></Typography>
                                </td>
                                <td  className="text-left">
                                    <Typography><span>{this.state.CustomerFor.AddressLine1}</span><span style={{paddingLeft:50}}>{this.state.CustomerFor.State}</span><span style={{paddingLeft:30}}>{this.state.CustomerFor.ZipCode}</span></Typography>
                                </td>
                            </tr>
                            </tbody>

                        </table>
                        <table style={{width:'100%',borderCollapse: 'collapse',border:'solid 1px'}}>
                            <thead>
                            <tr>
                                <th width="15%" style={{border:'solid 1px'}} className="text-center">Invoice No</th>
                                <th width="10%" style={{border:'solid 1px'}} className="text-center">Date</th>
                                <th width="10%" style={{border:'solid 1px'}} className="text-center">Cust No</th>
                                <th width="15%" style={{border:'solid 1px'}} className="text-center">Slsmn No</th>
                                <th width="15%" style={{border:'solid 1px'}} className="text-center">PO Number</th>
                                <th width="25%" style={{border:'solid 1px'}} className="text-center">Franchisee</th>
                                <th width="10%" style={{border:'solid 1px'}} className="text-center">Due Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.Items !=null && this.state.Items && this.state.Items.map((item,index)=>{
                                return (
                            <tr key={index}>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center">{item.inv_no}</td>
                                <td width="10%" style={{border:'solid 1px'}} className="text-center">{this.state.invoiceDetail.InvoiceDate}</td>
                                <td width="10%" style={{border:'solid 1px'}} className="text-center">{this.state.invoiceDetail.CustomerNumber}</td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center">{this.state.invoiceDetail.slsmn_no}</td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center">{this.state.invoiceDetail.PONumber}</td>
                                <td width="25%" style={{border:'solid 1px'}} className="text-center">{this.state.invoiceDetail.apply_fran}</td>
                                <td width="10%" style={{border:'solid 1px'}} className="text-center">{this.state.invoiceDetail.DueDate}</td>
                            </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        <table style={{width:'100%',borderCollapse: 'collapse',border:'solid 1px'}}>
                            <tbody>
                            <tr>
                                <td width="10%" style={{border:'solid 1px'}} className="text-center"><strong>Quantity</strong></td>
                                <td width="60%" style={{border:'solid 1px'}} className="text-center"><strong>Description</strong></td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center"><strong>Unit Price</strong></td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center"><strong>Extended Price</strong></td>
                            </tr>
                            {this.state.Items !=null && this.state.Items && this.state.Items.map((item,index)=>{
                                return (
                                    <tr key={index}>
                                        <td width="10%" style={{border:'solid 1px'}} className="text-center">{item.LineNo}</td>
                                        <td width="60%" style={{border:'solid 1px'}} className="text-center">{item.Description}</td>
                                        <td width="15%" style={{border:'solid 1px'}} className="text-center">
                                            {item.UnitPrice}
                                        </td>
                                        <td rowSpan="1" width="15%" style={{border:'solid 1px'}} className="text-center">
                                            {item.ExtendedPrice}
                                        </td>

                                    </tr>
                                )
                            })}

                            <tr>
                                <td style={{borderRight:'solid 1px'}}>
                                    <Typography><br/></Typography> <Typography><br/></Typography> <Typography><br/></Typography> <Typography><br/></Typography> <Typography><br/></Typography>
                                    <Typography><br/></Typography> <Typography><br/></Typography> <Typography><br/></Typography> <Typography><br/></Typography> <Typography><br/></Typography>
                                    <Typography><br/></Typography>
                                    <Typography><br/></Typography>
                                    <Typography><br/></Typography><Typography><br/></Typography>
                                </td>
                                <td><Typography><br/></Typography></td>
                                <td style={{border:'solid 1px'}}><Typography><br/></Typography></td>
                                <td style={{border:'solid 1px'}}><Typography><br/></Typography></td>
                            </tr>

                            <tr>
                                <td width="10%"  style={{borderRight:'solid 1px'}} className="text-center"></td>
                                <td width="60%"  className="text-center">  {this.state.invoiceDetail.InvMsg}</td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center">
                                    <strong>Amount of Sale</strong>
                                </td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center">
                                    {this.state.invoiceDetail.SubTotal}
                                </td>
                            </tr>
                            <tr>
                                <td width="10%"  style={{borderRight:'solid 1px'}} className="text-center"></td>
                                <td width="60%"  className="text-center"></td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center">
                                    <strong>Sales Tax</strong>
                                </td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center">
                                    {this.state.invoiceDetail.TaxTotal}
                                </td>
                            </tr>
                            <tr>
                                <td width="10%"  style={{borderRight:'solid 1px'}} className="text-center"></td>
                                <td width="60%"  className="text-center">
                                    <Typography><strong style={{fontSize:'11px'}}>Make All Checks Payable To:</strong></Typography>
                                    <Typography><strong style={{fontSize:'11px'}}>JANI-KING OF BUFFALO,INC:</strong></Typography>
                                </td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center">
                                    <strong>Total</strong>
                                </td>
                                <td width="15%" style={{border:'solid 1px'}} className="text-center">
                                    {this.state.invoiceDetail.GrandTotal}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}



// The modal "window"
// const modalStyle = {
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     maxWidth: 500,
//     minHeight: 300,
//     margin: '0 auto',
//     padding: 30
// };

InvoiceReport.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node,
    Detail: PropTypes.object,
};

export default InvoiceReport;

