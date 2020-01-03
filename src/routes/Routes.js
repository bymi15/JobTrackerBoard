import React from "react";
import { Redirect, BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from 'react-redux';
import {
    landingRoutes,
    authRoutes,
    secureRoutes
} from "./index";

import LandingLayout from "../layouts/Landing";
import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";

import ScrollToTop from "../components/ScrollToTop";

import { createBrowserHistory } from 'history';
const history = createBrowserHistory()

class Routes extends React.Component {
    render() {
        const mapRoutes = (Layout, routes) =>
            routes.map(({ children, path, component: Component }, index) =>
                children ? (
                    // Route item with children
                    children.map(({ path, component: Component }, index) => (
                        <Route
                            key={index}
                            path={path}
                            exact
                            render={props => (
                                <Layout>
                                    <Component {...props} />
                                </Layout>
                            )}
                        />
                    ))
                ) : (
                    // Route item without children
                    <Route
                        key={index}
                        path={path}
                        exact
                        render={props => (
                            <Layout>
                                <Component {...props} />
                            </Layout>
                        )}
                    />
                )
            );

        return (
            <Router history={history}>
                <ScrollToTop>
                    <Switch>
                        {mapRoutes(AuthLayout, authRoutes)}
                        {mapRoutes(LandingLayout, landingRoutes)}
                        {mapRoutes(DashboardLayout, secureRoutes)}

                        {/* INVALID ROUTES WILL LAND HERE AND REDIRECT ACCORDINGLY */}
                        <Redirect to='/' />
                    </Switch>
                </ScrollToTop>
            </Router>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.api_auth
});

export default connect(mapStateToProps)(Routes);