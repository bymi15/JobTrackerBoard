import React from "react";

import {
   Card,
   CardBody,
   CardHeader,
   CardTitle,
   Button
} from "reactstrap";

import { Droppable } from "react-beautiful-dnd";
import PerfectScrollbar from "react-perfect-scrollbar";
import 'react-perfect-scrollbar/dist/css/styles.css';

class BoardList extends React.Component {
   render() {
      const { name, children, openAddJobModal, id, count } = this.props;
      return (
         <Card>
            <CardHeader>
               <CardTitle tag="h5">{name}</CardTitle>
               <h6 className="card-subtitle text-muted">
                  {count} Job{count != 1 ? 's' : ''}
               </h6>
            </CardHeader>
            <CardBody className="p-3">
               <Button onClick={openAddJobModal} className="mb-4" color="primary" block>
                  ADD JOB
               </Button>
               <Droppable droppableId={String(id)}>
                  {provided => (
                     <div {...provided.droppableProps} ref={provided.innerRef}>
                        <PerfectScrollbar>
                           <div className="boardlist">
                              {children}
                              {provided.placeholder}
                           </div>
                        </PerfectScrollbar>
                     </div>
                  )}
               </Droppable>
            </CardBody>
         </Card>
      );
   }
}

export default BoardList;