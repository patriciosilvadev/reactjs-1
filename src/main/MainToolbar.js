import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles/index';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';


import classNames from 'classnames';
import {Avatar, Button, Icon, IconButton, ListItemIcon, ListItemText, Popover, MenuItem, Typography, Hidden} from '@material-ui/core';

import * as quickPanelActions from 'main/quickPanel/store/actions';
import * as authActions from '../auth/store/actions/login.actions';
import * as chatPanelActions from 'main/chatPanel/store/actions';

import {FuseShortcuts, FuseAnimate, FuseSearch} from '@fuse';
import {Link} from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import authService from 'services/auth'
import menuService from 'services/menu';
import * as Actions from 'auth/store/actions';

const styles = theme => ({
    root     : {
        display   : 'flex',
        alignItems: 'center',
        width     : '100%'
    },
    separator: {
        width          : 1,
        height         : 64,
        backgroundColor: theme.palette.divider
    },
    formControl:{
        '& .region-select': {
            minWidth: "150px",
            paddingRight: "15px",
            marginTop: "15px"
        }
    }
});

class MainToolbar extends Component {
    state = {
        userMenu: null,
        region : -1,
        open: false
    };

    constructor(props){
        super(props);
        if(authService.isAuthenticated()){
            this.props.initializeFromLocalStorage();
            // this.props.history.push('/profile');
        }

    }

    userMenuClick = event => {
        this.setState({userMenu: event.currentTarget});
    };

    userMenuClose = () => {
        this.setState({userMenu: null});
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
        this.props.setRegionId(event.target.value);
        localStorage.setItem('jk_DefaultRegionId',event.target.value);
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    componentDidMount() {
        if(this.props.login.IsSuccess){
            this.setState({region: this.props.login.defaultRegionId});

            if(!this.props.login.bLoadedMenu) {
                this.props.loadedMenu();
            }
        }

    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.login.IsSuccess && !nextProps.login.bLoadedMenu){
            this.setState({region: nextProps.login.defaultRegionId});
            if(!this.props.login.bLoadedMenu) {
                this.props.loadedMenu();
            }
        }
    }

    render()
    {
        const {classes, toggleQuickPanel, user, logout, openChatPanel} = this.props;
        const {userMenu} = this.state;

        return (
            <div className={classNames(classes.root, "flex flex-row")}>

                <div className="flex flex-1">
                    <FuseShortcuts/>
                </div>

                <div className="flex">
                    <FuseAnimate delay={300}>
                        <Button className="h-64" onClick={this.userMenuClick}>
                            {user.data.photoURL ?
                                (
                                    <Avatar className="" alt="user photo" src={user.data.photoURL}/>
                                )
                                :
                                (
                                    <Avatar className="">
                                        {user.data.displayName[0]}
                                    </Avatar>
                                )
                            }

                            <div className="hidden md:flex flex-col ml-12 items-start">
                                <Typography component="span" className="normal-case font-600 flex">
                                    {user.data.displayName}
                                </Typography>
                                <Typography className="text-11 capitalize" color="textSecondary">
                                    {user.role}
                                </Typography>
                            </div>

                            <Icon className="text-16 ml-12 hidden sm:flex" variant="action">keyboard_arrow_down</Icon>
                        </Button>
                    </FuseAnimate>
                    {this.props.login.IsSuccess && (
                        <form autoComplete="off">
                            <FormControl className={classes.formControl}>
                                {/*<InputLabel htmlFor="demo-controlled-open-select">Age</InputLabel>*/}
                                <Select
                                    className="region-select"
                                    open={this.state.open}
                                    onClose={this.handleClose}
                                    onOpen={this.handleOpen}
                                    value={parseInt(this.state.region)}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: 'region',
                                        id  : 'region-select'
                                    }}
                                >
                                    {this.props.login.all_regions.map((region, index)=>{
                                        return (
                                            <MenuItem key={index} style={{paddingLeft: '10px'}} value={region.RegionId}>{region.Name}</MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </form>
                    )}
                    <Popover
                        open={Boolean(userMenu)}
                        anchorEl={userMenu}
                        onClose={this.userMenuClose}
                        anchorOrigin={{
                            vertical  : 'bottom',
                            horizontal: 'center'
                        }}
                        transformOrigin={{
                            vertical  : 'top',
                            horizontal: 'center'
                        }}
                        classes={{
                            paper: "py-8"
                        }}
                    >
                        {user.role === 'guest' ? (
                            <React.Fragment>
                                {/*<MenuItem component={Link} to="/auth/signin/">*/}
                                    {/*<ListItemIcon>*/}
                                        {/*<Icon>lock</Icon>*/}
                                    {/*</ListItemIcon>*/}
                                    {/*<ListItemText className="pl-0" primary="SignIn"/>*/}
                                {/*</MenuItem>*/}
                                {/*<MenuItem component={Link} to="/register">*/}
                                    {/*<ListItemIcon>*/}
                                        {/*<Icon>person_add</Icon>*/}
                                    {/*</ListItemIcon>*/}
                                    {/*<ListItemText className="pl-0" primary="Register"/>*/}
                                {/*</MenuItem>*/}
                                <MenuItem
                                    onClick={() => {
                                        this.props.logout();
                                        this.userMenuClose();
                                        this.props.history.push('/auth/signin');
                                    }}
                                >
                                    <ListItemIcon>
                                        <Icon>input</Icon>
                                    </ListItemIcon>
                                    <ListItemText className="pl-0" primary="SignOut"/>
                                </MenuItem>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <MenuItem component={Link} to="/pages/profile" onClick={this.userMenuClose}>
                                    <ListItemIcon>
                                        <Icon>account_circle</Icon>
                                    </ListItemIcon>
                                    <ListItemText className="pl-0" primary="My Profile"/>
                                </MenuItem>
                                <MenuItem component={Link} to="/apps/mail" onClick={this.userMenuClose}>
                                    <ListItemIcon>
                                        <Icon>mail</Icon>
                                    </ListItemIcon>
                                    <ListItemText className="pl-0" primary="Inbox"/>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        logout();
                                        this.userMenuClose();
                                    }}
                                >
                                    <ListItemIcon>
                                        <Icon>exit_to_app</Icon>
                                    </ListItemIcon>
                                    <ListItemText className="pl-0" primary="Logout"/>
                                </MenuItem>
                            </React.Fragment>
                        )}
                    </Popover>

                    <div className={classes.separator}/>

                    <FuseSearch/>

                    <Hidden lgUp>
                        <div className={classes.separator}/>

                        <IconButton className="w-64 h-64" onClick={openChatPanel}>
                            <Icon>chat</Icon>
                        </IconButton>
                    </Hidden>

                    {/*<div className={classes.separator}/>*/}

                    {/*<IconButton className="w-64 h-64" onClick={() => toggleQuickPanel(true)}>*/}
                    {/*<Icon>format_list_bulleted</Icon>*/}
                    {/*</IconButton>*/}
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        toggleQuickPanel: quickPanelActions.toggleQuickPanel,
        logout          : authActions.logoutUser,
        setRegionId     : authActions.changeRegionId,
        openChatPanel   : chatPanelActions.openChatPanel,
        initializeFromLocalStorage: Actions.initializeFromLocalStorage,
        loadedMenu: authActions.loadedMenu
    }, dispatch);
}


function mapStateToProps({auth})
{
    return {
        user: auth.user,
        login: auth.login,
    }
}

export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps, mapDispatchToProps)(MainToolbar)));
