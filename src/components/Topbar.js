import React from "react";
import { connect } from "react-redux";
import "../assets/css/Topbar.css";
import { fetchBoards } from '../actions/api_board';
import { setBoard, clearBoard } from '../actions/dashboard';
import { fetchApplicationsByBoard } from '../actions/api_application';
import { Link, withRouter } from 'react-router-dom';

import { MapPin, Layers, Columns, PieChart, ChevronLeft } from "react-feather";
import { UncontrolledTooltip, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

class Topbar extends React.Component {
   constructor(props){
       super(props);
       this.state = {
          dropdownOpen: false
       }
   }

   openBoard = (id) => {
      this.props.fetchApplicationsByBoard(id);
      const board = this.props.boards.find(board => board.id === id);
      this.props.setBoard(board);
   }
      
   getIconClass = (path) => {
      return (path !== "/dashboard" && this.props.location.pathname.indexOf(path) !== -1) ||
      (this.props.location.pathname === "/dashboard" && path === "/dashboard") ? "icon-active" : "";
   };

   toggle = () => {
      this.setState(prevState => ({
         dropdownOpen: !prevState.dropdownOpen
      }))
   }

   render() {
      const { selectedBoard, boards } = this.props;

      return (
         <div className="top-bar">
            <div className="top-bar-left">
               { 
                  selectedBoard ? <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                     <DropdownToggle caret color="info">
                        {selectedBoard.title}
                     </DropdownToggle>
                     <DropdownMenu>
                        <DropdownItem header>My Boards</DropdownItem>
                        {
                           boards ? boards.filter(b => b.id !== selectedBoard.id).map(board => (
                              <DropdownItem onClick={() => {this.openBoard(board.id)}} key={board.id}>{board.title}</DropdownItem>
                           )) : ''
                        }
                        <DropdownItem divider />
                        <Link to="/dashboard" onClick={this.props.clearBoard}><DropdownItem><ChevronLeft size={16} className="ml-0 pl-0 mr-1"/>Return to boards</DropdownItem></Link>
                     </DropdownMenu>
                  </Dropdown> : '' 
               }
            </div>
            <div className="top-bar-center">
               <Link to="/dashboard/board"><Columns size={44} id="board" className={"top-bar-icon " + this.getIconClass("/dashboard/board")}></Columns></Link>
               <UncontrolledTooltip placement="bottom" target="board">
                  Board
               </UncontrolledTooltip>
               <Link to="/dashboard/map"><MapPin size={44} id="map" className={"top-bar-icon " + this.getIconClass("/dashboard/map")}></MapPin></Link>
               <UncontrolledTooltip placement="bottom" target="map">
                  Map
               </UncontrolledTooltip>
               <Link to="/dashboard/stats"><PieChart size={44} id="stats" className={"top-bar-icon " + this.getIconClass("/dashboard/stats")}></PieChart></Link>
               <UncontrolledTooltip placement="bottom" target="stats">
                  Statistics
               </UncontrolledTooltip>
            </div>
            <div className="top-bar-right"></div>
         </div>
      )
   }
}

const mapStateToProps = state => ({
    selectedBoard: state.dashboard.board,
    boards: state.api_board.boards
});

const mapDispatchToProps = dispatch => ({
   fetchBoards: () => dispatch(fetchBoards()),
   setBoard: (board) => dispatch(setBoard(board)),
   clearBoard: () => dispatch(clearBoard()),
   fetchApplicationsByBoard: (id) => dispatch(fetchApplicationsByBoard(id))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Topbar));