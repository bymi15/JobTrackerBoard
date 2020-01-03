import React from "react";
import { connect } from 'react-redux';
import { createApplication, updateApplication, deleteApplication, updateApplicationUI, setApplication, addNote, deleteNote, addInterview, deleteInterview, addQuestion, deleteQuestion } from '../../../actions/api_application';
import { fetchBoardlists } from '../../../actions/api_boardlist';

import { Redirect } from 'react-router-dom';
import PerfectScrollbar from "react-perfect-scrollbar";

import AddJobModal from './AddJobModal';
import JobModal from './JobModal';
import BoardList from "./BoardList";
import Job from "./Job";

import Loader from "../../../components/Loader";

import { confirmDialog } from '../../../helpers/confirmDialog';

import {
   Container,
   Col,
   Row,
   Button
} from "reactstrap";

import { DragDropContext } from "react-beautiful-dnd";

class Board extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         addJobModal: false,
         jobModal: false,
         boardlist: 1
      }
   }

   componentDidMount(){
      this.props.fetchBoardlists();
   }

   openAddJobModal = (id) => {
		this.setState({
         addJobModal: true,
         boardlist: id
		})
   }

	createApplication = (data) => {
      if(this.props.selectedBoard){
         const application = {
            company_name: data.company_name,
            role: data.role,
            board: { id: this.props.selectedBoard.id },
            board_list: { id: parseInt(data.board_list) },
         };
         
         this.props.createApplication(application);
   
         this.toggleAddJobModal();
      }else{
         //error! this should not happen
         console.log("CRITICAL ERROR!");
      }
   }
   
   deleteApplication = (id, board_list_id) => {
      confirmDialog('Delete Job', 'Are you sure you want to delete this job?', () => { 
         this.props.deleteApplication(id, board_list_id) 
      });
   }

   updateApplication = (data) => {
      if(this.props.application){
         this.props.updateApplication(this.props.application.id, data);
      }else{
         //error! this should not happen
         console.log("CRITICAL ERROR!");
      }
   }

   toggleJobModal = (application) => {
      this.props.setApplication(application);
      this.setState(prevState => ({
         jobModal: !prevState.jobModal
      }));
   }

	toggleAddJobModal = () => {
      this.setState(prevState => ({
         addJobModal: !prevState.addJobModal,
         boardlist: 1
      }));
   }

   onDragEnd = (res) => {
      const { destination, source, draggableId } = res;
      if(destination){ //valid drop
         const data = {
            order_index: destination.index,
            board_list: { id: destination.droppableId }
         };

         const board_list = this.props.boardlists.find(boardlist => boardlist.id === parseInt(destination.droppableId));
         const data_ui = {
            droppableIdStart: source.droppableId,
            droppableIdEnd: destination.droppableId,
            droppableIndexStart: source.index,
            droppableIndexEnd: destination.index,
            board_list: board_list
         }
         this.props.updateApplicationUI(data_ui); //front end update
         this.props.updateApplication(draggableId, data); //back end (database) update
      }
   }

   render() {
      const { isLoading, error, application, applications, boardlists, selectedBoard } = this.props;
      if(!selectedBoard){
         return (
            <Redirect to="/dashboard" />
         );
      }

      if(isLoading){
         return <Loader />
      }

      return (
         <PerfectScrollbar options={{suppressScrollX: true}}>
            <div className="content" style={{maxHeight: "88vh"}}>
               <Container fluid>
                  <JobModal 
                     isOpen={this.state.jobModal} 
                     application={application}
                     addNote={this.props.addNote}
                     deleteNote={this.props.deleteNote}
                     addInterview={this.props.addInterview}
                     deleteInterview={this.props.deleteInterview}
                     addQuestion={this.props.addQuestion}
                     deleteQuestion={this.props.deleteQuestion}
                     updateApplication={this.updateApplication} 
                     deleteApplication={this.deleteApplication} 
                     toggle={this.toggleJobModal} 
                  />
                  <AddJobModal 
                     isOpen={this.state.addJobModal} 
                     boardlist={this.state.boardlist} 
                     saveModal={this.createApplication} 
                     toggle={this.toggleAddJobModal} 
                  />
                  <Col sm="12" className="mx-auto d-table h-100">
                     <DragDropContext onDragEnd={this.onDragEnd}>
                        <Row>
                        { 
                           boardlists ? boardlists.map(boardlist => (
                              <div className="col-lg-5ths col-md-6 col-sm-12" key={boardlist.id}>
                                 <BoardList id={boardlist.id} count={applications[boardlist.id] ? applications[boardlist.id].length : 0} name={boardlist.title} openAddJobModal={() => {this.openAddJobModal(boardlist.id)}}>
                                    {
                                       applications && applications[boardlist.id] ? applications[boardlist.id].map((application, index) => (
                                          <a id={application.id} key={application.id} onClick={() => {this.toggleJobModal(application)}}>
                                             <Job application={application} index={index} deleteApplication={this.deleteApplication}/>
                                          </a>
                                       )) : ''
                                    }
                                 </BoardList>
                              </div>
                           )) : ''
                        }
                        </Row>
                     </DragDropContext>
                  </Col>
               </Container>
            </div>
         </PerfectScrollbar>
      );
   }
}

const mapStateToProps = state => ({
   error: state.api_application.error,
   isLoading: state.api_application.isLoading,
   applications: state.api_application.applications,
   application: state.api_application.application,
   boardlists: state.api_boardlist.boardlists,
   boards: state.api_board.boards,
   selectedBoard: state.dashboard.board
});

const mapDispatchToProps = dispatch => ({
   createApplication: (data) => dispatch(createApplication(data)),
   updateApplication: (id, data) => dispatch(updateApplication(id, data)),
   updateApplicationUI: (data) => dispatch(updateApplicationUI(data)),
   deleteApplication: (id, board_list_id) => dispatch(deleteApplication(id, board_list_id)),
   setApplication: (application) => dispatch(setApplication(application)),
   addNote: (data) => dispatch(addNote(data)),
   deleteNote: (id) => dispatch(deleteNote(id)),
   addInterview: (data) => dispatch(addInterview(data)),
   deleteInterview: (id) => dispatch(deleteInterview(id)),
   addQuestion: (data) => dispatch(addQuestion(data)),
   deleteQuestion: (id) => dispatch(deleteQuestion(id)),
   fetchBoardlists: () => dispatch(fetchBoardlists())
})

export default connect(mapStateToProps, mapDispatchToProps)(Board);
