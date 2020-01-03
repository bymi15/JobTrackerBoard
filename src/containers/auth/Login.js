import React from "react";
import { connect } from 'react-redux';
import { login } from '../../actions/api_auth';
import { Link } from 'react-router-dom';

import {
   Col,
   Button,
   Card,
   CardBody,
   Form,
   FormGroup,
   Label,
   Input
} from "reactstrap";

import "../../assets/css/Auth.css";

class Login extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         username: '',
         password: ''
      };
   }

   componentWillUnmount() {
      if (this.props.error) {
         //this.props.clear_errors_dispatch();
      }
   }

   handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
   }

   resetForm() {
      this.setState({
         password: ''
      });
   }

   handleSubmit = (e) => {
      e.preventDefault();
      const data = {
         username: this.state.username,
         password: this.state.password
      };
      this.resetForm();
      this.props.login(data);
   }

   render() {
      const { error } = this.props;
      var firstError = null;
      if(error){
         const errors = Object.values(error);
         firstError = errors[0];
      }
      return (
         <Col sm="10" md="8" lg="6" className="mx-auto d-table h-100">
            <div className="d-table-cell align-middle">
               <div className="text-center mt-4">
                  <h2 className="auth_head">JTB - Job Tracker Board!</h2>
                  <p className="lead auth_desc">Please enter your login details</p>
               </div>

               <Card className="auth_card mb-3">
                  <CardBody className="pt-0">
                     <div className="m-sm-4">
                        <Form onSubmit={this.handleSubmit}>
                           <FormGroup>
                              <Label>Username</Label>
                              <Input
                                 bsSize="lg"
                                 type="text"
                                 name="username"
                                 placeholder="Enter your username"
                                 value={this.state.username}
                                 onChange={this.handleChange}
                              />
                           </FormGroup>
                           <FormGroup>
                              <Label>Password</Label>
                              <Input
                                 bsSize="lg"
                                 type="password"
                                 name="password"
                                 placeholder="Enter your password"
                                 value={this.state.password}
                                 onChange={this.handleChange}
                              />
                              <small>
                                 <Link to="/auth/reset-password">Forgot your password?</Link>
                              </small>
                           </FormGroup>
                           <div className="text-center mt-3">
                              <Button color="primary" size="lg" type="submit">Login</Button>
                           </div>
                        </Form>
                     </div>
                  </CardBody>
               </Card>

               <div className="mt-0 pt-0">
                  <p className="muted auth_desc">Don't have an account? <Link to="/auth/register">Register</Link></p>
               </div>
            </div>
         </Col>
      )
   }
}

const mapStateToProps = state => ({
   error: state.api_auth.error
});

const mapDispatchToProps = dispatch => ({
   login: (data) => dispatch(login(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
