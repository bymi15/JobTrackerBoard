import React from "react";
import { MapPin } from "react-feather";
import { Popover, PopoverHeader, PopoverBody } from 'reactstrap';

class Pin extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         isOpen: false
      };
   }

   toggle = () => {
      this.setState(prevState => ({
         isOpen: !prevState.isOpen
      }))
   }

   handleMouseEnter = () => {
      this.setState({
         isOpen: true
      });
   }

   handleMouseLeave = () => {
      this.setState({
         isOpen: false
      });
   }

   render() {
      const { id, company_name, address } = this.props;
      return (
         <div className="pin">
            <MapPin id={"pin"+id} size={34} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}/>
            <Popover placement="bottom" isOpen={this.state.isOpen} target={"pin"+id} toggle={this.toggle}>
               <PopoverHeader>{company_name}</PopoverHeader>
               <PopoverBody>{address}</PopoverBody>
            </Popover>
         </div>
      );
   }
}

export default Pin;
