import { authHeader } from '../helpers/authHeader';
import { fetchFromApi } from "react-redux-api-tools";
import { config } from '../Constants';

export const fetchBoards = () => (dispatch, getState) => {
   const requestData = {
      method: 'GET',
      headers: authHeader(getState)
   }

   dispatch({
      types: {
         request: 'FETCH_BOARDS_REQUEST',
         success: 'FETCH_BOARDS_SUCCESS',
         failure: 'FETCH_BOARDS_FAILURE',
      },

      apiCallFunction: () => fetchFromApi(config.API_URL + '/api/board/', requestData)
   });
}

export const createBoard = (data) => (dispatch, getState) => {
   const requestData = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeader(getState)
   }

   dispatch({
      types: {
         request: 'CREATE_BOARD_REQUEST',
         success: 'CREATE_BOARD_SUCCESS',
         failure: 'CREATE_BOARD_FAILURE',
      },

      apiCallFunction: () => fetchFromApi(config.API_URL + '/api/board/', requestData),
   });
}

export const deleteBoard = (id) => (dispatch, getState) => {
   const requestData = {
      method: 'DELETE',
      headers: authHeader(getState)
   }

   dispatch({
      types: {
         request: 'DELETE_BOARD_REQUEST',
         success: 'DELETE_BOARD_SUCCESS',
         failure: 'DELETE_BOARD_FAILURE',
      },

      apiCallFunction: () => fetchFromApi(config.API_URL + `/api/board/${id}/`, requestData),

      extraData: {
         deleted_id: id
      }
   });
}
