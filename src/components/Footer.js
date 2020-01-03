import React from "react";
import { Container, Row, Col } from "reactstrap";
import { Link } from 'react-router-dom';

const Footer = () => (
   <footer className="footer">
      <Container fluid>
         <Row className="text-muted">
            <Col xs="6" className="text-left">
               <ul className="list-inline">
                  <li className="list-inline-item">
                     <Link to="/">
                        <span className="text-muted" href="#">
                           Support
                        </span>
                     </Link>
                  </li>
                  <li className="list-inline-item">
                     <Link to="/">
                        <span className="text-muted" href="#">
                           Customer
                        </span>
                     </Link>
                  </li>
                  <li className="list-inline-item">
                     <Link to="/">
                        <span className="text-muted" href="#">
                           Privacy
                        </span>
                     </Link>
                  </li>
                  <li className="list-inline-item">
                     <Link to="/">
                        <span className="text-muted" href="#">
                           Terms and Conditions
                           </span>
                     </Link>
                  </li>
               </ul>
            </Col>
            <Col xs="6" className="text-right">
               <p className="mb-0">
                  &copy; {new Date().getFullYear()} -{" "}
                  <span href="/" className="text-muted">
                     JobTrackerBoard
            </span>
               </p>
            </Col>
         </Row>
      </Container>
   </footer>
);

export default Footer;
