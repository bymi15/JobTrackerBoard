import React from "react";
import { connect } from "react-redux";
import { logout } from '../actions/api_auth';
import { NavLink, Link } from 'react-router-dom';

import LetterAvatar from "./LetterAvatar";

import "../assets/css/Navbar.css";

import {
    Collapse,
    Navbar,
    Nav,
    NavbarBrand,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";

import {
    Bell,
    Settings,
    User,
    HelpCircle
} from "react-feather";

class NavbarComponent extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <Collapse navbar>
                <Nav className="ml-auto" navbar>
                    <UncontrolledDropdown nav inNavbar>
                        <span className="d-inline-block d-sm-none">
                            <DropdownToggle nav caret>
                                <Settings size={18} className="align-middle" />
                            </DropdownToggle>
                        </span>
                        <span className="d-none d-sm-inline-block">
                            <DropdownToggle nav caret>
                                <LetterAvatar name={user ? (user.username) : ''} size={44} radius={44} customColor={[72, 182, 172]} inline/>
                                <span className="ml-2 text-dark">{user ? (user.username) : ''}</span>
                            </DropdownToggle>
                        </span>
                        <DropdownMenu right>
                            <Link to="/profile/settings">
                                <DropdownItem>
                                    <User size={18} className="align-middle mr-2" />
                                    Profile
                                </DropdownItem>
                            </Link>
                            <DropdownItem divider />
                            <Link to="/profile/settings">
                                <DropdownItem>
                                    <Settings size={18} className="align-middle mr-2" />
                                    Settings
                                </DropdownItem>
                            </Link>
                            <Link to="/help">
                                <DropdownItem>
                                    <HelpCircle size={18} className="align-middle mr-2" />
                                    Help
                                </DropdownItem>
                            </Link>
                            <DropdownItem onClick={this.props.logout}>Logout</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            </Collapse>
        );

        const guestLinks = (
            <Collapse navbar>
                <Nav className="ml-auto" navbar>
                    <NavLink className="nav-link" to="/auth/login">Login</NavLink>
                    <NavLink className="nav-link" to="/auth/register">Register</NavLink>
                </Nav>
            </Collapse>
        );

        return (
            <Navbar color="white" light expand>
                <LetterAvatar name="J" size={32} radius={32} inline/>
                <NavbarBrand className="ml-2 d-flex justify-content-center" href="/">JobTrackerBoard</NavbarBrand>
                {(isAuthenticated) ? authLinks : guestLinks}
            </Navbar>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.api_auth
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(NavbarComponent);