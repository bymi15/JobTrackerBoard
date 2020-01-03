import React from "react";
import Main from "../components/Main";
import Footer from "../components/Footer";

class Landing extends React.Component {
    render() {
        const { children } = this.props;
        return (
            <React.Fragment>
                <Main>{children}</Main>
                <Footer />
            </React.Fragment>
        );
    }
}

export default Landing;