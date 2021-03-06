import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

// core components
import { Button, Divider, Icon } from '@material-ui/core';

import { withStyles } from "@material-ui/core";
import { withRouter } from 'react-router-dom';

// for store
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";
import * as Actions from 'store/actions';

// third party
import "react-table/react-table.css";
import _ from 'lodash';
// import Autosuggest from 'react-autosuggest';
import classNames from 'classnames';
// import match from "autosuggest-highlight/match";
// import parse from "autosuggest-highlight/parse";

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CallLog from './form/CallLog.js';
import CustomerCallback from './form/customerCallback.js'
import CollectionsPage from './form/CollectionsPage.js';
import BillingsPage from './form/BillingsPage';
// import CustomerCallback from './from/customerCallback.js';
const hexToRgb = (hex) => {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

const styles = theme => ({

	root: {
		width: '90%',
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
	},
	backButton: {
		marginRight: theme.spacing.unit
	},
	completed: {
		display: 'inline-block'
	},
	instructions: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit
	},
	//////////////////
	layoutForm: {
		flexDirection: 'row',
	},
	button: {
		marginRight: theme.spacing.unit,
		'& span': {
			textTransform: 'none'
		},
		margin: theme.spacing.unit
	},
	card: {
		width: '100%',
	},
	container: {
		position: 'relative',
		width: '100%'
	},
	formControl: {
		marginBottom: 24,
		minWidth: 200,
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
	divider: {
		height: theme.spacing.unit * 2,
	},
	cardHeader: {
		backgroundColor: theme.palette.secondary.main,
		padding: '10px 24px',
		'& span': {
			color: 'white'
		}
	},
	tableTheadRow: {
		// backgroundColor: 'rgba(' + hexToRgb(theme.palette.primary.main).r + ',' + hexToRgb(theme.palette.primary.main).g + ',' + hexToRgb(theme.palette.primary.main).b +', .2)'
		backgroundColor: theme.palette.primary.main
	},
	tableThEven: {
		backgroundColor: 'rgba(' + hexToRgb(theme.palette.secondary.main).r + ',' + hexToRgb(theme.palette.secondary.main).g + ',' + hexToRgb(theme.palette.secondary.main).b + ', .3)'
	},

});

const newCustomerState = {
	"MasterTrxTypeListId": "",
	"RegionId": "",
	"RegionName": "",
	"CustomerId": "",
	"CustomerNo": "",
	"CustomerDate": "",
	"DueDate": "",
	// "CustomerId": "",
	// "CustomerNo": "",
	"CustomerName": "",
	"EBill": "",
	"PrintCustomer": "",
	"CustomerDescription": "",
	"CustomerAmount": "",
	"CustomerTax": "",
	"CustomerTotal": "",
	"CPI": "",
	"TransactionStatusListId": "",
	"TransactionStatus": "",
	"CustomerBalanceAmount": "",
	"CustomerBalanceTax": "",
	"CustomerBalanceTotal": "",
	"EBillText": "",
	"PrintCustomerText": "",
	"IsOpen": "",
	"ConsolidatedCustomer": "",
	"ConsolidatedCustomerId": "",
	"ConsolidatedCustomerNo": "",
	"CreditId": "",
	"Service": ""
};

// function renderInputComponent(inputProps) {
// 	const { classes, inputRef = () => { }, ref, ...other } = inputProps;

// 	return (
// 		<TextField
// 			fullWidth
// 			variant="outlined"
// 			label="Customer For:"
// 			InputProps={{
// 				inputRef: node => {
// 					ref(node);
// 					inputRef(node);
// 				},
// 				classes: {
// 					input: classes.input,
// 				},
// 			}}
// 			{...other}
// 		/>
// 	);
// }

// function renderSuggestion(suggestion, { query, isHighlighted }) {
// 	const matches = match(suggestion.CustomerName, query);
// 	const parts = parse(suggestion.CustomerName, matches);

// 	return (
// 		<MenuItem selected={isHighlighted} component="div">
// 			<div>
// 				{parts.map((part, index) => {
// 					return part.highlight ? (
// 						<span key={String(index)} style={{ fontWeight: 700 }}>
// 							{part.text}
// 						</span>
// 					) : (
// 							<strong key={String(index)} style={{ fontWeight: 300 }}>
// 								{part.text}
// 							</strong>
// 						);
// 				})}
// 			</div>
// 		</MenuItem>
// 	);
// }

function escapeRegexCharacters(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}



function getSteps() {
	// return ['Service Agreement', 'Billing', 'Service Settings', "Walk-Thru", "Account Offering", "Documents", "Marketing", "Account History"];
	return ['CallLog', 'Billing', 'Inspections', 'Collections','CallBack'];
}

const Upload_Document_headers = [
	// {
	// 	id: 'doc_type',
	// 	numeric: false,
	// 	disablePadding: false,
	// 	label: 'Doc Type'
	// },
	{
		id: 'documentName',
		numeric: false,
		disablePadding: false,
		label: 'Document Name'
	},
	{
		id: 'uploadDateTime',
		numeric: false,
		disablePadding: false,
		label: 'Upload Date Time'
	},
	{
		id: 'browse',
		numeric: false,
		disablePadding: false,
		label: 'Browse'
	},
	// {
	// 	id: 'fileSize',
	// 	numeric: false,
	// 	disablePadding: false,
	// 	label: 'File Size'
	// },
	// {
	// 	id: 'view',
	// 	numeric: false,
	// 	disablePadding: false,
	// 	label: 'View'
	// }
];



// const GridRootComponent = props => <Grid.Root {...props} style={{ height: '100%' }} />;
class CustomerForm extends Component {
	state = {
		temp: [],
		data: [],
		docs: [],
		customers: [],
		...newCustomerState,
		value: '',
		suggestions: [],
		selectedCustomer: null,
		labelWidth: 0,
		selectedWork: "",

		activeStep: 3,
		completed: new Set(),
		skipped: new Set(),


		pageSizes: [5, 10, 20, 30, 50, 100],
		pageSize: 20,
		searchValue: '',
		selection: [],
		sorting: [
			{ columnName: 'Number', direction: 'asc' }
		],
		rows: [],
		columns: [],
		tableColumnExtensions: [],

		account_offering_step: 0,

	};

	//
	// to edit table cell
	//
	commitChanges = ({ added, changed, deleted }) => {
		console.log("commitChanges");
		let { rows } = this.state;
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
		this.setState({ rows });
	}

	getStepContent(step) {
		const { classes,
			// CustomerForm,
			// addCustomer,
			// updateCustomer,
			// removeCustomer
		} = this.props;
		// const {
		// 	value,
		// 	suggestions
		// } = customerForm.state;

		// const autosuggestProps = {
		// 	renderInputComponent,
		// 	suggestions: suggestions,
		// 	onSuggestionsFetchRequested: customerForm.onSuggestionsFetchRequested,
		// 	onSuggestionsClearRequested: customerForm.onSuggestionsClearRequested,
		// 	getSuggestionValue: customerForm.getSuggestionValue,
		// 	renderSuggestion,
		// };

		let execTitles = []
		if (this.props.accountExecutiveList !== null && this.props.accountExecutiveList.Data !== undefined) {
			execTitles = this.props.accountExecutiveList.Data.filter(x => {
				if (x.Title === null) return false
				return true
			}).map(x => {
				return x.FirstName + " " + x.LastName
			}).sort();
		}

		const {
			pins,
			// locationFilterValue,
			pins2,
			gmapVisible,
			// mapViewState,
			rows,
			columns,
			selection,
			tableColumnExtensions,
			tableGroupColumnExtension,
			sorting,
			editingColumnExtensions,
			currencyColumns,
			pageSize,
			pageSizes,
			amountFilterOperations,
			// groupingColumns,
			// booleanColumns,
			searchValue,
			grouping,
			// leftColumns,
			// rightColumns,
		} = this.state;

		switch (step) {
			case 0:
				return (
					<CallLog />
				);
			case 1:
				return (
					<BillingsPage></BillingsPage>
				);
			case 2:
				return (
					<Fragment></Fragment>
				);
			case 3:
				return (
					<CollectionsPage />
				);
			case 4:
				return(
					<CustomerCallback/>
				)

			default:
				return 'Unknown step';
		}
	}

	onChange = (event, { newValue, method }) => {
		this.setState({
			value: newValue.toString()
		});
	};

	onSuggestionsFetchRequested = ({ value }) => {
		if (value.length < 2) return;

		this.setState({
			suggestions: this.getSuggestions(value)
		});
	};

	onSuggestionsClearRequested = () => {
		this.setState({
			suggestions: []
		});
	};

	getSuggestionValue = (suggestion) => {
		this.setState({ selectedCustomer: suggestion });
		return suggestion.CustomerName;
	};

	getSuggestions = (value) => {
		const escapedValue = escapeRegexCharacters(value.trim());
		const regex = new RegExp(escapedValue, 'i');

		return this.props.customers.filter(customer => regex.test(customer.CustomerName));
	};

	closeComposeForm = () => {
		//this.props.this.type === 'create' ? this.props.closeEditCustomerForm() : this.props.closeNewCustomerForm();
		// this.type === 'create' ? this.props.closeEditCustomerForm() : this.props.closeNewCustomerForm();
		this.props.closeCustomerServiceForm()
	};
	// constructor(props) {
	// 	super(props);
	// }
	constructor(props) {
		super(props);

		// if (!props.bLoadedFranchisees) {
		// 	props.getFranchisees();
		// }
		if (!props.documents) {
			props.getDocuments();
		}
		this.fetchData = this.fetchData.bind(this);
		// this.escFunction = this.escFunction.bind(this);

		// if (!props.bLoadedFranchisees) {
		// 	props.getFranchisees(this.props.regionId, this.props.statusId, this.props.Location, this.props.Latitude, this.props.Longitude, this.props.SearchText);
		// }

		this.changeSelection = selection => this.setState({ selection });
		this.changeSorting = sorting => this.setState({ sorting });
		this.changeSearchValue = value => this.setState({ searchValue: value });
	}
	fetchData(state, instance) {
		this.setState({
			pageSize: state.pageSize,
			page: state.page,
		});
	}
	// escFunction(event) {
	// 	if (event.keyCode === 27) {
	// 		this.setState({ s: '' });
	// 		this.getFranchiseesFromStatus();
	// 	}
	// }

	componentDidUpdate(prevProps, prevState, snapshot) {
	}

	componentWillMount() {
		// this.getFranchiseesFromStatus();
	}

	componentDidMount() {
		// this.getDocuments()
		if (this.InputLabelRef) {
			this.setState({
				labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
			});
		}
	}

	// getDocuments = (rawData = this.props.documents) => {
	// 	console.log("DOCUMENT  rawData)
	// 	let all_docs = [];
	// 	if (rawData === null || rawData === undefined) return;
	// 	let documents = rawData.Data.filter(x => x);

	// 	all_docs = [...all_docs, ...rawData.Data]
	// 	this.setState({
	// 		docs: all_docs
	// 	});
	// };

	handleChange = (event) => {
		this.setState(_.set({ ...this.state }, event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value));
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value
		});
	};

	canBeSubmitted() {
		return true;
		// const { name } = this.state;
		// return (
		// 	name.length > 0
		// );
	}


	//////////////////////
	totalSteps = () => {
		return getSteps().length;
	};

	isStepOptional = step => {
		// return step === 1;
		return false;
	};

	// handleSkip = () => {
	// 	const { activeStep } = this.state;
	// 	if (!this.isStepOptional(activeStep)) {
	// 		// You probably want to guard against something like this
	// 		// it should never occur unless someone's actively trying to break something.
	// 		throw new Error("You can't skip a step that isn't optional.");
	// 	}

	// 	this.setState(state => {
	// 		const skipped = new Set(state.skipped.values());
	// 		skipped.add(activeStep);
	// 		return {
	// 			activeStep: state.activeSt 1,
	// 			skipped
	// 		};
	// 	});
	// };

	// handleNext = () => {
	// 	let activeStep;

	// 	if (this.isLastStep() && !this.allStepsCompleted()) {
	// 		// It's the last step, but not all steps have been completed
	// 		// find the first step that has been completed
	// 		const steps = getSteps();
	// 		activeStep = steps.findIndex((step, i) => !this.state.completed.has(i));
	// 	}
	// 	else {
	// 		activeStep = this.state.activeSt 1;
	// 	}
	// 	this.setState({
	// 		activeStep
	// 	});
	// };

	handleBack = () => {
		this.setState(state => ({
			activeStep: state.activeStep - 1
		}));
	};

	handleStep = step => () => {
		this.setState({
			activeStep: step
		});
	};

	handleComplete = () => {
		// eslint-disable-next-line react/no-access-state-in-setstate
		const completed = new Set(this.state.completed);
		completed.add(this.state.activeStep);
		this.setState({
			completed
		});

		/**
		 * Sigh... it would be much nicer to replace the following if conditional with
		 * `if (!this.allStepsComplete())` however state is not set when we do this,
		 * thus we have to resort to not being very DRY.
		 */
		if (completed.size !== this.totalSteps() - this.skippedSteps()) {
			this.handleNext();
		}
	};

	handleReset = () => {
		this.setState({
			activeStep: 0,
			completed: new Set(),
			skipped: new Set()
		});
	};

	skippedSteps() {
		return this.state.skipped.size;
	}

	isStepSkipped(step) {
		return this.state.skipped.has(step);
	}

	isStepComplete(step) {
		return this.state.completed.has(step);
	}

	completedSteps() {
		return this.state.completed.size;
	}

	allStepsCompleted() {
		return this.completedSteps() === this.totalSteps() - this.skippedSteps();
	}

	isLastStep() {
		return this.state.activeStep === this.totalSteps() - 1;
	}

	handleTab = (event, activeStep) => {
		this.setState({ activeStep });
	};
	onClickLogCall = () => {
		this.props.showLogCallModalForm(true)
	}
	//////////////////////
	render() {
		console.log(this.props)
		const { classes,
			// addCustomer,
			// updateCustomer,
			// removeCustomer
		} = this.props;
		// const { value, suggestions } = this.state;

		// const autosuggestProps = {
		// 	renderInputComponent,
		// 	suggestions: suggestions,
		// 	onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
		// 	onSuggestionsClearRequested: this.onSuggestionsClearRequested,
		// 	getSuggestionValue: this.getSuggestionValue,
		// 	renderSuggestion,
		// };
		console.log('customers', this.props.customers);
		console.log("this.props.franchisees", this.props.franchisees);
		console.log("this.props.documents", this.props.documents);

		// const {classes} = this.props;
		const steps = getSteps();
		const { activeStep, account_offering_step
		} = this.state;

		const {
			pins,
			// locationFilterValue,
			pins2,
			gmapVisible,
			// mapViewState,
			rows,
			columns,
			selection,
			tableColumnExtensions,
			tableGroupColumnExtension,
			sorting,
			editingColumnExtensions,
			currencyColumns,
			pageSize,
			pageSizes,
			amountFilterOperations,
			// groupingColumns,
			// booleanColumns,
			searchValue,
			grouping,
			// leftColumns,
			// rightColumns,
		} = this.state;

		return (
			<Fragment>
				<AppBar position="static" color="default">
					<Tabs
						value={activeStep}
						onChange={this.handleTab}
						indicatorColor="primary"
						textColor="primary"
						scrollable
						scrollButtons="auto"
					>
						{steps.map((x) =>
							(<Tab key={x} label={x} />)
						)}
					</Tabs>
				</AppBar>


				<div className={classNames(classes.layoutTable, "flex flex-col p-24 w-full h-full")} style={{ overflowY: 'auto' }}>
					{activeStep === 3 ?
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<h2>{steps[activeStep]}</h2>
							<Button
								variant="contained"
								color="primary"
								className={classNames(classes.button, "pr-24 pl-24")}
								style={{ margin: -6 }}
								onClick={this.onClickLogCall}
							>
								Log Call
										<Icon className={classes.rightIcon}>settings_phone</Icon>
							</Button>

						</div>
						:
						(
							<h2>{steps[activeStep]}</h2>
						)
					}

					<Divider variant="middle" style={{ marginTop: 24, marginBottom: 24 }} />

					{this.getStepContent(activeStep)}
				</div>

			</Fragment>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getFranchisees: Actions.getFranchisees,
		// openNewCustomerForm: Actions.openNewCustomerForm,
		// closeNewCustomerForm: Actions.closeNewCustomerForm,
		closeCustomerServiceForm: Actions.closeCustomerServiceForm,
		// openEditCustomerForm: Actions.openEditCustomerForm,
		// closeEditCustomerForm: Actions.closeEditCustomerForm,
		getDocuments: Actions.getDocuments,
		showLogCallModalForm: Actions.showLogCallModalForm
	}, dispatch);
}

function mapStateToProps({ customers, franchisees, auth }) {
	return {
		customers: customers.customersDB,
		bLoadedFranchisees: franchisees.bLoadedFranchisees,
		regionId: auth.login.defaultRegionId,
		// CustomerForm: customers.CustomerForm,
		documents: customers.customersDocuments,

		statusId: franchisees.statusId,
		Longitude: franchisees.Longitude,
		Latitude: franchisees.Latitude,
		Location: franchisees.Location,
		SearchText: franchisees.SearchText,

		accountExecutiveList: customers.accountExecutiveList,
	}
}

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomerForm)));

