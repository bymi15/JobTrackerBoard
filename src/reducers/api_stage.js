const initialState = {
   isLoading: false,
   stages: null,
   error: null
};

const api_stage = (state = initialState, action) => {
  switch(action.type) {
      case 'FETCH_STAGES_REQUEST':
         return {
            ...state,
            isLoading: true,
            error: null
         };

      case 'FETCH_STAGES_SUCCESS':
         return {
            ...state,
            isLoading: false,
            stages: action.response.data
         };

      case 'FETCH_STAGES_FAILURE':
         return {
            ...state,
            isLoading: false,
            error: action.error.data
         };

      default:
         return state;
  }
}

export default api_stage;