import { authHeader } from '../helpers/authHeader';
import { fetchFromApi } from "react-redux-api-tools";
import { config } from '../Constants';

export const fetchBoardlists = () => (dispatch, getState) => {
  const requestData = {
      method: 'GET',
      headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'FETCH_BOARDLISTS_REQUEST',
      success: 'FETCH_BOARDLISTS_SUCCESS',
      failure: 'FETCH_BOARDLISTS_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + '/api/boardlist/', requestData)
  });
}

// export const createBoardList = (data) => (dispatch, getState) => {
//   const requestData = {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: authHeader(getState)
//   }

//   dispatch({
//     types: {
//       request: 'CREATE_BOARDLIST_REQUEST',
//       success: 'CREATE_BOARDLIST_SUCCESS',
//       failure: 'CREATE_BOARDLIST_FAILURE',
//     },
    
//     apiCallFunction: () => fetchFromApi(config.API_URL + '/api/boardlist/', requestData),
//   });
// }
