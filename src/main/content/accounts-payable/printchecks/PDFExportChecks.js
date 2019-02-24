import React from 'react';

import { process } from '@progress/kendo-data-query';
import { GridPDFExport, PDFExport, savePDF } from '@progress/kendo-react-pdf';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';

import {Typography,} from '@material-ui/core'
import GridM from '@material-ui/core/Grid'
// for Store
import {withStyles} from "@material-ui/core";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Actions from 'store/actions';

//3rd parties
import moment from 'moment';
import classNames from 'classnames';
import NumberFormat from 'react-number-format';

const styles = theme => ({
    root: {
        fontSize: 11,
        '& .k-grid-header': {
          paddingRight: '0!important',
            '& .k-grid-header-wrap':{
              borderTop:"1px solid #333",
              borderBottom:"1px solid #333",
            }
        },
        '& .small': {
            fontSize: 11,
        },
        '& table': {
          width: '100%',
            '& thead th': {
                textAlign: 'left',
                '& a':{
                    color: 'black!important'
                }
            },
            '& thead th:nth-child(4)': {
                textAlign: 'right'
            },
            '& tbody': {
                '& tr td:nth-child(4)': {
                    textAlign: 'right'
                },
                '& tr:last-child td': {
                    borderBottom:"1px solid #333",
                },
            },
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
const CurrencyFormatterTd = ({value}) => (
    <NumberFormat value={value}
                  displayType={'text'}
                  fixedDecimalScale={true}
                  thousandSeparator
                  decimalScale={2}
                  prefix="$" renderText={value => <td className="sum-01">{value}</td>}/>
);
class ExportChecks extends React.Component {
    pdfExportComponent;
    image;

    onPrint = ()=> {
        this.pdfExportComponent.save();
    };
    componentDidMount()
    {
        // this.props.onRef(this);
    }
    componentWillUnmount() {
        // this.props.onRef(undefined);
    }

    render() {
        const {classes} = this.props;
        // const  log_url = 'https://res.cloudinary.com/janiking/image/upload/v1545837406/apps/web/appid2/logo-full.png';
        const  log_url = 'assets/images/logo-blank.png';

        let selections = this.props.selectionsChecks.map((index)=>this.props.printChecksDB[index]);

        return (
            <div className={classNames("p-24")}>
                <div className="example-config">
                    <button className="k-button" onClick={this.onPrint}>
                        Export PDF
                    </button>
                </div>

                <PDFExport
                    paperSize="A4"
                    margin="1cm"
                    forcePageBreak=".page-break"
                    ref={(component) => this.pdfExportComponent = component}
                    scale={0.75}
                >
                    <div  style={{ width: "700px", margin: '0 auto', maxWidth: 700}} className={classNames(classes.root)}>
                        {selections.map((check, index)=>{
                            let amountSum = 0;
                            let dueSum = 0;
                            check.turnArounddata.forEach(t=>{
                                amountSum+=t.Amount;
                                dueSum+=t.NegativeDueTotal;
                            });
                            return (
                                <div key={index} className={classNames("flex flex-col",{'page-break': index>0})}>
                                    <div className="flex flex-row relative justify-center mt-12">
                                        <div className="absolute checks-date small" style={{left: 0}}>{moment().format('MM/DD/YYYY')}</div>
                                        <Typography variant={"inherit"}>JaniKing | Franchise Management System</Typography>
                                    </div>
                                    <GridM container>
                                        <GridM item sm={3}>
                                            <img style={{border: '1px solid black'}}
                                                src={log_url}
                                            />
                                        </GridM>
                                        <GridM item sm={6}>
                                            <Typography variant={"subtitle1"}><strong>Jani-King of Buffalo, Inc</strong></Typography>
                                        </GridM>
                                        <GridM item sm={3}>
                                            <Typography variant={"inherit"}>Check Number: {check.checknumber}</Typography>
                                            <Typography variant={"inherit"}>Check Date: {moment(check.checkdate).format('MM/DD/YYYY')}</Typography>
                                        </GridM>

                                    </GridM>
                                    <GridM container>
                                        <GridM item sm={3}>
                                        </GridM>
                                        <GridM item sm={3} >
                                            <Typography variant={"inherit"}>Payee: {check.PayeeNumber}</Typography>
                                        </GridM>
                                        <GridM item sm={6}>
                                            <Typography variant={"inherit"}>JACKSON 4 JACKSON, INC., an Authorized Franchisee</Typography>
                                        </GridM>
                                    </GridM>
                                    <br/>
                                    <br/>

                                    <Grid
                                        ref={(grid) => this.grid = grid}
                                        data={check.turnArounddata} style={{width: 700}}
                                    >
                                        <Column field="InvoiceNo" title="InvoiceNo" width="100px" />
                                        <Column field="CustomerNumber" title="Customer No" width="100px" />
                                        <Column field="CustomerName" title="Customer Name" />
                                        <Column field="Amount" title="Invoice Payment Amt." width="240px"
                                                cell={(props) =>CurrencyFormatterTd({value: props.dataItem[props.field]})}/>
                                    </Grid>
                                    <br/>
                                    <br/>
                                    <GridM container>
                                        <GridM item sm={3}>
                                        </GridM>
                                        <GridM item sm={3} >

                                        </GridM>
                                        <GridM item sm={3}>
                                            <Typography style={{textAlign: 'right'}} variant={"inherit"}>Total Invoice Payment:</Typography>
                                            <Typography style={{textAlign: 'right'}} variant={"inherit"}>Total Negative Due</Typography>
                                        </GridM>
                                        <GridM item sm={3}>
                                            <Typography style={{textAlign: 'right'}} variant={"inherit"}>{CurrencyFormatter({value: amountSum})}</Typography>
                                            <Typography style={{textAlign: 'right'}} variant={"inherit"}>{CurrencyFormatter({value: dueSum})}</Typography>
                                        </GridM>
                                    </GridM>

                                </div>
                            )
                        })}
                    </div>
                </PDFExport>
            </div >
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        updateSelections: Actions.updateSelections
    }, dispatch);
}

function mapStateToProps({auth, printChecks})
{
    return {
        printChecksDB: printChecks.printChecksDB,
        selectionsChecks: printChecks.selections,
        regionId: auth.login.defaultRegionId,
        all_regions: auth.login.all_regions,
    }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ExportChecks)));
