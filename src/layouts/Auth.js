import React from "react";

import { Container, Row } from "reactstrap";

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Main from "../components/Main";

import "../assets/css/Auth.css";

class Auth extends React.Component {
    render() {
        const { auth, children } = this.props;
        if (auth.isAuthenticated) {
            return <Redirect to='/dashboard' />
        } else {
            return (
                <React.Fragment>
                    <Main className="auth d-flex w-100">
                        <Container className="d-flex flex-column">
                            <Row className="h-100">
                                {children}
                            </Row>
                        </Container>
                    </Main>
                </React.Fragment>
            );
        }
    }
}

const mapStateToProps = state => ({
    auth: state.api_auth
});

export default connect(mapStateToProps)(Auth);