const initialState = {
   isLoading: false,
   boards: null,
   board: null,
   error: null
};

const api_board = (state = initialState, action) => {
  switch(action.type) {
      case 'CREATE_BOARD_REQUEST':
      case 'FETCH_BOARDS_REQUEST':
      case 'DELETE_BOARDS_REQUEST':
         return {
            ...state,
            isLoading: true,
            error: null
         };

      case 'FETCH_BOARDS_SUCCESS':
         return {
            ...state,
            isLoading: false,
            boards: action.response.data
         };

      case 'CREATE_BOARD_SUCCESS':
         return state.boards ? {
            ...state,
            isLoading: false,
            boards: [...state.boards, action.response.data]
         } : {
            ...state,
            isLoading: false,
            boards: [action.response.data]
         };

      case 'DELETE_BOARD_SUCCESS':
         const deleted_id = action.extraData.deleted_id;
         const boards = state.boards.filter(board => board.id !== deleted_id);
         return {
             ...state,
             isLoading: false,
             boards: boards
         }

      case 'CREATE_BOARD_FAILURE':
      case 'FETCH_BOARDS_FAILURE':
      case 'DELETE_BOARDS_FAILURE':
         return {
            ...state,
            isLoading: false,
            error: action.error.data
         };

      default:
         return state;
  }
}

export default api_board;