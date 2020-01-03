import React from "react";
import classnames from "classnames";

import {
   Button,
   Modal,
   ModalHeader,
   Card,
   CardBody,
   CardTitle,
   CardText,
   CardHeader,
   TabPane,
   TabContent,
   Nav,
   Input,
   NavItem,
   NavLink,
   Row,
   Col
} from "reactstrap";

import LetterAvatar from "../../../components/LetterAvatar";

import PerfectScrollbar from "react-perfect-scrollbar";
import TextareaAutosize from 'react-autosize-textarea';
import EditableText from "../../../components/EditableText";
import EditableTextArea from "../../../components/EditableTextArea";

import Moment from 'react-moment';

import { Trash, MessageSquare } from "react-feather";
import { faThumbsUp, faThumbsDown, faSquare, faSmile, faFrown, faMeh, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { confirmDialog } from '../../../helpers/confirmDialog';
import AddInterviewModal from "./AddInterviewModal";

class JobModal extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         questions: {},
         addInterviewModal: false,
         activeTab: "1"
      };

      this.noteRef = React.createRef();
   }

   openAddInterviewModal = () => {
		this.setState({
         addInterviewModal: true
		})
   }

	toggleAddInterviewModal = () => {
      this.setState(prevState => ({
         addInterviewModal: !prevState.addInterviewModal
      }));
   }

   updateApplication = (name, value) => {
      const data = {
         [name]: value
      }
      this.props.updateApplication(data);
   }

   addInterview = (data) => {
      if(this.props.application){
         data.application = this.props.application.id;
         this.props.addInterview(data);
         this.toggleAddInterviewModal();
      }
   }

   addNote = () => {
      const val = this.noteRef.current.value.trim();
      if(this.props.application && val){
         const data = {
            application: this.props.application.id,
            text: val
         }
         this.props.addNote(data);
         this.noteRef.current.value = '';
      }
   }

   addQuestion = (interview_id) => {
      if(this.state.questions[interview_id]){
         const val = this.state.questions[interview_id].trim();
         if(val){
            const data = {
               interview: interview_id,
               text: val
            }
            this.props.addQuestion(data);
            this.setState({questions: {[interview_id]: ''}});
         }else{
            this.setState({questions: {[interview_id]: ''}});
         }
      }
   }

   deleteNote = (id) => {
      confirmDialog('Delete Note', 'Are you sure you want to delete this note?', () => { 
         this.props.deleteNote(id);
      })
   }

   deleteInterview = (id) => {
      confirmDialog('Delete Interview', 'Are you sure you want to delete this interview?', () => { 
         this.props.deleteInterview(id);
      })
   }

   toggleTab = (tab) => {
      if (this.state.activeTab !== tab) {
         this.setState({
            activeTab: tab
         });
      }
   }

   handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
   }

   handleQuestionChange = (e, interview_id) => {
      const { value } = e.target;
      this.setState({ questions: { [interview_id]: value }});
   }

   parseResult = (result) => {
      if(result === null){
         return (
            <React.Fragment><FontAwesomeIcon className="neutral-icon interview-icon" icon={faSquare}/> <span className="interview-icon-text">Pending Result</span></React.Fragment>
         )
      }
      if(result){
         return (
            <React.Fragment><FontAwesomeIcon className="positive-icon interview-icon" icon={faCheck}/> <span className="interview-icon-text">Pass</span></React.Fragment>
         )
      }else{
         return (
            <React.Fragment><FontAwesomeIcon className="negative-icon interview-icon" icon={faTimes}/> <span className="interview-icon-text">Fail</span></React.Fragment>
         )
      }
   }

   parseExperience = (experience) => {
      if(experience === 'positive'){
         return (
            <React.Fragment><FontAwesomeIcon className="positive-icon interview-icon" icon={faSmile}/> <span className="interview-icon-text">Positive Experience</span></React.Fragment>
         )
      }else if(experience === 'negative'){
         return (
            <React.Fragment><FontAwesomeIcon className="negative-icon interview-icon" icon={faFrown}/> <span className="interview-icon-text">Negative Experience</span></React.Fragment>
         )
      }else if(experience === 'neutral'){
         return (
            <React.Fragment><FontAwesomeIcon className="neutral-icon interview-icon" icon={faMeh}/> <span className="interview-icon-text">Neutral Experience</span></React.Fragment>
         )
      }
   }

   parseDifficulty = (difficulty) => {
      if(difficulty === 'easy'){
         return (
            <React.Fragment><FontAwesomeIcon className="positive-icon interview-icon" icon={faThumbsUp}/> <span className="interview-icon-text">Easy Interview</span></React.Fragment>
         )
      }else if(difficulty === 'difficult'){
         return (
            <React.Fragment><FontAwesomeIcon className="negative-icon interview-icon" icon={faThumbsDown}/> <span className="interview-icon-text">Difficult Interview</span></React.Fragment>
         )
      }else if(difficulty === 'average'){
         return (
            <React.Fragment><FontAwesomeIcon className="neutral-icon interview-icon" icon={faSquare}/> <span className="interview-icon-text">Average Interview</span></React.Fragment>
         )
      }
   }

   render() {
      const { application, deleteApplication, isOpen, toggle } = this.props;
      
      return (
         <Modal isOpen={isOpen} toggle={toggle} centered>
            <AddInterviewModal 
               isOpen={this.state.addInterviewModal}
               saveModal={this.addInterview} 
               toggle={this.toggleAddInterviewModal} 
            />
            { 
               application ? 
               <Card>
                  <ModalHeader toggle={toggle}></ModalHeader>
                  <div className="job-modal-header">
                     <Row>
                        <Col xs="2">
                           <div className="job-modal-icon">
                              { application.icon ? <img src={application.icon} width="74" height="74" className="rounded-circle"/>
                              : <LetterAvatar name={application.company_name} size={74} radius={74}/> }
                           </div>
                        </Col>
                        <Col xs="10">
                           <div className="job-modal-company">{application.company_name}</div>
                           <div className="job-modal-role">{application.role}</div>
                        </Col>
                     </Row>
                  </div>
                  <CardHeader>
                     <Nav tabs className="card-header-tabs">
                        <NavItem>
                           <NavLink
                              className={classnames({ active: this.state.activeTab === "1" })}
                              onClick={() => {
                                 this.toggleTab("1");
                              }}
                              href="#"
                           >
                              Info
                           </NavLink>
                        </NavItem>
                        <NavItem>
                           <NavLink
                              className={classnames({ active: this.state.activeTab === "2" })}
                              onClick={() => {
                                 this.toggleTab("2");
                              }}
                              href="#"
                           >
                              Notes
                           </NavLink>
                        </NavItem>
                        <NavItem>
                           <NavLink
                              className={classnames({ active: this.state.activeTab === "3" })}
                              onClick={() => {
                                 this.toggleTab("3");
                              }}
                              href="#"
                           >
                              Interviews
                           </NavLink>
                        </NavItem>
                     </Nav>
                  </CardHeader>

                  <CardBody style={this.state.activeTab==="2" ? {backgroundColor: "#F7F6FA"} : {}}>
                     <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                           <CardTitle tag="h5"></CardTitle>
                           <Row>
                              <Col sm="3" className="job-modal-info">
                                 <p>Company:</p>
                                 <p>Job Title:</p>
                                 <p>Location:</p>
                                 <p>Link:</p>
                                 <p>Date Applied:</p>
                                 <p>Job Description:</p>
                              </Col>
                              <Col sm="9">
                                 <EditableText className="editable-text" name="company_name" onSave={this.updateApplication}>{application.company_name}</EditableText>
                                 <EditableText className="editable-text" name="role" onSave={this.updateApplication}>{application.role}</EditableText>
                                 <EditableText className="editable-text" name="location" onSave={this.updateApplication} placeholder={application.location ? null : 'Enter a location'}>{application.location}</EditableText>
                                 <EditableText className="editable-text" name="link" onSave={this.updateApplication} placeholder={application.link ? null : 'Enter a URL'}>{application.link}</EditableText>
                                 <EditableText className="editable-text" name="date_applied" onSave={this.updateApplication} placeholder={application.date_applied ? null : 'Enter the date applied'}>{application.date_applied}</EditableText>
                                 <div style={{overflow: "hidden", whiteSpace: "pre-wrap", paddingTop: "5px"}}>
                                    <EditableTextArea className="editable-text" name="description" onSave={this.updateApplication} placeholder={application.description ? null : 'Enter a job description'}>{application.description}</EditableTextArea>
                                 </div>
                              </Col>
                           </Row>
                        </TabPane>
                     </TabContent>
                     <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="2" className="text-center">
                           <PerfectScrollbar options={{suppressScrollX: true}}>
                              <div style={{maxHeight: "500px", padding: "5px"}}>
                                 <div className="pt-2 pl-3 pr-3 mb-5">
                                    <TextareaAutosize 
                                       ref={this.noteRef}
                                       style={{minHeight: "100px", maxHeight: "100px", resize: "none", boxSizing: "border-box", width: "100%", padding: "10px", border: "thin solid #dbdbdb"}}
                                       cols={50}
                                       rows={3}
                                       placeholder="Add a note"
                                       autoFocus
                                    />
                                    <Button className="float-right mt-2 pr-4 pl-4" onClick={this.addNote} color="success">
                                       Save
                                    </Button>
                                 </div>
                                 <Row className="p-3">
                                    {
                                       application.notes ? application.notes.map(note => {
                                          return(
                                             <Col sm="12" key={note.id}>
                                                <Card body className="job-modal-note-card">
                                                   <CardText style={{whiteSpace: "pre-wrap", marginBottom: "8px"}}>
                                                      <Trash className="float-right delete-icon align-middle ml-4" size={16} onClick={() => {this.deleteNote(note.id)}}></Trash>
                                                      {note.text}
                                                   </CardText>
                                                   <CardText>
                                                      <small className="lighter-text">Added <Moment fromNow>{note.created_at}</Moment></small>
                                                   </CardText>
                                                </Card>
                                             </Col>
                                          )
                                       }) : ''
                                    }
                                 </Row>
                              </div>
                           </PerfectScrollbar>
                        </TabPane>
                     </TabContent>
                     <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="3" className="text-center">
                           <PerfectScrollbar options={{suppressScrollX: true}}>
                              <div style={{maxHeight: "500px", padding: "5px"}}>
                                 <Row className="p-3">
                                    { 
                                       application.interviews && application.interviews.length ? 
                                          <Col sm="12" className="mb-3">
                                             <span className="float-left">{application.interviews.length} Interview{application.interviews.length > 1 ? 's' : ''}</span>
                                             <Button className="float-right" onClick={this.openAddInterviewModal} color="primary">
                                                Add an Interview
                                             </Button>
                                          </Col>
                                       : ''
                                    }

                                    <Col sm="12">
                                    {
                                       application.interviews && application.interviews.length ? application.interviews.map(interview => {
                                          return (
                                             <Card key={interview.id} body className="job-modal-note-card">
                                                <CardHeader>
                                                   <Trash className="float-right delete-icon align-middle ml-4" size={16} onClick={() => {this.deleteInterview(interview.id)}}></Trash>
                                                   {interview.stage.name}
                                                </CardHeader>
                                                <CardText>
                                                   <small className="lighter-text">Interviewed on <Moment format="YYYY-MM-DD">{interview.date}</Moment></small>
                                                </CardText>
                                                <CardText>
                                                   <span className="mr-4">{ this.parseResult(interview.result) }</span>
                                                   <span className="mr-4">{interview.experience ? this.parseExperience(interview.experience) : ''}</span>
                                                   <span>{interview.difficulty ? this.parseDifficulty(interview.difficulty) : ''}</span>
                                                </CardText>
                                                <CardText className="font-weight-bold">Description</CardText>
                                                <CardText style={{whiteSpace: "pre-wrap"}}>
                                                   {interview.description}
                                                </CardText>
                                                <CardText className="font-weight-bold">Location</CardText>
                                                <CardText>
                                                   {interview.location}
                                                </CardText>
                                                <CardText className="font-weight-bold">Duration</CardText>
                                                <CardText>
                                                   {interview.duration} minutes
                                                </CardText>
                                                <CardText className="font-weight-bold mt-2">Questions</CardText>
                                                <ul>
                                                   {
                                                      interview.questions ? interview.questions.map(question => {
                                                         return (
                                                            <li key={question.id}>{question.text}</li>
                                                         )
                                                      }) : ''
                                                   }
                                                </ul>
                                                <div>
                                                   <Input type="textarea" placeholder="Add a question" name="question" value={this.state.questions[interview.id]} onChange={(e) => {this.handleQuestionChange(e, interview.id)}} />
                                                   <Button className="float-right mt-2 pr-4 pl-4" onClick={() => {this.addQuestion(interview.id)}} color="success">
                                                      Add Question
                                                   </Button>
                                                </div>
                                             </Card>
                                          )
                                       }) : <div className='no-data'>
                                          <MessageSquare size={32}></MessageSquare>
                                          <p style={{marginTop: '25px'}}>You have no saved interviews for this application yet</p>
                                          <Button style={{marginTop: '10px', marginBottom: '20px'}} onClick={this.openAddInterviewModal} color="primary">
                                             Add an Interview
                                          </Button>
                                       </div>
                                    }
                                    </Col>
                                 </Row>
                              </div>
                           </PerfectScrollbar>
                        </TabPane>
                     </TabContent>
                  </CardBody>
               </Card>
               : ''
            }
         </Modal>
      );
   }
}

export default JobModal;


