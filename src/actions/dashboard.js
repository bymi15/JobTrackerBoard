export const setBoard = (board) => (dispatch, getState) => {
   dispatch({
      type: 'SET_BOARD',
      payload: board
   });
}

export const clearBoard = () => (dispatch, getState) => {
   dispatch({
      type: 'CLEAR_BOARD'
   });
}