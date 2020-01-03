import React from "react";
import { Link } from "react-router-dom";

import {
   Badge,
   Button,
   Card,
   CardBody,
   CardImg,
   Col,
   Container,
   Row
} from "reactstrap";

import {
   Chrome,
   Code,
   Download,
   Mail,
   Sliders,
   Smartphone
} from "react-feather";

class Landing extends React.Component {
   constructor(props) {
      super(props);
   }
   
   render(){ 
      const Intro = () => (
         <section className="landing-intro pt-6 pt-xl-7">
            <Container>
               <Row>
                  <Col md="12" lg="9" xl="11" className="mx-auto">
                     <Row>
                        <Col xl="5">
                           <div style={{ paddingTop: "18px" }}>
                              <span style={{ letterSpacing: '2px', fontSize: '28px', color: 'gold' }}>Job Tracker Board</span><br />
                              <span style={{ letterSpacing: '2px', fontSize: '14px', color: 'gold' }}>JTB</span>
                           </div>
      
                           <p className="text-white my-4" style={{ letterSpacing: '1px' }}>
                              Organise and track your job applications<br />
                              All in one drag and drop board
                           </p>
                           <div className="my-4">
                              <Link to="/auth/login">
                                 <Button color="light" size="lg" className="mr-2">
                                    Login
                                 </Button>
                              </Link>
                              <Link to="/auth/register">
                                 <Button color="light" outline size="lg" className="mr-2">
                                    Register
                                 </Button>
                              </Link>
                              <Button onClick={this.toggleJobModal} color="light" size="lg" className="mr-2">
                                 TEST
                              </Button>
                           </div>
      
                           <div className="my-5">
                              <div className="d-inline-block mr-3">
                                 <h2 className="text-white">300+</h2>
                                 <span className="text-muted">Active Boards</span>
                              </div>
                              <div className="d-inline-block mr-3">
                                 <h2 className="text-white">1000+</h2>
                                 <span className="text-muted">Users</span>
                              </div>
                              <div className="d-inline-block">
                                 <h2 className="text-white">15+</h2>
                                 <span className="text-muted">Platforms</span>
                              </div>
                           </div>
                        </Col>
                     </Row>
                  </Col>
               </Row>
            </Container>
         </section>
      );
      
      const Features = () => (
         <section className="py-6">
            <Container>
               <Row>
                  <Col md="10" className="mx-auto text-center">
                     <div className="mb-3">
                        <h2>Features</h2>
                        <p className="text-muted">
                           The core features of JobTrackerBoard
                        </p>
                     </div>
      
                     <Row>
                        <Col md="6" lg="4">
                           <div className="my-4">
                              <Smartphone className="landing-features-icon" />
                              <h5 className="mt-2 font-weight-bold">Responsive</h5>
      
                              <p className="text-muted">
                                 With mobile, tablet & desktop support it doesn't matter what
                                 device you're using. Our themes are responsive in all
                                 browsers.
                              </p>
                           </div>
                        </Col>
                        <Col md="6" lg="4">
                           <div className="my-4">
                              <Sliders className="landing-features-icon" />
                              <h5 className="mt-2 font-weight-bold">Customizable</h5>
      
                              <p className="text-muted">
                                 You don't need to be an expert to customize our themes. Our
                                 code is very readable and well documented.
                              </p>
                           </div>
                        </Col>
                        <Col md="6" lg="4">
                           <div className="my-4">
                              <Mail className="landing-features-icon" />
                              <h5 className="mt-2 font-weight-bold">Quick support</h5>
      
                              <p className="text-muted">
                                 Our themes are supported by specialists who provide quick and
                                 effective support. Usually an email reply takes &lt;24h.
                              </p>
                           </div>
                        </Col>
                        <Col md="6" lg="4">
                           <div className="my-4">
                              <Chrome className="landing-features-icon" />
                              <h5 className="mt-2 font-weight-bold">Cross browser</h5>
      
                              <p className="text-muted">
                                 Our themes are working perfectly with: Chrome, Firefox,
                                 Safari, Opera and IE 10+. We're working hard to support them.
                              </p>
                           </div>
                        </Col>
                        <Col md="6" lg="4">
                           <div className="my-4">
                              <Code className="landing-features-icon" />
                              <h5 className="mt-2 font-weight-bold">Clean code</h5>
      
                              <p className="text-muted">
                                 We strictly followed Bootstrap's guidelines to make your
                                 integration as easy as possible. All code is handwritten.
                              </p>
                           </div>
                        </Col>
                        <Col md="6" lg="4">
                           <div className="my-4">
                              <Download className="landing-features-icon" />
                              <h5 className="mt-2 font-weight-bold">Free updates</h5>
      
                              <p className="text-muted">
                                 From time to time you'll receive an update containing new
                                 components, improvements and bugfixes.
                              </p>
                           </div>
                        </Col>
                     </Row>
                  </Col>
               </Row>
            </Container>
         </section>
      );
      
      const Testimonials = () => (
         <section className="py-6 bg-white">
            <Container>
               <Row>
                  <Col md="9" className="mx-auto text-center">
                     <div className="mb-4">
                        <h2>Testimonials</h2>
                        <p className="text-muted">
                           What others are saying about JobTrackerBoard
                        </p>
                     </div>
      
                     <Card className="bg-light border-0">
                        <CardBody>
                           <blockquote className="blockquote mb-0">
                              <p className="mb-2">
                                 I was able to land my dream job at Google through this platform!
                                 The drag and drop functionality is truly amazing and the UI
                                 is really smooth and user-friendly. I would totally recommend
                                 this to anyone out there looking for jobs.
                              </p>
                              <footer className="blockquote-footer">
                                 Brian Min at{" "}
                                 <cite title="UCL">UCL</cite>
                              </footer>
                           </blockquote>
                        </CardBody>
                     </Card>
                     <Card className="bg-light border-0">
                        <CardBody>
                           <blockquote className="blockquote mb-0">
                              <p className="mb-2">
                                 We are totally amazed with a simplicity and the design of
                                 JobTrackerBoard. Nice and clean. Totally recommended to
                                 anyone! The best part about this application is the ability
                                 to log interview details and review them later in the future.
                                 It really helps improve and eventually leads to landing that
                                 dream job.
                              </p>
                              <footer className="blockquote-footer">
                                 Larry Page at{" "}
                                 <cite title="Google">Google</cite>
                              </footer>
                           </blockquote>
                        </CardBody>
                     </Card>
                  </Col>
               </Row>
            </Container>
         </section>
      );
      
      const Footer = () => (
         <section className="py-5">
            <Container className="text-center">
               <h2 className="mb-0">
                  Trusted by over 2500+ customers world wide
                  <a
                     href="/auth/login"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="align-middle btn btn-primary btn-lg ml-2 mt-n1"
                  >
                     Try now!
                  </a>
               </h2>
            </Container>
         </section>
      );

      return (
         <React.Fragment>
            <Intro />
            <Features />
            <Testimonials />
            <Footer />
         </React.Fragment>
      );
   }
}

export default Landing;