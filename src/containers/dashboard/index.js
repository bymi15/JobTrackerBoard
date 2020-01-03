import React from "react";
import { connect } from 'react-redux';
import { fetchBoards, createBoard, deleteBoard } from '../../actions/api_board';
import { setBoard, clearBoard } from '../../actions/dashboard';
import { fetchApplicationsByBoard } from '../../actions/api_application';
import { Redirect, Link} from 'react-router-dom';

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";

import Loader from "../../components/Loader";

import { User, Edit2, Trash } from "react-feather";

import Moment from 'react-moment';

import { confirmDialog, createBoardDialog } from '../../helpers/confirmDialog';

import {
   Row, Col, Card, CardBody, Button, Input, Form, FormGroup, Label, Container
} from "reactstrap";

class DashboardMain extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         isHovering: {}
      };
   }

   componentDidMount() {
      this.props.fetchBoards();
   }

   handleChange = (e) => {
      const { name, value } = e.target;
      this.setState({ [name]: value });
   }

   openBoard = (id) => {
      this.props.fetchApplicationsByBoard(id);
      const board = this.props.boards.find(board => board.id === id);
      this.props.setBoard(board);
   }

   createBoard = (e) => {
      e.preventDefault();
      createBoardDialog((board_title) => {
         if(board_title && board_title.trim()){
            this.props.createBoard({title: board_title});
         }
      });
   }

   deleteBoard = (e, id) => {
      e.stopPropagation();
      e.preventDefault();
      confirmDialog('Delete Board', 'Are you sure you want to delete this board?', () => {
         this.props.deleteBoard(id) 
      });
   }

   updateBoard = (id) => {
      console.log(id);
   }

   handleMouseEnter = (id) => {
      this.setState({
         isHovering: {...this.state.isHovering, [id]: true}
      });
   }

   handleMouseLeave = (id) => {
      this.setState({
         isHovering: {...this.state.isHovering, [id]: false}
      });
   }

   render() {
      const { isLoading, boards } = this.props;
      if(isLoading){
         return <Loader />
      }

      return (
         <Container className="content">
            <Col sm="12" className="mx-auto d-table h-100">
               <div className="mt-4 mb-3">
                  <h2><User size={32} className="mr-2"/>My Boards</h2>
               </div>
               <Row>
               {
                  boards ? boards.map(board => (
                     <Col sm="3" key={board.id}>
                        <Link to="/dashboard/board" onClick={() => {this.openBoard(board.id)}} >
                           <Card className="board-card" onMouseEnter={() => {this.handleMouseEnter(board.id)}} onMouseLeave={() => {this.handleMouseLeave(board.id)}}>
                              <CardBody>
                                 <Trash className={(this.state.isHovering[board.id] ? 'delete-icon' : 'hidden-icon') + " float-right"} size={22} onClick={(e) => {this.deleteBoard(e, board.id)}}/>
                                 <p className="board-card-title">{board.title}</p>
                                 <p className="board-card-date">Created at <Moment format="YYYY-MM-DD">{board.created_at}</Moment></p>
                              </CardBody>
                           </Card>
                        </Link>
                     </Col>
                  )) : ''
               }
               <Col sm="3">
                  <Card className="board-card-new" onClick={this.createBoard}>
                     <CardBody>
                        <p>+ Create new board</p>
                     </CardBody>
                  </Card>
               </Col>
               </Row>
            </Col>
         </Container>
      )
   }
}

const mapStateToProps = state => ({
   error: state.api_board.error,
   isLoading: state.api_board.isLoading,
   boards: state.api_board.boards
});

const mapDispatchToProps = dispatch => ({
   fetchBoards: () => dispatch(fetchBoards()),
   clearBoard: () => dispatch(clearBoard()),
   setBoard: (board) => dispatch(setBoard(board)),
   createBoard: (data) => dispatch(createBoard(data)),
   deleteBoard: (id) => dispatch(deleteBoard(id)),
   fetchApplicationsByBoard: (id) => dispatch(fetchApplicationsByBoard(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardMain);
