const initialState = {
   token: localStorage.getItem("token"),
   isAuthenticated: false,
   isLoading: false,
   user: null,
   error: null
};

const api_auth = (state = initialState, action) => {
  switch(action.type) {
      case 'FETCH_AUTHUSER_REQUEST':
      case 'LOGIN_REQUEST':
      case 'REGISTER_REQUEST':
      case 'LOGOUT_REQUEST':
         return {
            ...state,
            isLoading: true,
            error: null
         };

      case 'FETCH_AUTHUSER_SUCCESS':
         return {
            ...state,
            isLoading: false,
            isAuthenticated: true,
            user: action.response.data
         };
      
      case 'REGISTER_SUCCESS':
      case 'LOGIN_SUCCESS':
         localStorage.setItem("token", action.response.data.token);
         return {
            ...state,
            ...action.response.data,
            isAuthenticated: true,
            isLoading: false
         };

      case 'LOGOUT_SUCCESS':
         localStorage.removeItem("token");
         return {
            ...state,
            token: null,
            isLoading: false,
            isAuthenticated: false,
            user: null
         };

      case 'LOGIN_FAILURE':
      case 'REGISTER_FAILURE':
      case 'FETCH_AUTHUSER_FAILURE':
      case 'LOGOUT_FAILURE':
         localStorage.removeItem("token");
         return {
            ...state,
            token: null,
            isLoading: false,
            isAuthenticated: false,
            user: null,
            error: action.error.data
         };

      default:
         return state;
  }
}

export default api_auth;