import React from "react";

import { Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import Main from "../components/Main";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";

import { CSSTransition, TransitionGroup } from 'react-transition-group';
import "../assets/css/Dashboard.css";
import '../assets/css/Animations.css';

class Dashboard extends React.Component{
    render(){
        const { children, auth, selectedBoard, applications, location } = this.props;
        if (auth.isAuthenticated) {
            return (
                <React.Fragment>
                    <div className="wrapper">
                        <Main>
                            <Navbar />
                            {location.pathname ==='/dashboard' ? '' : <Topbar /> }
                            <TransitionGroup>
                                <CSSTransition key={location.key} timeout={300} classNames="fade">
                                    <div>{children}</div>
                                </CSSTransition>
                            </TransitionGroup>
                        </Main>
                    </div>
                </React.Fragment>
            );
        }else{
            return <Redirect to='/' />
        }
    }
}

const mapStateToProps = state => ({
    auth: state.api_auth,
    selectedBoard: state.dashboard.board,
    applications: state.api_application.applications
});

export default withRouter(connect(mapStateToProps)(Dashboard));