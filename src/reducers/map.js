const initialState = {
   pins: null
};

const map = (state = initialState, action) => {
  switch(action.type) {
      case 'SET_PINS':
         return {
            ...state,
            pins: action.payload
         };

      default:
         return state;
  }
}

export default map;