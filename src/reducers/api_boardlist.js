const initialState = {
   isLoading: false,
   boardlists: null,
   error: null
};

const api_boardlist = (state = initialState, action) => {
  switch(action.type) {
      case 'FETCH_BOARDLISTS_REQUEST':
         return {
            ...state,
            isLoading: true,
            error: null
         };

      case 'FETCH_BOARDLISTS_SUCCESS':
         return {
            ...state,
            isLoading: false,
            boardlists: action.response.data
         };

      case 'FETCH_BOARDLISTS_FAILURE':
         return {
            ...state,
            isLoading: false,
            error: action.error.data
         };

      default:
         return state;
  }
}

export default api_boardlist;