import { authHeader } from '../helpers/authHeader';
import { fetchFromApi } from "react-redux-api-tools";
import { config } from '../Constants';

export const searchCompany = (query) => (dispatch, getState) => {
  const requestData = {
      method: 'GET',
      headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'SEARCH_COMPANY_REQUEST',
      success: 'SEARCH_COMPANY_SUCCESS',
      failure: 'SEARCH_COMPANY_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + '/api/company/?search=' + encodeURI(query), requestData)
  });
}

export const clearSearch = () => (dispatch, getState) => {
   dispatch({
      type: 'CLEAR_SEARCH'
   });
}