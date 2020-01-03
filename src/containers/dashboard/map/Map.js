import React from "react";
import GoogleMapReact from "google-map-react";
import Pin from "./Pin";

class GoogleMap extends React.Component {
   getMapOptions = maps => {
      return {
         fullscreenControl: true,
         mapTypeControl: true,
         mapTypeId: maps.MapTypeId.ROADMAP,
         scaleControl: true,
         scrollwheel: true,
         streetViewControl: true
      };
   };

   render() {
      const { pins } = this.props;

      return (
         <div style={{ height: '100vh', width: "99%" }}>
            <GoogleMapReact
               options={this.getMapOptions}
               bootstrapURLKeys={{
                  key: "AIzaSyD1VaM_1NFrzGdWPo38YSbx3_IwZ0QODg8"
               }}
               defaultCenter={this.props.center}
               defaultZoom={this.props.zoom}
            >
               {
                  pins ? pins.map(pin => (
                     <Pin key={pin.id} id={pin.id} company_name={pin.company_name} address={pin.address} lat={pin.lat} lng={pin.lng} />
                  )) : ''
               }
            </GoogleMapReact>
         </div>
      );
   }
}

GoogleMap.defaultProps = {
   center: {
      lat: 51.5,
      lng: -0.1277
   },
   zoom: 10
};
 

export default GoogleMap;
