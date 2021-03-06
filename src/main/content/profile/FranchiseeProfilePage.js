import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom';

import {FusePageSimple, FuseAnimate} from '@fuse';
import {Avatar, Button, Tab, Tabs, Typography} from '@material-ui/core';
import TimelineTab from 'main/content/profile/tabs/TimelineTab';
import PhotosVideosTab from 'main/content/profile/tabs/PhotosVideosTab';
import AboutTab from 'main/content/profile/tabs/AboutTab';
import FranchiseeAboutTab from 'main/content/profile/tabs/FranchiseeAboutTab';
import SettingsPanel from "main/content/profile/tabs/SettingsPanel";


const styles = theme => ({
    bigAvatar: {
        width: 170,
        height: 170,
      },
    layoutRoot   : {},
    layoutToolbar: {
        padding: 0
    },
    layoutHeader : {
        height                        : 200,
        minHeight                     : 200,
        background                    : "url('/assets/images/backgrounds/dark-material-bg.jpg') no-repeat",
        backgroundSize                : 'cover',
        color                         : '#fff',
        [theme.breakpoints.down('md')]: {
            height   : 240,
            minHeight: 240
        }
    },
    tabsRoot     : {
        height: 50,
        width : '100%'
    },
    tabRoot      : {
        height: 50
    }
});

class FranchiseeProfilePage extends Component {

    state = {
        value: 0
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    render()
    {
        const {classes} = this.props;
        const {value} = this.state;
        return (
            <FusePageSimple
                classes={{
                    root   : classes.layoutRoot,
                    header : classes.layoutHeader,
                    toolbar: classes.layoutToolbar
                }}
                header={
                    <div className="p-4 flex flex-1 flex-col items-center justify-center md:flex-row md:items-end">
                        <div className="p-4 flex flex-1 flex-col items-center justify-center md:flex-row">
                            <FuseAnimate animation="transition.expandIn" delay={300}>
                                <Avatar align= "center" className={classes.bigAvatar} src={this.props.login.profilePhoto}/>
                            </FuseAnimate>
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography className="md:ml-24" variant="h4" color="inherit">{this.props.login.firstName}&nbsp;&nbsp;{this.props.login.lastName}</Typography>
                            </FuseAnimate>
                        </div>

                        {/* <div className="flex items-center justify-end">
                            <Button className="mr-8 mb-24 normal-case" variant="contained" color="secondary" aria-label="Follow">Follow</Button>
                            <Button className="mb-24 normal-case" variant="contained" color="primary" aria-label="Send Message">Send Message</Button>
                        </div> */}
                    </div>
                }
                contentToolbar={
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        indicatorColor="secondary"
                        textColor="secondary"
                        scrollable
                        scrollButtons="auto"
                        classes={{
                            root: classes.tabsRoot
                        }}
                    >
                        <Tab
                            classes={{
                                root: classes.tabRoot
                            }} label="About"/>
                        {/* <Tab
                            classes={{
                                root: classes.tabRoot
                            }}
                            label="Timeline"/>
                        <Tab
                            classes={{
                                root: classes.tabRoot
                            }} label="Photos & Videos"/>
                        <Tab
                            classes={{
                                root: classes.tabRoot
                            }} label="Settings Panel"/> */}
                    </Tabs>
                }
                content={
                    <div className="p-16 sm:p-24">
                        {value === 0 && (
                            <FranchiseeAboutTab/>
                        )}
                        {value === 1 &&
                        (
                            <TimelineTab/>
                        )}
                        {value === 2 && (
                            <PhotosVideosTab/>
                        )}
                        {value === 3 && (
                            <SettingsPanel/>
                        )}
                    </div>
                }
            />
        )
    };
}

function mapStateToProps({auth})
{
    return {
       login: auth.login
    }
}
export default withStyles(styles, {withTheme: true})(withRouter(connect(mapStateToProps)(FranchiseeProfilePage)));
