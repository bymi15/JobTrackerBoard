import React from "react";

import {
   Row,
   Col,
   Card,
   CardBody,
   CardText
} from "reactstrap";

import { Draggable } from "react-beautiful-dnd";
import LetterAvatar from "../../../components/LetterAvatar";

import { Trash2 } from "react-feather";

import Moment from 'react-moment';

class Job extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         isHovering: false
      };
   }

   handleMouseEnter = () => {
      this.setState({
         isHovering: true
      });
   }

   handleMouseLeave = () => {
      this.setState({
         isHovering: false
      });
   }

   deleteApplication = (e, id, board_list_id) => {
      e.stopPropagation(); //prevents event from bubbling up (parent container onClick event is not triggered)
      this.props.deleteApplication(id, board_list_id);
   }

   render(){
      const { application, index } = this.props;
      const { isHovering } = this.state;

      return (
         <Draggable draggableId={String(application.id)} index={index}>
            {provided => (
               <Card onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} className="mb-3 bg-light cursor-grab" innerRef={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  <CardBody className="p-3 pt-4">
                     <Row>
                        <Col xs="2">
                           <CardText style={{paddingRight: '10px'}}>
                              {
                                 application.icon ? <img src={application.icon} width="44" height="44" className="rounded-circle"/>
                                 : <LetterAvatar name={application.company_name} size={44} radius={44} inline/>
                              }
                           </CardText>
                        </Col>
                        <Col xs="10">
                           <div className="float-right mr-n2">
                              <Trash2 className={(isHovering ? 'delete-icon' : 'hidden-icon') + " align-middle ml-3 mr-2"} size={20} onClick={(e) => {this.deleteApplication(e, application.id, application.board_list.id)}}></Trash2>
                           </div>
                           <CardText className="job-company-name mb-2">{application.company_name}</CardText>
                           <CardText className="job-role text-muted">{application.role}</CardText>
                           <div className="float-right">
                              <small className="lighter-text">Added <Moment fromNow>{application.created_at}</Moment></small>
                           </div>
                        </Col>
                     </Row>
                  </CardBody>
               </Card>
            )}
         </Draggable>
      )
   }
}

export default Job;