const initialState = {
   isLoading: false,
   companies: null,
   error: null
};

const api_company = (state = initialState, action) => {
  switch(action.type) {
      case 'SEARCH_COMPANY_REQUEST':
         return {
            ...state,
            isLoading: true,
            error: null
         };

      case 'SEARCH_COMPANY_SUCCESS':
         return {
            ...state,
            isLoading: false,
            companies: action.response.data
         };

      case 'SEARCH_COMPANY_FAILURE':
         return {
            ...state,
            isLoading: false,
            error: action.error.data
         };

      case 'CLEAR_SEARCH':
         return {
            ...state,
            companies: null
         };

      default:
         return state;
  }
}

export default api_company;