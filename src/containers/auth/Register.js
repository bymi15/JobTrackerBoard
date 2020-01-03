import React from "react";
import { connect } from 'react-redux';
import { register } from '../../actions/api_auth';
import { Link, Redirect } from 'react-router-dom';

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

class Register extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         email: "",
         first_name: "",
         last_name: "",
         username: "",
         password: "",
         password2: "",
         profile: { university: "", date_of_birth: "" }
      };
   }
   
   handleChangeProf = (e) => {
      const { name, value } = e.target;
      this.setState({ profile: { ...this.state.profile, [name]: value } });
      console.log(this.state);
   }

   handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
   }

   resetForm() {
      this.setState({
         password: "",
         password2: "",
      });
   }

   handleSubmit = (e) => {
      e.preventDefault();
      const data = this.state;
      this.resetForm();
      this.props.register(data);
   }

   render() {
      const { auth } = this.props;
      if (auth.isAuthenticated) {
         return <Redirect to='/dashboard' />;
      }

      return (
         <Col sm="10" md="10" lg="10" className="mx-auto d-table h-100">
            <div className="d-table-cell align-middle">
               <div className="text-center">
                  <h1 className="auth_head">Register</h1>
                  <p className="lead auth_desc">Let's begin our journey to find our dream job!</p>
               </div>
               <Card className="auth_card mb-3">
                  <CardBody>
                     <Form onSubmit={this.handleSubmit}>
                        <div className="row p-sm-4">
                           <div className="col-md-6">
                              <FormGroup>
                                 <Label>First Name</Label>
                                 <Input
                                    bsSize="lg"
                                    type="text"
                                    name="first_name"
                                    placeholder="Enter your first name"
                                    onChange={this.handleChange}
                                 />
                              </FormGroup>
                              <FormGroup>
                                 <Label>Last Name</Label>
                                 <Input
                                    bsSize="lg"
                                    type="text"
                                    name="last_name"
                                    placeholder="Enter your last name"
                                    onChange={this.handleChange}
                                 />
                              </FormGroup>
                              <FormGroup>
                                 <Label>University</Label>
                                 <Input
                                    bsSize="lg"
                                    type="text"
                                    name="university"
                                    placeholder="Enter your highest degree of education"
                                    onChange={this.handleChangeProf}
                                 />
                              </FormGroup>
                              <FormGroup>
                                 <Label>Date of Birth</Label>
                                 <Input
                                    bsSize="lg"
                                    type="date"
                                    name="date_of_birth"
                                    placeholder="Enter your date of birth"
                                    onChange={this.handleChangeProf}
                                 />
                              </FormGroup>
                           </div>
                           
                           <div className="col-md-6">
                              <FormGroup>
                                 <Label>Email Address</Label>
                                 <Input
                                    bsSize="lg"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    onChange={this.handleChange}
                                 />
                              </FormGroup>
                              <FormGroup>
                                 <Label>Username</Label>
                                 <Input
                                    bsSize="lg"
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
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
                              </FormGroup>
                              <FormGroup>
                                 <Label>Confirm Password</Label>
                                 <Input
                                    bsSize="lg"
                                    type="password"
                                    name="password2"
                                    placeholder="Confirm your password"
                                    value={this.state.password2}
                                    onChange={this.handleChange}
                                 />
                              </FormGroup>
                           </div>
                        </div>
                        <div className="text-center">
                           <Button type="submit" color="primary" size="lg">Register</Button>
                        </div>
                     </Form>
                  </CardBody>
               </Card>
               <div className="mt-0 pt-0">
                  <p className="muted auth_desc">Already have an account? <Link to="/auth/login">Login</Link></p>
               </div>
            </div>
         </Col>
      )
   }
}

const mapStateToProps = state => ({
   auth: state.api_auth,
});

const mapDispatchToProps = (dispatch) => ({
   register: (data) => dispatch(register(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);
