import { authHeader } from '../helpers/authHeader';
import { fetchFromApi } from "react-redux-api-tools";
import { config } from '../Constants';

export const fetchApplications = () => (dispatch, getState) => {
  const requestData = {
      method: 'GET',
      headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'FETCH_APPLICATIONS_REQUEST',
      success: 'FETCH_APPLICATIONS_SUCCESS',
      failure: 'FETCH_APPLICATIONS_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + '/api/application/', requestData)
  });
}

export const fetchApplicationsByBoard = (board_id) => (dispatch, getState) => {
  const requestData = {
      method: 'GET',
      headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'FETCH_APPLICATIONS_BY_BOARD_REQUEST',
      success: 'FETCH_APPLICATIONS_BY_BOARD_SUCCESS',
      failure: 'FETCH_APPLICATIONS_BY_BOARD_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + `/api/application/board/${board_id}/`, requestData)
  });
}

export const createApplication = (data) => (dispatch, getState) => {
  const requestData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'CREATE_APPLICATION_REQUEST',
      success: 'CREATE_APPLICATION_SUCCESS',
      failure: 'CREATE_APPLICATION_FAILURE',
    },
    apiCallFunction: () => fetchFromApi(config.API_URL + '/api/application/', requestData),
  });
}

export const updateApplication = (id, data) => (dispatch, getState) => {
  const requestData = {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'UPDATE_APPLICATION_REQUEST',
      success: 'UPDATE_APPLICATION_SUCCESS',
      failure: 'UPDATE_APPLICATION_FAILURE',
    },
    apiCallFunction: () => fetchFromApi(config.API_URL + `/api/application/${id}/`, requestData),

    extraData: {
       order_index: data.order_index
    }
  });
}

export const updateApplicationUI = (data) => (dispatch, getState) => {
  dispatch({
     type: 'UPDATE_APPLICATION_UI',
     payload: data
  });
}

export const setApplication = (application) => (dispatch, getState) => {
  dispatch({
     type: 'SET_APPLICATION',
     payload: application
  });
}

export const deleteApplication = (id, board_list_id) => (dispatch, getState) => {
  const requestData = {
     method: 'DELETE',
     headers: authHeader(getState)
  }

  dispatch({
     types: {
        request: 'DELETE_APPLICATION_REQUEST',
        success: 'DELETE_APPLICATION_SUCCESS',
        failure: 'DELETE_APPLICATION_FAILURE',
     },

     apiCallFunction: () => fetchFromApi(config.API_URL + `/api/application/${id}/`, requestData),

     extraData: {
        deleted_id: id,
        board_list_id: board_list_id
     }
  });
}

export const addNote = (data) => (dispatch, getState) => {
  const requestData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'ADD_NOTE_REQUEST',
      success: 'ADD_NOTE_SUCCESS',
      failure: 'ADD_NOTE_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + '/api/note/', requestData),
  });
}

export const deleteNote = (id) => (dispatch, getState) => {
  const requestData = {
    method: 'DELETE',
    headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'DELETE_NOTE_REQUEST',
      success: 'DELETE_NOTE_SUCCESS',
      failure: 'DELETE_NOTE_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + `/api/note/${id}/`, requestData),

    extraData: {
       deleted_id: id
    }
  });
}

export const addInterview = (data) => (dispatch, getState) => {
  const requestData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'ADD_INTERVIEW_REQUEST',
      success: 'ADD_INTERVIEW_SUCCESS',
      failure: 'ADD_INTERVIEW_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + '/api/interview/', requestData),
  });
}

export const deleteInterview = (id) => (dispatch, getState) => {
  const requestData = {
    method: 'DELETE',
    headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'DELETE_INTERVIEW_REQUEST',
      success: 'DELETE_INTERVIEW_SUCCESS',
      failure: 'DELETE_INTERVIEW_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + `/api/interview/${id}/`, requestData),

    extraData: {
       deleted_id: id
    }
  });
}

export const addQuestion = (data) => (dispatch, getState) => {
  const requestData = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'ADD_QUESTION_REQUEST',
      success: 'ADD_QUESTION_SUCCESS',
      failure: 'ADD_QUESTION_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + '/api/question/', requestData),
  });
}

export const deleteQuestion = (id) => (dispatch, getState) => {
  const requestData = {
    method: 'DELETE',
    headers: authHeader(getState)
  }

  dispatch({
    types: {
      request: 'DELETE_QUESTION_REQUEST',
      success: 'DELETE_QUESTION_SUCCESS',
      failure: 'DELETE_QUESTION_FAILURE',
    },

    apiCallFunction: () => fetchFromApi(config.API_URL + `/api/question/${id}/`, requestData),

    extraData: {
       deleted_id: id
    }
  });
}
