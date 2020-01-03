const initialState = {
   isLoading: false,
   application: null,
   applications: null,
   error: null
};

const groupApplications = (applications) => {
   return applications.reduce((objectsByKeyValue, obj) => {
      const value = obj['board_list'].id;
      objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
      return objectsByKeyValue;
   }, {});
}

const sortOrder = (applications) => {
   return applications.sort((a, b) => {
      return (a.order_index > b.order_index) ? 1 : -1
   });
}

const api_application = (state = initialState, action) => {
   switch (action.type) {
      case 'CREATE_APPLICATION_REQUEST':
      case 'FETCH_APPLICATIONS_REQUEST':
      case 'FETCH_APPLICATIONS_BY_BOARD_REQUEST':
         return {
            ...state,
            isLoading: true,
            error: null
         };

      case 'FETCH_APPLICATIONS_BY_BOARD_SUCCESS':
      case 'FETCH_APPLICATIONS_SUCCESS':
         const sortedApplications = sortOrder(action.response.data)
         const groupedApplications = groupApplications(sortedApplications);
         return {
            ...state,
            isLoading: false,
            applications: groupedApplications
         };

      case 'CREATE_APPLICATION_SUCCESS':
         const board_list_id = action.response.data.board_list.id;
         var new_applications = {[board_list_id]: action.response.data};

         if (state.applications) {
            new_applications = {...state.applications};
            if(new_applications[board_list_id]){
               new_applications[board_list_id].push(action.response.data);
            }else{
               new_applications[board_list_id] = [action.response.data];
            }
         }
         return {
            ...state,
            isLoading: false,
            application: action.response.data,
            applications: new_applications
         };

      case 'UPDATE_APPLICATION_UI':
         const data = action.payload;
         const updated_applications = {...state.applications};
         //reorder within same list
         if (data.droppableIdStart === data.droppableIdEnd) {
            const list = updated_applications[data.droppableIdStart];
            const application = list.splice(data.droppableIndexStart, 1);
            list.splice(data.droppableIndexEnd, 0, ...application);
         } else {
            const listStart = updated_applications[data.droppableIdStart];
            let application = listStart.splice(data.droppableIndexStart, 1);
            application[0].board_list = data.board_list;
            const listEnd = updated_applications[data.droppableIdEnd];
            if(listEnd){
               listEnd.splice(data.droppableIndexEnd, 0, ...application);
            }else{
               updated_applications[data.droppableIdEnd] = application;
            }
         }
         return {
            ...state,
            applications: updated_applications
         };

      case 'SET_APPLICATION':
         const application = action.payload;
         return {
            ...state,
            application: application
         };

      case 'UPDATE_APPLICATION_SUCCESS':
         //don't do anything for re-ordering updates
         if(action.extraData.order_index){
            return state;
         }else{
            var updated_application = action.response.data;
            var new_applications = {...state.applications};
            const list = new_applications[updated_application.board_list.id];
            const index = list.findIndex(a => a.id === updated_application.id);
            list.splice(index, 1, updated_application);

            return {
               ...state,
               isLoading: false,
               application: updated_application,
               applications: new_applications
            };
         }

      case 'ADD_NOTE_SUCCESS':
         const note = action.response.data;
         var new_application = {...state.application};
         new_application.notes.unshift(note);

         return {
            ...state,
            isLoading: false,
            application: new_application
         };

      case 'DELETE_NOTE_SUCCESS':
         var deleted_id = action.extraData.deleted_id;
         var new_application = {...state.application};
         var new_applications = {...state.applications};
         if(new_application.notes){
            new_application.notes = new_application.notes.filter(note => note.id !== deleted_id);
         }

         var app_id = new_application.id;
         for(var key in new_applications){
            const application = new_applications[key].find(application => application.id === app_id);
            if(application){
               application.notes = new_application.notes;
               break;
            }
         }

         return {
            ...state,
            isLoading: false,
            application: new_application,
            applications: new_applications
         }

      case 'ADD_INTERVIEW_SUCCESS':
         const interview = action.response.data;
         var new_application = {...state.application};
         new_application.interviews.unshift(interview);

         return {
            ...state,
            isLoading: false,
            application: new_application
         };

      case 'DELETE_INTERVIEW_SUCCESS':
         var deleted_id = action.extraData.deleted_id;
         var new_application = {...state.application};
         var new_applications = {...state.applications};
         if(new_application.interviews){
            new_application.interviews = new_application.interviews.filter(interview => interview.id !== deleted_id);
         }

         var app_id = new_application.id;
         for(var key in new_applications){
            const application = new_applications[key].find(application => application.id === app_id);
            if(application){
               application.interviews = new_application.interviews;
               break;
            }
         }

         return {
            ...state,
            isLoading: false,
            application: new_application,
            applications: new_applications
         }

      case 'ADD_QUESTION_SUCCESS':
         const question = action.response.data;
         var new_application = {...state.application};
         const index = new_application.interviews.findIndex(interview => interview.id === question.interview);
         new_application.interviews[index].questions.unshift(question);

         return {
            ...state,
            isLoading: false,
            application: new_application
         };

      case 'DELETE_APPLICATION_SUCCESS':
         var deleted_id = action.extraData.deleted_id;
         const board_list = action.extraData.board_list_id;
         const applications = {...state.applications};
         applications[board_list] = applications[board_list].filter(application => application.id !== deleted_id);
         return {
            ...state,
            isLoading: false,
            applications: applications
         }

      case 'CREATE_APPLICATION_FAILURE':
      case 'FETCH_APPLICATIONS_FAILURE':
      case 'FETCH_APPLICATIONS_BY_BOARD_FAILURE':
      case 'UPDATE_APPLICATION_FAILURE':
      case 'ADD_NOTE_FAILURE':
         return {
            ...state,
            isLoading: false,
            error: action.error.data
         };

      default:
         return state;
   }
}

export default api_application;