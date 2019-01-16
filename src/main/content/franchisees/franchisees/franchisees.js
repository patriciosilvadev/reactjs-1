import React, {Component} from 'react';

// core components
import {
    Hidden,
    Icon,
    IconButton,
    Fab,
    Input,
    Paper,
    Button,
    Typography,
    Toolbar,
    Tooltip,
    CircularProgress, Menu, MenuItem, FormControlLabel
} from '@material-ui/core';

// theme components
import {FuseAnimate} from '@fuse';

//Janiking
import JanikingPagination from './../../../../Commons/JanikingPagination';

import {bindActionCreators} from "redux";
import {withStyles, Checkbox} from "@material-ui/core";
import {withRouter} from 'react-router-dom';

// for store
import connect from "react-redux/es/connect/connect";
import * as Actions from 'store/actions';
import SummaryPanel from './SummaryPanel';
import FilterPanel from './filterPanel';

// third party
import classNames from 'classnames';
import ReactTable from "react-table";
import "react-table/react-table.css";
import _ from 'lodash';

import CreateFranchiseesPage from "./franchiseesForms/createForm"
import FusePageCustomSidebarScroll from "../../../../@fuse/components/FusePageLayouts/FusePageCustomSidebarScroll";

import {withScriptjs, withGoogleMap, GoogleMap, Marker,} from "react-google-maps";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import { compose, withProps, withHandlers, lifecycle } from "recompose";

// function Marker({ text }) {
//     return (
//         <Tooltip title={text} placement="top">
//             <Icon className="text-red">place</Icon>
//         </Tooltip>
//     );
// }

const headerHeight = 80;

const hexToRgb = (hex) =>{
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

const styles = theme => ({
    root: {
        background    : "url('/assets/images/backgrounds/signin-bg.jpg') no-repeat",
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
        '& .ReactTable .rt-noData': {
            top: '250px',
            border: '1px solid coral'
        },
        '& .ReactTable .rt-thead.-headerGroups': {
            paddingLeft: '0!important',
            paddingRight: '0!important',
            minWidth: 'inherit!important'
        },
        '& .ReactTable.-highlight .rt-tbody .rt-tr:not(.-padRow):hover': {
            background: 'rgba(' + hexToRgb(theme.palette.secondary.main).r + ',' + hexToRgb(theme.palette.secondary.main).g + ',' + hexToRgb(theme.palette.secondary.main).b + ', .8)',
            color: 'white!important'
        },
        '& .openFilter':{
            width: 'inherit'
        },
        '& .openSummary':{
            width: 300
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
        '& .p-12-impor': {
            paddingLeft: '1.2rem!important',
            paddingRight: '1.2rem!important',
        }
    },
    card: {
        width   : '100%',
        maxWidth: 384,
    },
    progress: {
        margin: theme.spacing.unit * 2,
    },
    layoutHeader       : {
        height   : headerHeight,
        minHeight: headerHeight,
        backgroundColor: theme.palette.secondary.main
    },
    layoutRightSidebar : {
        width: 0,
        [theme.breakpoints.down('sm')]: {
            width: 'inherit'
        }
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
    addButton          : {
        position: 'absolute',
        bottom  : -28,
        left    : 16,
        zIndex  : 999,
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    removeButton          : {
        position: 'absolute',
        bottom  : -28,
        right    : 16,
        zIndex  : 999,
        backgroundColor: theme.palette.secondary.light,
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
        }
    },
    imageIcon:{
        width: 24,
        height: 24
    },
    separator: {
        width          : 1,
        height         : '100%',
        backgroundColor: theme.palette.divider
    },
    search: {
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    tableTheadRow:{
        backgroundColor: theme.palette.primary.main
    },
    tableThEven:{
        backgroundColor: 'rgba(' + hexToRgb(theme.palette.secondary.main).r + ',' + hexToRgb(theme.palette.secondary.main).g + ',' + hexToRgb(theme.palette.secondary.main).b +', .3)'
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
    sideButton          : {
        backgroundColor: theme.palette.primary.light,
        height: 46,
        width: 46,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    elementCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '2rem'
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
    }
});

const DEFAULT_ZOOM = 8
let map_zoom = DEFAULT_ZOOM

const MapWithAMarkerClusterer = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyChEVMf9jz-1iVYHVPQOS8sP2RSsKOsyeA&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withHandlers({
        onMarkerClustererClick: () => (markerClusterer) => {
            const clickedMarkers = markerClusterer.getMarkers()
            console.log(`Current clicked markers length: ${clickedMarkers.length}`)
            console.log(clickedMarkers)
        },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={map_zoom}
        defaultCenter={{ lat: props.center.lat, lng: props.center.lng }}
    >
        <MarkerClusterer
            onClick={props.onMarkerClustererClick}
            averageCenter
            enableRetinaIcons
            gridSize={60}
        >
            {props.markers.map((x, index) => (
                <Marker
                    key={index}
                    position={{ lat: x.lat, lng: x.lng }}
                />
            ))}
        </MarkerClusterer>
    </GoogleMap>
);


const MapWithAMarkerClusterer2 = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyChEVMf9jz-1iVYHVPQOS8sP2RSsKOsyeA&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `100%` }} />,
        mapElement: <div style={{ height: `100%` }} />,
    }),
    withHandlers({
        onMarkerClustererClick: () => (markerClusterer) => {
            const clickedMarkers = markerClusterer.getMarkers()
            console.log(`Current clicked markers length: ${clickedMarkers.length}`)
            console.log(clickedMarkers)
        },
    }),
    withScriptjs,
    withGoogleMap
)(props =>
    <GoogleMap
        defaultZoom={map_zoom}
        defaultCenter={{ lat: props.center.lat, lng: props.center.lng }}
    >
        <MarkerClusterer
            onClick={props.onMarkerClustererClick}
            averageCenter
            enableRetinaIcons
            gridSize={60}
        >
            {props.markers.map((x, index) => (
                <Marker
                    key={index}
                    position={{ lat: x.lat, lng: x.lng }}
                />
            ))}
        </MarkerClusterer>
    </GoogleMap>
);

class Franchisees extends Component {
    state = {
        s: '',
        temp: [],
        data: [],
        checkedSelectAll: true,
        checkedActive: true,
        checkedInactive: true,
        checkedCTDB: true,
        checkedPendingTransfer: true,
        checkedLegalCompliancePending: true,
        checkedTransfer: true,
        checkedTerminated: true,
        checkedRejected: true,
        checkedPending: true,
        checkedNonRenewed: true,
        checkedRepurchased: true,
        selection: [],
        selectAll: false,
        regionId: 0,
        statusId: 9,
        current_lat: 0,
        current_long: 0,
        pins: [],
        pins2: [],
        gmapVisible: false,
    };

    toggleSelection = (key, shift, row) => {
        let selection = [...this.state.selection];
        const keyIndex = selection.indexOf(key);
        if (keyIndex >= 0) {
            selection = [
                ...selection.slice(0, keyIndex),
                ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(key);
        }
        this.setState({ selection });
    };

    toggleAll = (instance) => {
        const selectAll = this.state.selectAll ? false : true;
        const selection = [];
        if (selectAll) {
            let currentRecords = instance.data;
            let page = this.state.page;
            let pageSize = this.state.pageSize;
            let start_index = page * pageSize;
            let end_index = start_index+pageSize;
            currentRecords.forEach(item => {
                if(item._index>=start_index && item._index<end_index)
                    selection.push(item._original.ID);
            });
        }
        this.setState({ selectAll, selection });
    };

    isSelected = key => {
        return this.state.selection.includes(key);
    };

    constructor(props){
        super(props);

        if(!props.bLoadedFranchisees) {
            props.getFranchisees(this.props.regionId, this.props.statusId, this.props.Location, this.props.Latitude, this.props.Longitude, this.props.SearchText);
        }
        this.fetchData = this.fetchData.bind(this);
        this.escFunction = this.escFunction.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        let bChanged = false;
        if(this.props.transactionStatusFranchisees.checkedSelectAll !== prevProps.transactionStatusFranchisees.checkedSelectAll) {
            this.setState({checkedSelectAll: !this.state.checkedSelectAll});
            bChanged = true;
        }

        if(this.props.transactionStatusFranchisees.checkedActive !== prevProps.transactionStatusFranchisees.checkedActive) {
            this.setState({checkedActive: !this.state.checkedActive});
            bChanged = true;
        }

        if(this.props.transactionStatusFranchisees.checkedInactive !== prevProps.transactionStatusFranchisees.checkedInactive) {
            this.setState({checkedInactive: !this.state.checkedInactive});
            bChanged = true;
        }

        if(this.props.transactionStatusFranchisees.checkedCTDB !== prevProps.transactionStatusFranchisees.checkedCTDB) {
            this.setState({checkedCTDB: !this.state.checkedCTDB});
            bChanged = true;
        }
        if(this.props.transactionStatusFranchisees.checkedPendingTransfer !== prevProps.transactionStatusFranchisees.checkedPendingTransfer) {
            this.setState({checkedPendingTransfer: !this.state.checkedPendingTransfer});
            bChanged = true;
        }
        if(this.props.transactionStatusFranchisees.checkedLegalCompliancePending !== prevProps.transactionStatusFranchisees.checkedLegalCompliancePending) {
            this.setState({checkedLegalCompliancePending: !this.state.checkedLegalCompliancePending});
            bChanged = true;
        }
        if(this.props.transactionStatusFranchisees.checkedTransfer !== prevProps.transactionStatusFranchisees.checkedTransfer) {
            this.setState({checkedTransfer: !this.state.checkedTransfer});
            bChanged = true;
        }
        if(this.props.transactionStatusFranchisees.checkedTerminated !== prevProps.transactionStatusFranchisees.checkedTerminated) {
            this.setState({checkedTerminated: !this.state.checkedTerminated});
            bChanged = true;
        }
        if(this.props.transactionStatusFranchisees.checkedRejected !== prevProps.transactionStatusFranchisees.checkedRejected) {
            this.setState({checkedRejected: !this.state.checkedRejected});
            bChanged = true;
        }
        if(this.props.transactionStatusFranchisees.checkedPending !== prevProps.transactionStatusFranchisees.checkedPending) {
            this.setState({checkedPending: !this.state.checkedPending});
            bChanged = true;
        }
        if(this.props.transactionStatusFranchisees.checkedNonRenewed !== prevProps.transactionStatusFranchisees.checkedNonRenewed) {
            this.setState({checkedNonRenewed: !this.state.checkedNonRenewed});
            bChanged = true;
        }
        if(this.props.transactionStatusFranchisees.checkedRepurchased !== prevProps.transactionStatusFranchisees.checkedRepurchased) {
            this.setState({checkedRepurchased: !this.state.checkedRepurchased});
            bChanged = true;
        }

        if(this.props.regionId !== prevProps.regionId) {
            this.setState({regionId: prevProps.regionId});
            this.props.getFranchisees(this.props.regionId, this.props.statusId, this.props.Location, this.props.Latitude, this.props.Longitude, this.props.SearchText);
            bChanged = true;
        }

        if(this.props.Location !== prevProps.Location){
            this.props.getFranchisees(this.props.regionId, this.props.statusId, this.props.Location, this.props.Latitude, this.props.Longitude, this.props.SearchText);
            bChanged = true;
        }

        if(bChanged)
            this.getFranchiseesFromStatus();

        if(prevProps.franchisees===null && this.props.franchisees!==null){
            this.getFranchiseesFromStatus();
        }

        if(prevState.s!==this.state.s) {
            this.search(this.state.s);
        }
    }

    componentWillMount(){
        this.setState({checkedSelectAll: this.props.transactionStatusFranchisees.checkedSelectAll});
        this.setState({checkedActive: this.props.transactionStatusFranchisees.checkedActive});
        this.setState({checkedInactive: this.props.transactionStatusFranchisees.checkedInactive});
        this.setState({checkedCTDB: this.props.transactionStatusFranchisees.checkedCTDB});
        this.setState({checkedPendingTransfer: this.props.transactionStatusFranchisees.checkedPendingTransfer});
        this.setState({checkedLegalCompliancePending: this.props.transactionStatusFranchisees.checkedLegalCompliancePending});
        this.setState({checkedTransfer: this.props.transactionStatusFranchisees.checkedTransfer});
        this.setState({checkedTerminated: this.props.transactionStatusFranchisees.checkedTerminated});
        this.setState({checkedRejected: this.props.transactionStatusFranchisees.checkedRejected});
        this.setState({checkedPending: this.props.transactionStatusFranchisees.checkedPending});
        this.setState({checkedNonRenewed: this.props.transactionStatusFranchisees.checkedNonRenewed});
        this.setState({checkedRepurchased: this.props.transactionStatusFranchisees.checkedRepurchased});

        this.getFranchiseesFromStatus();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.franchisees===null && nextProps.franchisees!==null)
            this.getFranchiseesFromStatus(nextProps.franchisees);
        if(this.props.franchisees!==nextProps.franchisees)
            this.getFranchiseesFromStatus(nextProps.franchisees);
        if (nextProps.franchisees !== this.props.franchisees) {
            this.initRowsFromRawJson(nextProps.franchisees);
        }
        if (this.props.locationFilterValue !== nextProps.locationFilterValue) {
            this.setState({ locationFilterValue: nextProps.locationFilterValue })
            console.log("componentWillReceiveProps", "locationFilterValue", nextProps.locationFilterValue, this.props.franchisees)
            this.initRowsFromRawJson(this.props.franchisees, nextProps.locationFilterValue);
        }
    }


    getFranchiseesFromStatus =(rawData=this.props.franchisees) =>{
        let data = [];
        let tempData = [];
        if(rawData ===null) return;

        if(rawData.Data.Region.length===0){
            data = [];
            this.setState({temp: data});
            this.setState({data: data});
            return;
        }else{
            for(let i= 0 ; i < rawData.Data.Region.length ; i++){
                tempData = rawData.Data.Region[i].FranchiseeList;
                data = data.concat(tempData);
            }
        }
        this.setState({temp: data});
        this.setState({data: data});
    };

    componentDidMount(){
        document.addEventListener("keydown", this.escFunction, false);
        this.getLocation();
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.escFunction, false);

        this.initRowsFromRawJson();

        this.getLocation();
    }

    escFunction(event){
        if(event.keyCode === 27) {
            this.setState({s: ''});
            this.getFranchiseesFromStatus();
        }
    }
    search(val) {
        if(val===''){
            this.getFranchiseesFromStatus();
            return;
        }
        const temp = this.state.data.filter( d => {
            return d.Number.toLowerCase().indexOf(val) !== -1 || !val ||
                d.StatusName.toLowerCase().indexOf(val) !== -1 ||
                d.Name.toLowerCase().indexOf(val) !== -1 ||
                d.Address.toLowerCase().indexOf(val) !== -1 ||
                d.Phone.toLowerCase().indexOf(val) !== -1
        });
        this.setState({temp: temp});
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value });

        if(prop==='s') {
            this.search(event.target.value.toLowerCase());
        }
    };

    removeFranchisees = ()=> {
        if(this.state.selection.length===0){
            alert("Please choose franchisee(s) to delete");
            return;
        }
        if (window.confirm("Do you really want to remove the selected franchisee(s)")) {
            this.props.deleteFranchisees(this.state.selection, this.props.franchisees);
            this.setState({selection: [], selectAll: false})
        }
    };

    fetchData(state, instance) {
        this.setState({
            pageSize: state.pageSize,
            page: state.page,
        });
    }
    showValidationMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    }
    closeValidationMenu = () => {
        this.setState({ anchorEl: null });
    }

    canBeSubmitted()
    {
        return true;
    }
    closeComposeForm = () => {
        this.props.createFranchisees.type === 'create' ? this.props.closeEditFranchisees() : this.props.closeCreateFranchisees();
    };
    getLocation() {
        console.log("getLocation");

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log(position.coords);
                    this.setState({
                        current_lat: position.coords.latitude,
                        current_long: position.coords.longitude
                    })

                    if (this.state.addrLat == undefined) {
                        this.setState({
                            addrLat: position.coords.latitude,
                            addrLng: position.coords.longitude
                        })
                    }
                    if (this.props.locationFilterValue) {
                        this.initRowsFromRawJson();
                    }
                }
            );
        }
    }

    initRowsFromRawJson = (rawData = this.props.franchisees, locationFilterValue = this.props.locationFilterValue) => {
        console.log("initRowsFromRawJson", "CustomerListContent.js", this.props.regionId, this.props.statusId, rawData)
        let all_temp = [];
        if (rawData === null || rawData === undefined) return;

        let regions = rawData.Data.Region.filter(x => {
            return this.props.regionId === 0 || x.Id === this.props.regionId;
        });


        console.log("regions", regions)

        regions.forEach(x => {
            all_temp = [...all_temp, ...x.FranchiseeList];
        });

        let _pins_temp = [];
        regions.forEach(x => {
            _pins_temp = [..._pins_temp, ...x.FranchiseeList.map(franchisee => {
                return {
                    lat: parseFloat(0+franchisee.Latitude),
                    lng: parseFloat(0+franchisee.Longitude),
                    text: franchisee.Name
                }
            })];

        })

        this.filterPins(_pins_temp, locationFilterValue)

        this.setState({
            rows: all_temp,
            data: all_temp,
            // pins: _pins_temp,
        });

    };

    filterPins(pins, locationFilterValue) {
        // this.setState({ gmapVisible: !this.state.gmapVisible });
        console.log("-------filterPins---------", pins)
        let k = (12.5 - 9.5) * 75 / (75 / 5 - 1)
        let b = 12.5 - k / 5

        switch (locationFilterValue.id) {
            case "locationAll":
                if (!this.state.gmapVisible) {
                    this.setState({
                        gmapVisible: !this.state.gmapVisible,
                        pins: pins === undefined ? [] : [...pins],
                        pins2: []
                    })
                } else {
                    this.setState({
                        gmapVisible: !this.state.gmapVisible,
                        pins: [],
                        pins2: pins === undefined ? [] : [...pins]
                    })
                }
                map_zoom = DEFAULT_ZOOM
                break;
            case "locationNearBy":
                let _pins = []
                this.setState({
                    addrLat: this.state.current_lat,
                    addrLng: this.state.current_long
                })

                _pins = this.nearbyLocations(
                    pins,
                    {
                        lat: this.state.current_lat,
                        lng: this.state.current_long
                    },
                    locationFilterValue.miles)

                if (!this.state.gmapVisible) {
                    this.setState({
                        gmapVisible: !this.state.gmapVisible,
                        pins: [..._pins],
                        pins2: []
                    })
                } else {
                    this.setState({
                        gmapVisible: !this.state.gmapVisible,
                        pins: [],
                        pins2: [..._pins]
                    })
                }

                map_zoom = locationFilterValue.miles !== undefined ? k / locationFilterValue.miles + b : DEFAULT_ZOOM
                break;
            case "locationNearSpecificAddress":

                let _ = []
                if (locationFilterValue.addrZipcode !== undefined) {
                    this.setState({
                        addrLat: locationFilterValue.addrZipcode.lat,
                        addrLng: locationFilterValue.addrZipcode.lng
                    })
                    _ = this.nearbyLocations(
                        pins,
                        {
                            lat: locationFilterValue.addrZipcode.lat,
                            lng: locationFilterValue.addrZipcode.lng
                        },
                        locationFilterValue.miles)
                } else {
                    this.setState({
                        addrLat: this.state.current_lat,
                        addrLng: this.state.current_long
                    })
                    _ = this.nearbyLocations(
                        pins,
                        {
                            lat: this.state.current_lat,
                            lng: this.state.current_long
                        },
                        locationFilterValue.miles)
                }

                if (!this.state.gmapVisible) {
                    this.setState({
                        gmapVisible: !this.state.gmapVisible,
                        pins: [..._],
                        pins2: []
                    })
                } else {
                    this.setState({
                        gmapVisible: !this.state.gmapVisible,
                        pins: [],
                        pins2: [..._]
                    })
                }
                map_zoom = locationFilterValue.miles !== undefined ? k / locationFilterValue.miles + b : DEFAULT_ZOOM
                break;
            default:
                this.setState({ pins: pins })
                break;
        }

    }

    Deg2Rad(deg) {
        return deg * Math.PI / 180;
    }

    PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
        lat1 = this.Deg2Rad(lat1);
        lat2 = this.Deg2Rad(lat2);
        lon1 = this.Deg2Rad(lon1);
        lon2 = this.Deg2Rad(lon2);
        var R = 6371; // km
        var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
        var y = (lat2 - lat1);
        var d = Math.sqrt(x * x + y * y) * R;
        return d;
    }


    nearbyLocations(pins, center, miles = 5, addrZipcode = "") {

        return [...pins.filter(x => {
            return (this.PythagorasEquirectangular(center.lat, center.lng, x.lat, x.lng) <= miles)
        })];
    }

    render()
    {
        const { classes,toggleFilterPanelFranchisees,showCreteFranchisees, toggleSummaryPanelFranchisees, createFranchisees, filterStateFranchisees, summaryStateFranchisees, toggleFranchiseeMapView, mapViewState} = this.props;
        const { toggleSelection, toggleAll, isSelected} = this;
        const { selection, anchorEl,pins, pins2,gmapVisible } = this.state;
        return (
            <React.Fragment >
              <FusePageCustomSidebarScroll
                classes={{
                    root: classNames(classes.layoutRoot,'test123'),
                    rightSidebar : classNames(classes.layoutRightSidebar, {'openSummary': summaryStateFranchisees}),
                    leftSidebar : classNames(classes.layoutLeftSidebar, {'openFilter': filterStateFranchisees}),
                    sidebarHeader: classes.layoutSidebarHeader,
                    header: classes.layoutHeader,
                    content: classes.content
                }}
                header={
                    <div className="flex row flex-1  p-8 sm:p-12 relative justify-between">
                        {this.state.temp  && (!createFranchisees.props.open) && (
                            <div className="flex row flex-1  p-8 sm:p-12 relative justify-between">
                                <div className="flex flex-row flex-1 justify-between">
                                    <div className="flex flex-shrink items-center">
                                        <div className="flex items-center">
                                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                                <Icon className="text-32 mr-12">account_box</Icon>
                                            </FuseAnimate>
                                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                                <Typography variant="h6" className="hidden sm:flex">Franchisees | Franchisees Accounts</Typography>
                                            </FuseAnimate>
                                        </div>
                                    </div>
                                    <div className="flex flex-shrink items-center">
                                        { selection.length>0 && (
                                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                                <Fab color="secondary" aria-label="delete" className={classNames(classes.sideButton, "mr-12")} onClick={()=>this.removeFranchisees()}>
                                                    <Icon>delete</Icon>
                                                </Fab>
                                            </FuseAnimate>
                                        )}
                                        <FuseAnimate animation="transition.expandIn" delay={300}>
                                            <Fab
                                                color="secondary"
                                                aria-label="add"
                                                className={classNames(classes.sideButton, "mr-12")}
                                                onClick={showCreteFranchisees}>
                                                <Icon>add</Icon>
                                            </Fab>
                                        </FuseAnimate>
                                        <FuseAnimate animation="transition.expandIn" delay={300}>
                                            <Fab color="secondary" aria-label="add"
                                                 className={classNames(classes.sideButton, "mr-12")} onClick={() => this.props.history.push('/apps/mail/inbox')}>
                                                <Icon>mail_outline</Icon>
                                            </Fab>
                                        </FuseAnimate>
                                        <FuseAnimate animation="transition.expandIn" delay={300}>
                                            <Fab color="secondary" aria-label="add" className={classes.sideButton} onClick={() => alert('ok')}>
                                                <Icon>print</Icon>
                                            </Fab>
                                        </FuseAnimate>
                                    </div>
                                </div>
                            </div>
                        )}
                        {this.state.temp  && (createFranchisees.props.open) && (
                            <div className="flex row flex-1  p-8 sm:p-12 relative justify-between">
                                <div className="flex flex-row flex-1 justify-between">
                                    <div className="flex flex-shrink items-center">
                                        <div className="flex items-center">
                                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                                <Toolbar className="pl-12 pr-0">
                                                    <img className="mr-12" alt="icon-white" src="assets/images/invoices/invoice-icon-white.png" style={{width: 32, height: 32}}/>
                                                </Toolbar>
                                            </FuseAnimate>
                                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                                <Typography variant="h6" className="hidden sm:flex">Franchisees | New Franchisees</Typography>
                                            </FuseAnimate>
                                        </div>
                                    </div>
                                    <div className="flex flex-shrink items-center">
                                        <IconButton className={classes.button} aria-label="Add an alarm" onClick={(ev) => toggleFilterPanelFranchisees()}>
                                            <Icon>person_outline</Icon>
                                        </IconButton>

                                        <IconButton
                                            // className={classNames(classes.button, classes.validationMenu)}
                                            className={classNames(classes.button, classes.invalidationMenu)}
                                            aria-label="Add an alarm"
                                            aria-owns={anchorEl ? 'validation-menu' : undefined}
                                            aria-haspopup="true"
                                            onClick={this.showValidationMenu}
                                        >
                                            <Icon color="error">error</Icon>
                                        </IconButton>
                                        <Menu
                                            id="validation-menu"
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={this.closeValidationMenu}
                                        >
                                            <MenuItem><FormControlLabel control={<Checkbox checked={true} classes={{ root: classes.validationMenu, checked: classes.validationMenuChecked }} />} label="Company Information" /></MenuItem>
                                            <MenuItem><FormControlLabel control={<Checkbox checked={false} classes={{ root: classes.validationMenu, checked: classes.validationMenuChecked }} />} label="Billing Address" /></MenuItem>
                                            <MenuItem><FormControlLabel control={<Checkbox checked={false} classes={{ root: classes.validationMenu, checked: classes.validationMenuChecked }} />} label="Billing Settings" /></MenuItem>
                                            <MenuItem><FormControlLabel control={<Checkbox checked={false} classes={{ root: classes.validationMenu, checked: classes.validationMenuChecked }} />} label="Company Contacts" /></MenuItem>
                                            <MenuItem><FormControlLabel control={<Checkbox checked={true} classes={{ root: classes.validationMenu, checked: classes.validationMenuChecked }} />} label="Contract Details" /></MenuItem>
                                            <MenuItem><FormControlLabel control={<Checkbox checked={false} classes={{ root: classes.validationMenu, checked: classes.validationMenuChecked }} />} label="Contract Signed" /></MenuItem>
                                            <MenuItem><FormControlLabel control={<Checkbox checked={true} classes={{ root: classes.validationMenu, checked: classes.validationMenuChecked }} />} label="Service Location Info" /></MenuItem>
                                            <MenuItem><FormControlLabel control={<Checkbox checked={true} classes={{ root: classes.validationMenu, checked: classes.validationMenuChecked }} />} label="Verified &amp; Approved" /></MenuItem>
                                        </Menu>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                }
                content={
                    <div className="flex-1 flex-col absolute w-full h-full">
                        {this.state.temp  && (!createFranchisees.props.open) && mapViewState && (
                            <div className={classNames(classes.franchiseeListContent, "flex flex-col h-full")}>
                                <div className="flex flex-row items-center p-12">
                                    <div className="flex items-center justify-start">
                                        <Hidden smDown>
                                            <Button
                                                onClick={(ev) => toggleFilterPanelFranchisees()}
                                                aria-label="toggle filter panel"
                                                color="secondary"
                                                className={classNames(classes.filterPanelButton)}
                                            >
                                                <img className={classes.imageIcon} alt="icon-filter" src="assets/images/invoices/filter.png"/>
                                            </Button>
                                        </Hidden>
                                        <Hidden smUp>
                                            <Button
                                                onClick={(ev) => this.pageLayout.toggleLeftSidebar()}
                                                aria-label="toggle filter panel"
                                                className={classNames(classes.filterPanelButton)}
                                            >
                                                <img className={classes.imageIcon} alt="icon-filter" src="assets/images/invoices/filter.png"/>
                                            </Button>
                                        </Hidden>
                                    </div>
                                    <div className="flex items-center w-full h-44 mr-12 ml-12">
                                        <Paper className={"flex items-center h-44 w-full xs:mr-0"}>
                                            <Input
                                                placeholder="Search..."
                                                className={classNames(classes.search, 'pl-16')}
                                                disableUnderline
                                                fullWidth
                                                value={this.state.s}
                                                onChange={this.handleChange('s')}
                                                inputProps={{
                                                    'aria-label': 'Search'
                                                }}
                                            />
                                            <Icon color="action" className="flex justify-center mr-12">search</Icon>
                                        </Paper>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <IconButton
                                            className={classNames(classes.summaryPanelButton, "mr-12")}
                                            aria-label="Add an alarm"
                                            onClick={(ev) => toggleFranchiseeMapView()}>
                                            <Icon>{mapViewState ? 'list' : 'location_on'}</Icon>
                                        </IconButton>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <Hidden smDown>
                                            <Button
                                                onClick={(ev) => toggleSummaryPanelFranchisees()}
                                                aria-label="toggle summary panel"
                                                className={classNames(classes.summaryPanelButton)}
                                            >
                                                <Icon>insert_chart</Icon>
                                            </Button>
                                        </Hidden>
                                        <Hidden smUp>
                                            <Button
                                                onClick={(ev) => this.pageLayout.toggleRightSidebar()}
                                                aria-label="toggle summary panel"
                                                className={classNames(classes.summaryPanelButton)}
                                            >
                                                <Icon>insert_chart</Icon>
                                            </Button>
                                        </Hidden>
                                    </div>
                                </div>
                                <div className="w-full h-full">
                                    <div className="w-full h-full">
                                        {gmapVisible && (<MapWithAMarkerClusterer
                                            markers={pins}
                                            center={{ lat: this.state.addrLat, lng: this.state.addrLng }}
                                        />)}

                                        {!gmapVisible && (<MapWithAMarkerClusterer2
                                            markers={pins2}
                                            center={{ lat: this.state.addrLat, lng: this.state.addrLng }}
                                        />)}
                                    </div>
                                </div>
                            </div>
                        )}
                        {this.state.temp  && (!createFranchisees.props.open) && !mapViewState && (
                            <div className={classNames(classes.franchiseeListContent, "flex flex-col h-full")}>
                               <div className="flex flex-row items-center p-12">
                                    <div className="flex items-center justify-start">
                                        <Hidden smDown>
                                            <Button
                                                onClick={(ev) => toggleFilterPanelFranchisees()}
                                                aria-label="toggle filter panel"
                                                color="secondary"
                                                className={classNames(classes.filterPanelButton)}
                                            >
                                                <img className={classes.imageIcon} alt="icon-filter" src="assets/images/invoices/filter.png"/>
                                            </Button>
                                        </Hidden>
                                        <Hidden smUp>
                                            <Button
                                                onClick={(ev) => this.pageLayout.toggleLeftSidebar()}
                                                aria-label="toggle filter panel"
                                                className={classNames(classes.filterPanelButton)}
                                            >
                                                <img className={classes.imageIcon} alt="icon-filter" src="assets/images/invoices/filter.png"/>
                                            </Button>
                                        </Hidden>
                                    </div>
                                    <div className="flex items-center w-full h-44 mr-12 ml-12">
                                        <Paper className={"flex items-center h-44 w-full xs:mr-0"}>
                                            <Input
                                                placeholder="Search..."
                                                className={classNames(classes.search, 'pl-16')}
                                                disableUnderline
                                                fullWidth
                                                value={this.state.s}
                                                onChange={this.handleChange('s')}
                                                inputProps={{
                                                    'aria-label': 'Search'
                                                }}
                                            />
                                            <Icon color="action" className="flex justify-center mr-12">search</Icon>
                                        </Paper>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <IconButton
                                            className={classNames(classes.summaryPanelButton, "mr-12")}
                                            aria-label="Add an alarm"
                                            onClick={(ev) => toggleFranchiseeMapView()}>
                                            <Icon>{mapViewState ? 'list' : 'location_on'}</Icon>
                                        </IconButton>
                                    </div>
                                    <div className="flex items-center justify-end">
                                        <Hidden smDown>
                                            <Button
                                                onClick={(ev) => toggleSummaryPanelFranchisees()}
                                                aria-label="toggle summary panel"
                                                className={classNames(classes.summaryPanelButton)}
                                            >
                                                <Icon>insert_chart</Icon>
                                            </Button>
                                        </Hidden>
                                        <Hidden smUp>
                                            <Button
                                                onClick={(ev) => this.pageLayout.toggleRightSidebar()}
                                                aria-label="toggle summary panel"
                                                className={classNames(classes.summaryPanelButton)}
                                            >
                                                <Icon>insert_chart</Icon>
                                            </Button>
                                        </Hidden>
                                    </div>
                               </div>
                               <ReactTable
                                    data={this.state.temp}
                                    minRows = {0}
                                    onFetchData={this.fetchData}
                                    PaginationComponent={JanikingPagination}
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
                                                    alert('ok');
                                                    // openEditContactDialog(rowInfo.original);
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
                                                            // indeterminate={selectedContactIds.length !== Object.keys(contacts).length && selectedContactIds.length > 0}
                                                        />
                                                    ),
                                                    accessor : "",
                                                    Cell     : row => {
                                                        return (<Checkbox
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                }}
                                                                checked={isSelected(row.value.ID)}
                                                                onChange={() => toggleSelection(row.value.ID)}
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
                                                    Header: "NUMBER",
                                                    accessor: "Number",
                                                    filterAll: true,
                                                    width: 200,
                                                    className: classNames("flex items-center  justify-center")
                                                },
                                                {
                                                    Header: "FRANCHISEES NAME",
                                                    accessor: "Name",
                                                    width: 350,
                                                    className: classNames("flex items-center  justify-start p-12-impor")
                                                },
                                                {
                                                    Header: "FULL ADDRESS",
                                                    accessor: "Address",
                                                    className: classNames("flex items-center  justify-start p-12-impor"),
                                                    width: 420
                                                },
                                                {
                                                    Header: "PHONE",
                                                    accessor: "Phone",
                                                    width: 200,
                                                    className: classNames("flex items-center  justify-center p-12-impor")
                                                },
                                                {
                                                    Header: "STATUS",
                                                    accessor: "StatusName",
                                                    className: classNames("flex items-center  justify-center p-12-impor"),
                                                    width: 150
                                                },
                                                {
                                                    Header: "Actions",
                                                    width : 150,
                                                    className: classNames("flex items-center  justify-center p-12-impor"),
                                                    Cell  : row => (
                                                        <div className="flex items-center actions ">
                                                            <IconButton
                                                                onClick={(ev) => {
                                                                    ev.stopPropagation();
                                                                    if (window.confirm("Do you really want to remove this franchisee")) {
                                                                        this.props.removeFranchisees(row.original.ID, this.props.franchisees);
                                                                        if(this.state.selection.length>0){
                                                                            _.remove(this.state.selection, function(id) {
                                                                                return id === row.original.ID;
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
                                                                    // removeContact(row.original.id);
                                                                }}
                                                            >
                                                                <Icon>edit</Icon>
                                                            </IconButton>
                                                        </div>
                                                    )
                                                }
                                            ]
                                        }
                                    ]}
                                    defaultPageSize={100}
                                    className={classNames( "-striped -highlight")}
                                    totalRecords = {this.state.temp.length}
                                    style={{
                                        height: '100%',
                                    }}
                                />
                            </div>

                        )}
                        {(this.state.temp && createFranchisees.props.open) && (
                            <CreateFranchiseesPage/>
                        )}
                    </div>
                }
                leftSidebarHeader={
                    <div className={classNames("flex flex-row w-full h-full justify-between p-12 align-middle pr-0", {'filteropen': filterStateFranchisees})}>
                        {createFranchisees.props.open ? (
                            <h4 className={classes.elementCenter}>Company Information</h4>
                        ) : (
                            <h4 className={classes.elementCenter}>Filter Panel</h4>
                        )}
                    </div>
                }
                leftSidebarContent={
                    <FilterPanel/>
                }
                rightSidebarHeader={
                    <div className="flex flex-row w-full h-full justify-between p-24 align-middle pr-0">
                        <h4 className={classes.elementCenter}>Summary Panel</h4>
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
                {(this.props.bFranchiseesFetchStart) && (
                    <div className={classes.overlay}>
                        <CircularProgress className={classes.progress} color="secondary" />
                    </div>
                )}
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        getFranchisees: Actions.getFranchisees,
        toggleFilterPanelFranchisees: Actions.toggleFilterPanelFranchisees,
        toggleSummaryPanelFranchisees: Actions.toggleSummaryPanelFranchisees,
        deleteFranchisees: Actions.deleteFranchisees,
        removeFranchisees: Actions.removeFranchisees,
        showCreteFranchisees: Actions.showCreteFranchisees,
        closeCreateFranchisees: Actions.closeCreateFranchisees,
        showEditFranchisees: Actions.showCreteFranchisees,
        closeEditFranchisees: Actions.showCreteFranchisees,
        toggleFranchiseeMapView: Actions.toggleFranchiseeMapView
    }, dispatch);
}

function mapStateToProps({franchisees,auth})
{
    return {
        franchisees: franchisees.franchiseesDB,
        bLoadedFranchisees: franchisees.bLoadedFranchisees,
        transactionStatusFranchisees: franchisees.transactionStatusFranchisees,
        filterStateFranchisees: franchisees.bOpenedFilterPanelFranchisees,
        summaryStateFranchisees: franchisees.bOpenedSummaryPanelFranchisees,
        regionId: auth.login.defaultRegionId,
        createFranchisees: franchisees.createFranchisees,
        statusId: franchisees.statusId,
        Longitude: franchisees.Longitude,
        Latitude: franchisees.Latitude,
        Location: franchisees.Location,
        SearchText: franchisees.SearchText,
        mapViewState: franchisees.bOpenedMapView,
        bFranchiseesFetchStart: franchisees.bFranchiseesFetchStart,
        locationFilterValue: franchisees.locationFilterValue
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(Franchisees)));

