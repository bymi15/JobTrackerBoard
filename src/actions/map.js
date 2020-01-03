export const setPins = (pins) => (dispatch, getState) => {
   dispatch({
      type: 'SET_PINS',
      payload: pins
   });
}