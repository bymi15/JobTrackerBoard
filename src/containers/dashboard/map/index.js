import React from "react";
import { connect } from 'react-redux';

import { toSingleArray } from '../../../helpers/processApplications';

import { setPins } from '../../../actions/map';

import Loader from "../../../components/Loader";

import Geocode from "react-geocode";
import GoogleMap from './Map';

import {
   Row,
} from "reactstrap";

class DashboardMap extends React.Component {
   constructor(props) {
      super(props);
   }

   computeGeocode = (location, app_id) => {
      return Geocode.fromAddress(location).then(
         response => {
            const app = this.applications.find(application => application.id == app_id);
            const { lat, lng } = response.results[0].geometry.location;
            var res = {
               id: app.id,
               board_id: app.board.id,
               company_name: app.company_name,
               address: location,
               lat: lat,
               lng: lng
            };
            return res;
         },
         error => {
           console.error(error);
           return null;
         }
       );
   }

   boardHasChanged = () => {
      if(this.props.pins && this.props.pins.length > 0){
         return this.props.pins[0].board_id != this.props.selectedBoard.id;
      }
      return true;
   }

   loadPins = () => {
      Geocode.setApiKey("AIzaSyD1VaM_1NFrzGdWPo38YSbx3_IwZ0QODg8");
      var promises = [];

      if(this.props.applications){
         this.applications = toSingleArray(this.props.applications);

         this.applications.map(application => {
            if(application.location){
               promises.push(this.computeGeocode(application.location, application.id))
            }else{
               promises.push(this.computeGeocode('London', application.id))
            }
         });
   
         Promise.all(promises)
            .then((results) => {
               this.props.setPins(results);
            })
            .catch((e) => {
               console.log(e);
            });
      }
   }

   render() {
      const { isLoading, pins } = this.props;
      if (isLoading) {
         return <Loader />
      }

      if(!pins || this.boardHasChanged()){
         this.loadPins();
      }

      return (
         <Row>
            <GoogleMap pins={pins} />
         </Row>
      );
   }
}

const mapStateToProps = state => ({
   error: state.api_application.error,
   isLoading: state.api_application.isLoading,
   applications: state.api_application.applications,
   pins: state.map.pins,
   selectedBoard: state.dashboard.board
});

const mapDispatchToProps = dispatch => ({
   setPins: (pins) => dispatch(setPins(pins))
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardMap);
