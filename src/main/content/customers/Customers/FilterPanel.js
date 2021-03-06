import React, { Component, Fragment } from 'react';
import _ from "lodash";
import { withRouter } from 'react-router-dom';
import Geocode from "react-geocode";

import { withStyles, TextField, Divider, Select } from '@material-ui/core';

import keycode from 'keycode';

//Material UI core
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';

//Store
import * as Actions from 'store/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//Third Party
import classNames from 'classnames';

import GridContainer from "Commons/Grid/GridContainer";
import GridItem from "Commons/Grid/GridItem";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import FuseUtils from '@fuse/FuseUtils';

import PropTypes from 'prop-types';
import MaskedInput from 'react-text-mask';
import { InputLabel, FormControl, InputAdornment } from '@material-ui/core';

Geocode.setApiKey("AIzaSyChEVMf9jz-1iVYHVPQOS8sP2RSsKOsyeA");

const styles = theme => ({
	root: {

	},
	panel: {
		position: 'absolute',
		width: 300,
		backgroundColor: theme.palette.background.paper,
		boxShadow: theme.shadows[3],
		top: 0,
		height: '100%',
		minHeight: '100%',
		bottom: 0,
		left: -300,
		margin: 0,
		zIndex: 1000,
		transform: 'translate3d(50px,0,0)',
		overflow: 'hidden',
		[theme.breakpoints.down('md')]: {
			transform: 'translate3d(360px,0,0)',
			boxShadow: 'none',
			'&.opened': {
				boxShadow: theme.shadows[5]
			}
		},
		transition: theme.transitions.create(['transform'], {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.standard
		}),
		'&.opened1': {
			transform: 'translateX(300px)'
		}
	},

	autosuggest__container: {
		position: "relative",
	},

	autosuggest__input: {
		width: "240px",
		height: "30px",
		padding: "10px 20px",
		fontFamily: "Helvetica, sans-serif",
		fontWeight: "300",
		fontDize: "16px",
		border: "1px solid #aaa",
		borderRadius: "4px",
	},

	autosuggest__input_focused: {
		outline: "none",
	},

	autosuggest__input_open: {
		borderBottomLeftRadius: "0",
		borderBottomRightRadius: "0",
	},

	autosuggest__suggestions_container: {
		display: "none",
	},

	autosuggest__suggestions_container_open: {
		display: "block",
		position: "absolute",
		top: "51px",
		width: "280px",
		border: "1px solid #aaa",
		backgroundColor: "#fff",
		fontFamily: "Helvetica, sans-serif",
		fontWeight: "300",
		fontSize: "16px",
		borderBottomLeftRadius: "4px",
		borderBottomRightRadius: "4px",
		zIndex: "2",
	},

	autosuggest__suggestions_list: {
		margin: "0",
		padding: "0",
		listStyleType: "none",
	},

	autosuggest__suggestion: {
		cursor: "pointer",
		padding: "10px 20px",
	},

	autosuggest__suggestion_highlighted: {
		backgroundColor: "#ddd",
	},

	autosuggest__suggestion_match: {
		color: "red",
		fontWeight: "bold",
	},

	suggestionsContainerOpen: {
		position: 'absolute',
		zIndex: 10,
		marginTop: theme.spacing.unit,
		left: 0,
		right: 0,
		maxHeight: 200,
		overflowY: 'scroll'
	},
	suggestion: {
		display: 'block',
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none',
	},
	container: {
		position: 'relative',
		width: '100%'
	},
	input: {
		padding: '12px 14px'
	},
	label: {
		transform: 'translate(14px, 14px) scale(1)'
	},
});

const stateNames = [
	{ Value: "AL", Text: "Alabama" },
	{ Value: "AK", Text: "Alaska" },
	{ Value: "AZ", Text: "Arizona" },
	{ Value: "AR", Text: "Arkansas" },
	{ Value: "CA", Text: "California" },
	{ Value: "CO", Text: "Colorado" },
	{ Value: "CT", Text: "Connecticut" },
	{ Value: "DE", Text: "Delaware" },
	{ Value: "FL", Text: "Florida" },
	{ Value: "GA", Text: "Georgia" },
	{ Value: "HI", Text: "Hawaii" },
	{ Value: "ID", Text: "Idaho" },
	{ Value: "IL", Text: "Illinois" },
	{ Value: "IN", Text: "Indiana" },
	{ Value: "IA", Text: "Iowa" },
	{ Value: "KS", Text: "Kansas" },
	{ Value: "KY", Text: "Kentucky" },
	{ Value: "LA", Text: "Louisiana" },
	{ Value: "ME", Text: "Maine" },
	{ Value: "MD", Text: "Maryland" },
	{ Value: "MA", Text: "Massachusetts" },
	{ Value: "MI", Text: "Michigan" },
	{ Value: "MN", Text: "Minnesota" },
	{ Value: "MS", Text: "Mississippi" },
	{ Value: "MO", Text: "Missouri" },
	{ Value: "MT", Text: "Montana" },
	{ Value: "NE", Text: "Nebraska" },
	{ Value: "NV", Text: "Nevada" },
	{ Value: "NH", Text: "New Hampshire" },
	{ Value: "NJ", Text: "New Jersey" },
	{ Value: "NM", Text: "New Mexico" },
	{ Value: "NY", Text: "New York" },
	{ Value: "NC", Text: "North Carolina" },
	{ Value: "ND", Text: "North Dakota" },
	{ Value: "OH", Text: "Ohio" },
	{ Value: "OK", Text: "Oklahoma" },
	{ Value: "OR", Text: "Oregon" },
	{ Value: "PA", Text: "Pennsylvania" },
	{ Value: "RI", Text: "Rhode Island" },
	{ Value: "SC", Text: "South Carolina" },
	{ Value: "SD", Text: "South Dakota" },
	{ Value: "TN", Text: "Tennessee" },
	{ Value: "TX", Text: "Texas" },
	{ Value: "UT", Text: "Utah" },
	{ Value: "VT", Text: "Vermont" },
	{ Value: "VA", Text: "Virginia" },
	{ Value: "WA", Text: "Washington" },
	{ Value: "DC", Text: "Washington D.C." },
	{ Value: "WV", Text: "West Virginia" },
	{ Value: "WI", Text: "Wisconsin" },
	{ Value: "WY", Text: "Wyoming" }
];

function TextMaskPhone(props) {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			// mask={['+', '1', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
			mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
			// placeholderChar={'\u2000'}
			placeholderChar={'∗'}
			showMask
			guide
		/>
	);
}

TextMaskPhone.propTypes = {
	inputRef: PropTypes.func.isRequired,
};

const CUSTOMER_STATUS_LIST = [
	"Active",
	"Cancelled",
	"Inactive",
	"Suspended",
	"Transferred",
	"Unknown",
]
const WAIT_INTERVAL = 1000
const ENTER_KEY = 13

class FilterPanel extends Component {

	constructor(props) {
		super(props)

		this.state = {
			AccountTypes: -2,
			AccountExecutive: 0,

			Location: this.props.locationFilterValue.id,
			NearbyRadius: this.props.locationFilterValue.miles,
			AddressZipcodeRadius: this.props.locationFilterValue.miles,

			childCustomerName: "",
			suggestions: [],

			BillingAmountFrom: "",
			BillingAmountTo: "",


			addressColumns: [
				{
					title: "Type",
					name: "Type",
					columnName: "Type",
					width: 50,
				},
				{
					title: "Address",
					name: "Address",
					columnName: "Address",
					width: 80,
				},
				{
					title: "City",
					name: "City",
					columnName: "City",
					width: 80,
				},
				{
					title: "State",
					name: "State",
					columnName: "State",
					width: 50,
				},
				{
					title: "Zip / Postal",
					name: "ZipPostal",
					columnName: "ZipPostal",
					width: 80,
				},
			],
			addressRows: [{
				Type: "Sample Type",
				Address: "Sample Address",
				City: "Sample City",
				State: "Sample State",
				ZipPostal: "Sample ZipPostal",
			}],

			contactsColumns: [
				{
					title: "First",
					name: "First",
					columnName: "First",
					width: 80,
				},
				{
					title: "Last",
					name: "Last",
					columnName: "Last",
					width: 80,
				},
				{
					title: "Office Phone",
					name: "OfficePhone",
					columnName: "OfficePhone",
					width: 80,
				},
				{
					title: "Mobile Phone",
					name: "MobilePhone",
					columnName: "MobilePhone",
					width: 80,
				},
				{
					title: "Email",
					name: "Email",
					columnName: "Email",
					width: 80,
				},
			],
			contactsRows: [{
				First: "Sample First",
				Last: "Sample Last",
				OfficePhone: "Sample OfficePhone",
				MobilePhone: "Sample MobilePhone",
				Email: "Sample Email",
			}],

			customerName: "",
			customerAddress: "",
			customerCity: "",
			customerState: "",
			customerZip: "",

			customerPhone: "",
			customerFax: "",

			customerEmail: "",
			customerWeb: "",

			filters: {
				StatusNames: [],
				AccountTypeListName: "",
			}

		}


	}




	componentDidMount() {
		const { customers } = this.props;
		this.setState({
			rows: FuseUtils.getCustomerListFromDb(customers)
		});
	}

	componentWillMount() {
		this.setState({
			filters: { ...this.props.filters }
		})

		if (this.props.activeCustomer && this.props.activeCustomer.Data) {
			const {
				cust_no, cus_name, cus_addr, cus_city, cus_state, cus_zip,
				cus_phone,
				cus_fax,
				website,

				cont_1, cont_2,
				email1,
				email2,

				accounttype_groupid,
				account_typeid,
			} = this.props.activeCustomer.Data

			this.setState({
				cust_no, cus_name, cus_addr, cus_city, cus_state, cus_zip,
				// cus_phone: "+1" + cus_phone,
				// cus_fax: "+1" + cus_fax,
				cus_phone,
				cus_fax,
				website,

				cont_1, cont_2,
				email1,
				email2,

				accounttype_groupid: accounttype_groupid || 1,
				account_typeid,
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		const { customers, customerForm } = this.props;
		if (nextProps.customers !== customers) {
			this.setState({
				rows: FuseUtils.getCustomerListFromDb(nextProps.customers),
			});
		}

		if (!_.isEqual(nextProps.filters, this.props.filters)) {
			this.setState({
				filters: { ...nextProps.filters }
			})
		}
		// if (nextProps.locationFilterValue !== this.props.locationFilterValue) {
		// 	this.setState({
		// 		Location: nextProps.locationFilterValue.id,
		// 		NearbyRadius: nextProps.locationFilterValue.miles,
		// 		AddressZipcodeRadius: nextProps.locationFilterValue.miles,
		// 		SpecificAddress: nextProps.locationFilterValue.addrZipcode === undefined ? "" : nextProps.locationFilterValue.addrZipcode.addr,
		// 	})
		// this.onLocationFilter("Location", nextProps.locationFilterValue.id)
		// }
		// if (nextProps.activeCustomer && nextProps.activeCustomer.Data && !_.isEqual(nextProps.activeCustomer, this.props.activeCustomer)) {
		if (nextProps.activeCustomer && nextProps.activeCustomer.Data && nextProps.activeCustomer !== this.props.activeCustomer) {
			console.log('componentWillReceiveProps-filterpanel', nextProps.activeCustomer, this.props.activeCustomer)
			const {
				cust_no, cus_name, cus_addr, cus_city, cus_state, cus_zip,
				cus_phone,
				cus_fax,
				website,

				cont_1, cont_2,
				email1,
				email2,

				accounttype_groupid,
				account_typeid,
			} = nextProps.activeCustomer.Data

			this.setState({
				cust_no, cus_name, cus_addr, cus_city, cus_state, cus_zip,
				// cus_phone: "+1" + cus_phone,
				// cus_fax: "+1" + cus_fax,
				cus_phone,
				cus_fax,
				website,

				cont_1, cont_2,
				email1,
				email2,

				accounttype_groupid: accounttype_groupid || 1,
				account_typeid,
			});
		}
	}
	componentDidUpdate(prevProps) {
		if (this.props.state !== prevProps.state) {
			if (this.props.state) {
				document.addEventListener("keydown", this.handleDocumentKeyDown);
			}
			else {
				document.removeEventListener('keydown', this.handleDocumentKeyDown);
			}
		}
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.handleDocumentKeyDown);
	}

	handleDocumentKeyDown = event => {
		if (keycode(event) === 'esc') {
			this.props.closeFilterPanel();
		}
	};

	handleChangeChecked = name => event => {
		if (name === "customerStatusList0") {
			this.props.customerStatusList.Data.map((x, index) => {
				this.setState({
					["customerStatusList" + index + 1]: event.target.checked
				})
			})

		} else {
			this.setState({ [name]: event.target.checked });
		}

		// this.props.toggleStatus(name, event.target.checked)
	};
	customerStatusFiltertimer = null
	handleChange = name => event => {

		const value = event.target.value
		const checked = event.target.checked

		let onLocationFilter = this.onLocationFilter

		switch (name) {
			case "SpecificAddress":
				clearTimeout(this.timer)
				this.timer = setTimeout(
					function () {
						onLocationFilter(name, value);
					},
					WAIT_INTERVAL)
				break;

			case "Location":
			case "NearbyRadius":
			case "AddressZipcodeRadius":
				this.onLocationFilter(name, value)
				break;

			case "BillingAmountFrom":
			case "BillingAmountTo":
				// value = parseFloat("0" + value).toLocaleString(undefined, { maximumFractionDigits: 0 })
				console.log("value", value)
				break;

			case "filters.StatusNames":

				let newStatusNames = [...this.state.filters.StatusNames]
				if (checked) {
					if (value === "All") {
						// newStatusNames = CUSTOMER_STATUS_LIST
						newStatusNames = []
					} else {
						newStatusNames = [...new Set([...newStatusNames, value])]
					}
				} else {
					if (value === "All") {
						newStatusNames = ["-"]
					} else {
						newStatusNames.splice(newStatusNames.indexOf(value), 1)
						if (newStatusNames.length === 0) {
							newStatusNames = ["-"]
						}
					}

				}
				this.setState({
					filters: {
						...this.state.filter,
						StatusNames: newStatusNames
					}
				})
				console.log("newStatusNames", newStatusNames)
				clearTimeout(this.customerStatusFiltertimer)
				this.customerStatusFiltertimer = setTimeout(
					this.props.setFilterCustomerStatuses,
					WAIT_INTERVAL,
					newStatusNames)
				return

			default:
				break;

		}

		this.setState({
			[name]: value
		});

	};
	onLocationFilter = (name, value) => {

		let payload = {
			...this.props.locationFilterValue,
			id: this.state.Location,
			miles: this.state.Location === "locationNearBy" ?
				this.state.NearbyRadius :
				(this.state.Location === "locationNearSpecificAddress" ?
					this.state.AddressZipcodeRadius :
					this.props.locationFilterValue.miles),
			addrZipcode:
				this.state.Location === "locationNearSpecificAddress" ?
					this.state.SpecificAddress : undefined
		}
		switch (name) {
			case "Location":
				payload = {
					...payload,
					id: value,
					miles: value === "locationNearBy" ?
						this.props.locationFilterValue.miles :
						(value === "locationNearSpecificAddress" ?
							this.state.AddressZipcodeRadius :
							this.props.locationFilterValue.miles),
				}
				if (value != "locationNearSpecificAddress") {

				} else {
					Geocode.fromAddress(this.state.SpecificAddress).then(
						response => {
							const { lat, lng } = response.results[0].geometry.location;
							// console.log(lat, lng);

							payload = {
								...payload,
								addrZipcode: {
									lat,
									lng,
									addr: this.state.SpecificAddress
								}
							}
							this.props.selectLocationFilter(payload)
							return
						},
						error => {
							// console.error(error);
							payload = {
								...payload,
								addrZipcode: undefined
							}
							this.props.selectLocationFilter(payload)
							return
						}
					);
					return
				}

				break;
			case "NearbyRadius":
				payload = {
					...payload,
					miles: value
				}
				break;
			case "SpecificAddress":

				Geocode.fromAddress(value).then(
					response => {
						const { lat, lng } = response.results[0].geometry.location;
						// console.log(lat, lng);

						payload = {
							...payload,
							addrZipcode: {
								lat,
								lng,
								addr: value
							}
						}
						this.props.selectLocationFilter(payload)
						return
					},
					error => {
						// console.error(error);
						payload = {
							...payload,
							addrZipcode: undefined
						}
						this.props.selectLocationFilter(payload)
						return
					}
				);

				return;
			case "AddressZipcodeRadius":
				Geocode.fromAddress(this.state.SpecificAddress).then(
					response => {
						const { lat, lng } = response.results[0].geometry.location;
						// console.log(lat, lng);

						payload = {
							...payload,
							miles: value,
							addrZipcode: {
								lat,
								lng,
								addr: value
							}
						}
						this.props.selectLocationFilter(payload)
						return
					},
					error => {
						// console.error(error);
						payload = {
							...payload,
							miles: value,
							addrZipcode: undefined
						}
						this.props.selectLocationFilter(payload)
						return
					}
				);

				return;
		}
		console.log(payload)
		this.props.selectLocationFilter(payload)
	}

	handleChangeCustomerInfoProps = name => event => {
		const value = event.target.value
		this.setState({ [name]: value })
		this.props.updateNewCustomerParam(name, value)

		if (FuseUtils.parseBoolean(this.props.activeCustomer.Data.sameBillingAsMain)) {
			switch (name) {
				case "cus_name":
					this.props.updateNewCustomerParam('bill_name', value)
					break
				case "cus_phone":
					this.props.updateNewCustomerParam('bill_phone', value)
					break

				case "cus_addr":
					this.props.updateNewCustomerParam('bill_addr', value)
					break
				case "cus_addr2":
					this.props.updateNewCustomerParam('bill_addr2', value)
					break


				case "cus_city":
					this.props.updateNewCustomerParam('bill_city', value)
					break
				case "cus_state":
					this.props.updateNewCustomerParam('bill_state', value)
					break
				case "cus_zip":
					this.props.updateNewCustomerParam('bill_zip', value)
					break
			}
		}

	}
	handleChangeCustomerInfoPropsChecked = name => event => {
		const checked = event.target.checked
		this.setState({ [name]: checked })
		this.props.updateNewCustomerParam(name, checked)
	}
	//
	// customer name suggestion
	//
	escapeRegexCharacters(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	getSuggestions(value) {
		const escapedValue = this.escapeRegexCharacters(value.trim());

		if (escapedValue === '') {
			return [];
		}

		const regex = new RegExp('^' + escapedValue, 'i');
		if (this.state.rows == undefined) return [];
		return this.state.rows.filter(x => regex.test(x.CustomerName));
	}

	getSuggestionValue(suggestion) {
		return suggestion.CustomerName;
	}

	onChange = (event, { newValue, method }) => {
		this.setState({
			childCustomerName: newValue
		});
	};

	onSuggestionsFetchRequested = ({ value }) => {
		this.setState({
			suggestions: this.getSuggestions(value)
		});
	};

	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
	};
	renderInputComponent = (inputProps) => {
		const { classes, inputRef = () => { }, ref, ...other } = inputProps;

		return (
			<TextField
				fullWidth
				// variant="outlined"
				label="Customer name"
				InputProps={{
					inputRef: node => {
						ref(node);
						inputRef(node);
					},
					classes: {
						input: classes.input,
					},
				}}
				InputLabelProps={{
					classes: { outlined: classes.label }
				}}
				required
				{...other}
				autoFocus={true}
			/>
		);
	};

	commitChanges = ({ added, changed, deleted }) => {
		let rows = this.state.addressRows;
		if (added) {
			const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
			rows = [
				...rows,
				...added.map((row, index) => ({
					id: startingAddedId + index,
					...row,
				})),
			];
		}
		if (changed) {
			rows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
		}
		if (deleted) {
			const deletedSet = new Set(deleted);
			rows = rows.filter(row => !deletedSet.has(row.id));
		}
		this.setState({ addressRows: rows });
	}

	render() {
		const { classes, customerForm, customers } = this.props;

		const { addressRows, addressColumns, contactsRows, contactsColumns } = this.state;

		const { childCustomerName, suggestions } = this.state;
		// Autosuggest will pass through all these props to the input.
		const inputProps = {
			classes,
			placeholder: 'Type a customer name...',
			value: childCustomerName,
			onChange: this.onChange
		};


		let regionCustomers = [];

		// if (customers) { // to avoid error
		// 	customers.Data.Regions.filter(x => {
		// 		return this.props.regionId === 0 || x.Id === this.props.regionId;
		// 	}).forEach(x => {
		// 		regionCustomers = [...regionCustomers, ...x.CustomerList];
		// 	});
		// }

		// let accountTypes = [...new Set(regionCustomers.map(x => x.AccountTypeListName))].sort();
		// let accountStatuses = [...new Set(regionCustomers.map(x => x.StatusName))].sort();

		// return (<MenuItem key={index} value={index}>{x.Title}</MenuItem>)

		let customerStatusListTexts = []
		console.log("this.props.customerStatusList", this.props.customerStatusList)
		if (this.props.customerStatusList && this.props.customerStatusList.Data) {
			customerStatusListTexts = this.props.customerStatusList.Data.filter(x => {
				if (x.Text === null) return false
				return true
			}).map(x => {
				return x.Text
			}).sort();
		}
		customerStatusListTexts = CUSTOMER_STATUS_LIST


		let accountTypeTexts = []
		if (this.props.accountTypeList && this.props.accountTypeList.Data) {
			accountTypeTexts = this.props.accountTypeList.Data.filter(x => {
				return parseInt(x.GroupId) === parseInt(this.state.accounttype_groupid)
			})
			if (accountTypeTexts.length > 0) {
				accountTypeTexts = accountTypeTexts[0].Types.sort(FuseUtils.dynamicSortBy("name"))
			}
		}
		console.log("this.props.accountTypeList", this.props.accountTypeList, this.state.accounttype_groupid, accountTypeTexts)

		let execTitles = []
		console.log("this.props.accountExecutiveList", this.props.accountExecutiveList)
		console.log("this.props.accountTypesGroups", this.props.accountTypesGroups)
		if (this.props.accountExecutiveList && this.props.accountExecutiveList.Data) {
			execTitles = this.props.accountExecutiveList.Data.filter(x => {
				if (x.FullName === null) return false
				return true
			}).map(x => {
				return { title: x.FullName, value: x.UserId }
			}).sort();
		}

		console.log('---this.props.accountTypeList---', this.state.accounttype_groupid, this.state.account_typeid)
		return (
			<div className={classNames(classes.root, "flex flex-1 flex-col p-20")}>
				{/* <Paper className="flex flex-1 flex-col min-h-px p-20"> */}
				{customerForm && customerForm.props.open
					? (
						<GridContainer style={{ alignItems: 'center', width: 500 }} className={classNames(classes.formControl)}>
							{/* <GridItem xs={12} sm={12} md={12} className="flex flex-row">
								<h3 className="mt-24">Customer Information</h3>
							</GridItem> */}
							<GridItem xs={12} sm={12} md={12} className="flex flex-row">
								<TextField
									id="cus_name"
									label="Name *"
									className={classNames(classes.textField, 'pr-12')}
									value={this.state.cus_name || ''}
									onChange={this.handleChangeCustomerInfoProps('cus_name')}
									InputLabelProps={{ shrink: true }}
									margin="dense"
									// variant="outlined"
									autoFocus
									fullWidth />
								{this.props.customerForm.type === 'edit' &&
									<TextField
										id="cust_no"
										label="#"
										className={classes.textField}
										value={this.state.cust_no}
										onChange={this.handleChangeCustomerInfoProps('cust_no')}
										InputLabelProps={{ shrink: true }}
										InputProps={{ readOnly: true }}
										margin="dense"
										// variant="outlined"
										style={{ width: '30%' }} />
								}
							</GridItem>
							<GridItem xs={12} sm={12} md={12} className="flex flex-row">
								<TextField
									id="cus_addr"
									label="Address *"
									className={classes.textField}
									value={this.state.cus_addr || ''}
									onChange={this.handleChangeCustomerInfoProps('cus_addr')}
									InputLabelProps={{ shrink: true }}
									margin="dense"
									// variant="outlined"
									fullWidth />
							</GridItem>
							<GridItem xs={12} sm={12} md={12} className="flex flex-row">
								<TextField
									id="cus_addr2"
									label="Address2"
									className={classes.textField}
									value={this.state.cus_addr2 || ''}
									onChange={this.handleChangeCustomerInfoProps('cus_addr2')}
									InputLabelProps={{ shrink: true }}
									margin="dense"
									// variant="outlined"
									fullWidth />
							</GridItem>
							<GridItem xs={12} sm={12} md={12} className="flex flex-row">
								<TextField
									id="cus_city"
									label="City *"
									className={classNames(classes.textField, 'pr-12')}
									value={this.state.cus_city || ''}
									onChange={this.handleChangeCustomerInfoProps('cus_city')}
									InputLabelProps={{ shrink: true }}
									margin="dense"
									// variant="outlined"
									style={{ width: '55%' }}
								/>
								<FormControl className={classNames(classes.formControl, 'pr-12')} style={{ marginTop: 5, width: '20%' }}>
									<InputLabel shrink htmlFor="cus_state">State</InputLabel>
									<Select
										native
										value={this.state.cus_state}
										onChange={this.handleChangeCustomerInfoProps('cus_state')}
										inputProps={{
											name: 'cus_state',
											id: 'cus_state',
										}}
									>
										<option value=''></option>
										{stateNames.map((option, index) => (
											<option key={index} value={option.Value}>
												{option.Value}
											</option>
										))}
									</Select>
								</FormControl>
								<TextField
									id="cus_zip"
									label="Zip *"
									className={classNames(classes.textField)}
									value={this.state.cus_zip || ''}
									onChange={this.handleChangeCustomerInfoProps('cus_zip')}
									InputLabelProps={{ shrink: true }}
									margin="dense"
									// variant="outlined"
									style={{ width: '25%' }}
								/>
							</GridItem>

							<GridItem xs={12} sm={12} md={12} className="flex flex-row">
								<FormControl className={classNames(classes.formControl, 'mr-6')} style={{ flex: 1 }}>
									<TextField
										id="cus_phone"
										label="Phone"
										className={classes.textField}
										// onChange={this.handleChange('customerPhone')}
										margin="dense"
										InputLabelProps={{
											shrink: true
										}}
										InputProps={{
											inputComponent: TextMaskPhone,
											maxLength: 40,
											value: this.state.cus_phone || '',
											onChange: this.handleChangeCustomerInfoProps('cus_phone')
										}}
										// variant="outlined"
										fullWidth
										required
									/>
								</FormControl>

								<FormControl className={classNames(classes.formControl, 'ml-6')} style={{ flex: 1 }}>
									<TextField
										id="cus_fax"
										label="Fax"
										className={classes.textField}
										// onChange={this.handleChange('customerFax')}
										margin="dense"
										InputLabelProps={{
											shrink: true
										}}
										InputProps={{
											inputComponent: TextMaskPhone,
											maxLength: 40,
											value: this.state.cus_fax || '',
											onChange: this.handleChangeCustomerInfoProps('cus_fax')
										}}
										// variant="outlined"
										fullWidth
										required
									/>
								</FormControl>

							</GridItem>

							<GridItem xs={12} sm={12} md={12} className="flex flex-row">
								{/* <TextField
									id="email1"
									label="Email"
									type="email"
									className={classNames(classes.textField, 'mr-6')}
									value={this.state.email1 || ''}
									onChange={this.handleChangeCustomerInfoProps('email1')}
									InputLabelProps={{ shrink: true }}
									margin="dense"
									// variant="outlined"
									style={{ width: '100%' }}
								/> */}

								<TextField
									id="outlined-name"
									label="Website"
									className={classNames(classes.textField, 'ml-6')}
									value={this.state.website || ''}
									onChange={this.handleChangeCustomerInfoProps('website')}
									InputLabelProps={{ shrink: true }}
									margin="dense"
									// variant="outlined"
									style={{ width: '100%' }}
								/>
							</GridItem>

							<GridItem xs={12} sm={12} md={12} className="flex flex-row mt-24">
								{this.props.accountTypesGroups && this.props.accountTypesGroups.Data &&
									<FormControl className={classNames(classes.formControl, 'pr-12')} style={{ marginTop: 5 }} fullWidth>
										<InputLabel shrink htmlFor="accounttype_groupid">Account Type Group</InputLabel>
										<Select
											native
											value={this.state.accounttype_groupid || ''}
											onChange={this.handleChangeCustomerInfoProps('accounttype_groupid')}
											inputProps={{
												name: 'accounttype_groupid',
												id: 'accounttype_groupid',
											}}
										>
											{this.props.accountTypesGroups.Data.map((x, index) => (
												<option key={index} value={x.GroupId}>{x.name}</option>
											))}
										</Select>
									</FormControl>
								}
								<FormControl className={classNames(classes.formControl)} style={{ marginTop: 5 }} fullWidth>
									<InputLabel shrink htmlFor="account_typeid">Account Type</InputLabel>
									<Select
										native
										value={this.state.account_typeid || ''}
										onChange={this.handleChangeCustomerInfoProps('account_typeid')}
										inputProps={{
											name: 'account_typeid',
											id: 'account_typeid',
										}}
									>
										{accountTypeTexts.map((x, index) => (
											<option key={index} value={x.AccountTypeId}>{x.name}</option>
										))}
									</Select>
								</FormControl>
							</GridItem>

							<GridItem xs={12} sm={12} md={12} className="flex flex-col">
								<h3 className="mt-24 mb-12">Contacts</h3>
								<div className='flex w-full'>
									<TextField
										id="First"
										label="Contact"
										className={classNames(classes.textField, 'pr-12')}
										value={this.state.cont_1 || ''}
										onChange={this.handleChangeCustomerInfoProps('cont_1')}
										margin="dense"
										// variant="outlined"
										InputLabelProps={{ shrink: true }}
										style={{ width: '100%' }} />
									<TextField
										id="Last"
										label="Email"
										className={classNames(classes.textField, 'pr-12')}
										value={this.state.email1 || ''}
										onChange={this.handleChangeCustomerInfoProps('email1')}
										margin="dense"
										// variant="outlined"
										InputLabelProps={{ shrink: true }}
										style={{ width: '100%' }} />
								</div>
								<div className='flex w-full'>
									<TextField
										id="OfficePhone"
										label="Contact 2"
										className={classNames(classes.textField, 'pr-12')}
										value={this.state.cont_2 || ''}
										onChange={this.handleChangeCustomerInfoProps('cont_2')}
										margin="dense"
										// variant="outlined"
										InputLabelProps={{ shrink: true }}
										style={{ width: '100%' }} />
									<TextField
										id="MobilePhone"
										label="Email 2"
										className={classNames(classes.textField, 'pr-12')}
										value={this.state.email2 || ''}
										onChange={this.handleChangeCustomerInfoProps('email2')}
										margin="dense"
										// variant="outlined"
										InputLabelProps={{ shrink: true }}
										style={{ width: '100%' }} />
								</div>
							</GridItem>

						</GridContainer>
					) :
					(
						<div>
							{/* <RadioGroup */}
							<div className="mt-0 flex flex-col" style={{ width: '200px' }}>
								<h3 className="mb-12">Location</h3>
								<RadioGroup
									aria-label="Location"
									name="Location"
									className={classes.group}
									value={this.props.locationFilterValue.id}
								>

									<FormControlLabel value="locationAll" control={<Radio onChange={this.handleChange('Location')} />} label="All" />
									<FormControlLabel value="locationNearBy" control={<Radio onChange={this.handleChange('Location')} />} label="NearBy" />
									{this.state.Location === "locationNearBy" &&
										<TextField
											select

											id="NearbyRadius"
											label="Radius"
											className={classes.textField}
											InputLabelProps={{
												shrink: true
											}}
											value={this.props.locationFilterValue.miles}
											onChange={this.handleChange('NearbyRadius')}
											margin="dense"
											// variant="outlined"
											fullWidth
										>
											{Array.from({ length: 15 })
												.map((val, index) => (
													<MenuItem key={index} value={(index + 1) * 5}>
														{(index + 1) * 5} Miles
													</MenuItem>
												))
											}
										</TextField>
									}

									<FormControlLabel value="locationNearSpecificAddress" control={<Radio onChange={this.handleChange('Location')} />} label="Near Specific Address" />

									{this.state.Location === "locationNearSpecificAddress" &&
										<TextField
											id="SpecificAddress"
											label="Address"
											className={classes.textField}
											onChange={this.handleChange('SpecificAddress')}
											margin="dense"
											// variant="outlined"
											fullWidth
										/>
									}
									{this.state.Location === "locationNearSpecificAddress" &&
										<TextField
											select

											id="AddressZipcodeRadius"
											label="Radius"
											className={classes.textField}
											InputLabelProps={{
												shrink: true
											}}
											value={this.props.locationFilterValue.miles}
											onChange={this.handleChange('AddressZipcodeRadius')}
											margin="dense"
											// variant="outlined"
											fullWidth
										>
											{
												Array.from({ length: 15 })
													.map((val, index) => (
														<MenuItem key={index} value={(index + 1) * 5}>
															{(index + 1) * 5} Miles
																</MenuItem>
													))
											}
										</TextField>
									}
								</RadioGroup>
							</div>

							<div className="mt-36 flex flex-col" style={{ width: '200px' }}>
								<h3 className="mb-12">Billing Amount</h3>
								<div className="flex flex-row" >
									<TextField
										type="number"
										id="BillingAmountFrom"
										label="From"
										value={this.state.BillingAmountFrom}
										className={classNames(classes.textField, "mr-6")}
										onChange={this.handleChange('BillingAmountFrom')}
										margin="dense"
										// variant="outlined"
										InputProps={{
											startAdornment: <InputAdornment position="start">$</InputAdornment>,
										}}
										inputProps={{ min: "0", precision: "2", step: "1" }}
										fullWidth
									/>
									<TextField
										type="number"
										id="BillingAmountTo"
										value={this.state.BillingAmountTo}
										label="To"
										className={classNames(classes.textField, "ml-6")}
										onChange={this.handleChange('BillingAmountTo')}
										margin="dense"
										// variant="outlined"
										InputProps={{
											startAdornment: <InputAdornment position="start">$</InputAdornment>,
											min: "0",
										}}
										inputProps={{ min: "0", precision: "2" }}
										fullWidth
									/>
								</div>
							</div>

							<div className="mt-0 flex flex-col" style={{ width: '200px' }}>
								<Divider variant="middle" style={{ marginTop: 24, marginBottom: 24 }} />
								{this.props.accountTypesGroups !== null && (
									<TextField
										select
										id="AccountTypeGroup"
										label="Account Type Group"
										className={classes.textField}
										InputLabelProps={{ shrink: true }}
										value={this.state.accounttype_groupid || 0}
										onChange={this.handleChange('accounttype_groupid')}
										margin="dense"
										// variant="outlined"
										fullWidth
									>
										{this.props.accountTypesGroups.Data && this.props.accountTypesGroups.Data.map((x, index) => (
											<MenuItem key={index} value={x.GroupId}>{x.name}</MenuItem>
										))}
									</TextField>
								)}
								{accountTypeTexts && accountTypeTexts.length > 0 &&
									<TextField
										select

										id="AccountType"
										label="Account Type"
										className={classes.textField}
										InputLabelProps={{ shrink: true }}
										value={this.state.account_typeid || 0}
										onChange={this.handleChange('account_typeid')}
										margin="dense"
										// variant="outlined"
										fullWidth
									>
										{accountTypeTexts.map((x, index) => (
											<MenuItem key={index} value={x.AccountTypeId}>{x.name}</MenuItem>
										))}
									</TextField>}

								<TextField
									select

									id="AccountExecutive"
									label="Account Executive"
									className={classes.textField}
									InputLabelProps={{
										shrink: true
									}}
									value={this.state.AccountExecutive === undefined ? 0 : this.state.AccountExecutive}
									onChange={this.handleChange('AccountExecutive')}
									margin="dense"
									// variant="outlined"
									fullWidth
								>
									{/* {[{
											value: 0, label: "All"
										}, {
											value: 1, label: "None"
										}].map(option => (
											<MenuItem key={option.value} value={option.value}>
												{option.label}
											</MenuItem>
										))} */}
									{
										execTitles.map((x, index) => {
											return (<MenuItem key={index} value={x.value}>{x.title}</MenuItem>)
										})
									}

								</TextField>

							</div>

							<div className="mt-36 flex flex-col" style={{ width: '200px' }}>
								<h3 className="mb-12">Customer Status</h3>
								<FormControlLabel
									control={
										<Switch
											// checked={this.state.filters.StatusNames.length >= customerStatusListTexts.length}
											checked={this.state.filters.StatusNames.length === 0}
											onChange={this.handleChange('filters.StatusNames')}
											value="All"
										/>
									}
									label="All"
								/>
								{
									customerStatusListTexts
										.map((x, index) => (
											<FormControlLabel key={index}
												control={
													<Switch
														checked={this.state.filters.StatusNames.indexOf(x) > -1 || this.state.filters.StatusNames.length === 0}
														onChange={this.handleChange('filters.StatusNames')}
														value={x}
													/>
												}
												label={x}
											/>
										))
								}
							</div>
						</div>
					)
				}
				{/* </Paper> */}
				{/* </div> */}
			</div >
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		toggleStatus: Actions.toggleStatus,
		selectLocationFilter: Actions.selectLocationFilter,
		setFilterCustomerStatuses: Actions.setFilterCustomerStatuses,
		getCustomers: Actions.getCustomers,

		updateNewCustomerParam: Actions.updateNewCustomerParam,
	}, dispatch);
}

function mapStateToProps({ customers, auth }) {
	return {
		filterState: customers.bOpenedFilterPanel,
		transactionStatus: customers.transactionStatus,
		customers: customers.customersDB,
		customerForm: customers.customerForm,
		regionId: auth.login.defaultRegionId,
		locationFilterValue: customers.locationFilterValue,

		accountTypeList: customers.accountTypeList,
		accountExecutiveList: customers.accountExecutiveList,
		customerStatusList: customers.customerStatusList,
		accountTypesGroups: customers.accountTypesGroups,
		filters: customers.filters,
		activeCustomer: customers.activeCustomer,
	}
}

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(FilterPanel)));
