import React from "react";
import { Redirect } from "react-router-dom";

class Landing extends React.Component {
   render() {
      return (
         <Redirect to='/auth/login'/>
      );
   }
}

export default Landing;
