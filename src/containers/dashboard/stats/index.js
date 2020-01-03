import React from "react";
import { connect } from 'react-redux';
import { createApplication } from '../../../actions/api_application';

import Loader from "../../../components/Loader";

import { toSingleArray } from '../../../helpers/processApplications';

import PerfectScrollbar from "react-perfect-scrollbar";

import {
   Col,
   Row,
   Button,
   Card,
   CardBody,
   CardHeader,
   CardTitle
} from "reactstrap";

import BarChart from "./BarChart";
import ColumnChart from "./ColumnChart";
import AreaChart from "./AreaChart";

class DashboardMap extends React.Component {
   constructor(props) {
      super(props);

      this.state = {
         applications: null,
         categories: null,
         stats: null
      }
   }

   componentDidMount() {
      const applications = toSingleArray(this.props.applications);
      this.setState(DashboardMap.computeStats(applications, this.props.boardlists));
   }

   static computeStats(applications, boardlists){
      //compute the statistics
      var categories = [];
      var stats = [];
      if (boardlists) {
         for (var i in boardlists) {
            categories.push(boardlists[i].title);
            stats.push(0);
         }
      }
      for (var i in applications) {
         const n = categories.indexOf(applications[i].board_list.title);
         if (n >= 0) {
            stats[n]++;
         }
      }

      return { applications: applications, categories: categories, stats: stats };
   }

   static getDerivedStateFromProps(props, state) {
      const applications = toSingleArray(props.applications);
      if (applications !== state.applications) {
         const newState = DashboardMap.computeStats(applications, props.boardlists);
         return newState;
      }
      return null;
   }

   render() {
      const { isLoading } = this.props;
      const { categories, stats } = this.state;
      if (isLoading) {
         return <Loader />
      }

      return (
         <PerfectScrollbar options={{ suppressScrollX: true }}>
            <div style={{ maxHeight: "88vh" }}>
               <Row className="stats-container">
                  <Col lg="6">
                     <BarChart categories={categories} stats={stats} />
                  </Col>
                  <Col lg="6">
                     <ColumnChart />
                  </Col>
                  <Col lg="12">
                     <AreaChart />
                  </Col>
               </Row>
            </div>
         </PerfectScrollbar>
      );
   }
}

const mapStateToProps = state => ({
   error: state.api_application.error,
   isLoading: state.api_application.isLoading,
   boardlists: state.api_boardlist.boardlists,
   applications: state.api_application.applications
});

const mapDispatchToProps = dispatch => ({
   createApplication: (data) => dispatch(createApplication(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardMap);
