import React from 'react';
import PropTypes from "prop-types";
import LetterAvatar from "./LetterAvatar";

import {
   Input,
   InputGroup,
   InputGroupAddon,
   InputGroupText,
   ListGroup,
   ListGroupItem
} from "reactstrap";

import PerfectScrollbar from "react-perfect-scrollbar";

import { Search } from "react-feather";

class CompanySearchText extends React.Component {
   constructor(props) {
      super(props)

      this.state = {
         showResults: false,
      }
      
      this.inputRef = React.createRef();
   }

   handleClick = () => {
      this.setState({
         showResults: true,
      })
   }

   handleBlur = () => {
      setTimeout(() => {
         this.setState({
            showResults: false,
         })
      },100)
   }

   handleEnterKey = (e) => {
      if (e.keyCode === 13 || e.charCode == 13) {
         this.handleBlur();
      }
   };

   render() {
      const { name, value, placeholder, onChange, logo_url, companies, handleSelectCompany } = this.props;
      const { showResults } = this.state;

      if (showResults && companies && companies.length > 0) {
         return (
            <React.Fragment>
               <InputGroup className="mb-3">
                  <Input 
                     ref={this.inputRef}
                     onChange={onChange}
                     placeholder={placeholder}
                     type="text"
                     name={name}
                     value={value}
                     onClick={this.handleClick}
                     onBlur={this.handleBlur}
                     onKeyPress={this.handleEnterKey}
                     autoComplete="off"
                     autoFocus
                  />
                  <InputGroupAddon addonType="append">
                     <InputGroupText>
                        {
                           logo_url ? <img src={logo_url} width="20" height="20" className="rounded-circle"/>
                           : <Search size={18}/>
                        }
                     </InputGroupText>
                  </InputGroupAddon>
               </InputGroup>
               
               <PerfectScrollbar component="ul" options={{suppressScrollX: true}} style={{maxHeight: "200px", paddingLeft: "0px", paddingRight: "12px"}}>
                  <ListGroup>
                  {
                     companies ? companies.map(company => (
                        <ListGroupItem key={company.id} tag="button" action onMouseDown={() => {handleSelectCompany(company)}}>
                           {
                              company.logo_url ? <img src={company.logo_url} width="24" height="24" className="rounded-circle"/>
                              : <LetterAvatar name={company.name} size={24} radius={24} inline/>
                           }
                           <span className="ml-2">{company.name}</span>
                        </ListGroupItem>
                     )) : ''
                  }
                  </ListGroup>
               </PerfectScrollbar>
            </React.Fragment>
         )
      } else {
         return (
            <InputGroup>
               <Input 
                  ref={this.inputRef}
                  onChange={onChange}
                  placeholder={placeholder}
                  type="text"
                  name={name}
                  value={value}
                  onClick={this.handleClick}
                  onBlur={this.handleBlur}
                  onKeyPress={this.handleEnterKey}
                  autoComplete="off"
                  autoFocus
               />
               <InputGroupAddon addonType="append">
                  <InputGroupText>
                     {
                        logo_url ? <img src={logo_url} width="20" height="20" className="rounded-circle"/>
                        : <Search size={18}/>
                     }
                  </InputGroupText>
               </InputGroupAddon>
            </InputGroup>
         )
      }
   }
}

CompanySearchText.propTypes = {
   name: PropTypes.string.isRequired,
   placeholder: PropTypes.string,
   value: PropTypes.string,
   handleSelectCompany: PropTypes.func.isRequired
};

export default CompanySearchText;