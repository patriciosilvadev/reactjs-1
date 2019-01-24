import React, {Component} from 'react';
import {MuiThemeProvider, withStyles} from '@material-ui/core/styles/index';
import {
    Fab,
    Icon, Input, Paper,
    Typography
} from '@material-ui/core';
import * as Actions from './store/actions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {FuseAnimate, FuseSelectedTheme} from '@fuse';

const headerHeight = 80;

const styles = theme => ({
    root: {},
    sideButton          : {
        backgroundColor: theme.palette.primary.light,
        height: 46,
        width: 46,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        }
    },
    search: {
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            width: '100%'
        }
    },
    layoutSidebarHeader: {
        height   : headerHeight,
        minHeight: headerHeight,
        display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.secondary.main,
    }
});

class UsersHeader extends Component {

    state = {
        openUsersFormStatus: false
    }

    componentWillMount() {
        this.setState({
            "openUsersFormStatus": this.props.openUsersFormStatus
        })
    }

    toggleForm = (param) =>(event) => {
        this.props.openUsersForm(param);
        this.setState({
            "openUsersFormStatus": param
        })
    }

    render()
    {
        const {classes, setSearchText, searchText, pageLayout } = this.props;
        const {openUsersFormStatus} = this.state;
        return (

        <div className="flex row flex-1  p-8 sm:p-12 relative justify-between">

                <div className="flex row flex-1  p-8 sm:p-12 relative justify-between">
                    <div className="flex flex-row flex-1 justify-between">

                        <div className="flex w-full items-center">
                            {!openUsersFormStatus && (
                                <div className="flex items-center">
                                    <FuseAnimate animation="transition.expandIn" delay={300}>
                                        <Icon className="text-32 mr-12">account_box</Icon>
                                    </FuseAnimate>
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="h6" className="hidden sm:flex">Settings | Users</Typography>
                                    </FuseAnimate>
                                </div>
                            )}
                            {openUsersFormStatus && (
                                <div className="flex items-center">
                                    <FuseAnimate animation="transition.expandIn" delay={300}>
                                        <Icon className="text-32 mr-12">account_box</Icon>
                                    </FuseAnimate>
                                    <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                        <Typography variant="h6" className="hidden sm:flex">Settings | New User</Typography>
                                    </FuseAnimate>
                                </div>
                            )}
                        </div>
                        <div className="flex w-full items-center">
                            {!openUsersFormStatus && (
                                <div className="flex items-center w-full h-44 mr-12 ml-12">
                                    <Paper className={"flex items-center h-44 w-full xs:mr-0"}>
                                        <Input
                                            placeholder="Search for users..."
                                            className={classNames(classes.search, 'pl-16')}
                                            disableUnderline
                                            fullWidth
                                            //value={this.state.s}
                                            //onChange={this.handleChange('s')}
                                            inputProps={{
                                                'aria-label': 'Search'
                                            }}
                                        />
                                        <Icon color="action" className="flex justify-center mr-12">search</Icon>
                                    </Paper>
                                </div>
                            )}
                        </div>
                        <div className="flex w-full items-center justify-end">
                            {! openUsersFormStatus && (
                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Fab
                                        color="secondary"
                                        aria-label="add-user"
                                        className={classNames(classes.sideButton, "mr-12")}
                                        onClick={this.toggleForm(true)}
                                    >
                                        <Icon>person_add</Icon>
                                    </Fab>
                            </FuseAnimate>
                            )}
                            { openUsersFormStatus && (
                                <FuseAnimate animation="transition.expandIn" delay={300}>
                                    <Fab
                                        color="secondary"
                                        aria-label="close-user-form"
                                        className={classNames(classes.sideButton, "mr-12")}
                                        onClick={this.toggleForm(false)}
                                    >
                                        <Icon>close</Icon>
                                    </Fab>
                                </FuseAnimate>
                            )}
                        </div>
                    </div>
                </div>

        </div>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        setSearchText: Actions.setSearchText,
        openUsersForm : Actions.openUsersForm
    }, dispatch);
}

function mapStateToProps({contactsApp, usersApp})
{
    return {
        searchText     : contactsApp.contacts.searchText,
        openUsersFormStatus: usersApp.users.openUsersFormStatus
    }
}

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(UsersHeader));
