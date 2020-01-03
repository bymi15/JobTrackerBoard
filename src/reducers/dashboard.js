const initialState = {
   board: null
};

const dashboard = (state = initialState, action) => {
  switch(action.type) {
      case 'SET_BOARD':
         return {
            ...state,
            board: action.payload
         };

      case 'CLEAR_BOARD':
         return {
            ...state,
            board: null
         };

      default:
         return state;
  }
}

export default dashboard;