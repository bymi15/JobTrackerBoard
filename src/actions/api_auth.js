import { authHeader } from '../helpers/authHeader';
import { fetchFromApi } from "react-redux-api-tools";
import { config } from '../Constants';

export const fetchAuthUser = () => (dispatch, getState) => {
    const requestData = {
        method: 'GET',
        headers: authHeader(getState)
    }

    dispatch({
        types: {
            request: 'FETCH_AUTHUSER_REQUEST',
            success: 'FETCH_AUTHUSER_SUCCESS',
            failure: 'FETCH_AUTHUSER_FAILURE',
        },

        apiCallFunction: () => fetchFromApi(config.API_URL + '/api/auth/user/', requestData)
    });
}

export const login = (data) => {
    const requestData = {
        method: 'POST',
        body: JSON.stringify(data)
    }

    return {
        types: {
            request: 'LOGIN_REQUEST',
            success: 'LOGIN_SUCCESS',
            failure: 'LOGIN_FAILURE',
        },

        apiCallFunction: () => fetchFromApi(config.API_URL + '/api/auth/login/', requestData)
    };
}

export const logout = () => (dispatch, getState) => {
    const requestData = {
        method: 'POST',
        headers: authHeader(getState)
    }

    dispatch({
        types: {
            request: 'LOGOUT_REQUEST',
            success: 'LOGOUT_SUCCESS',
            failure: 'LOGOUT_FAILURE',
        },

        apiCallFunction: () => fetchFromApi(config.API_URL + '/api/auth/logout/', requestData)
    });
}

export const register = (data) => {
    const requestData = {
        method: 'POST',
        body: JSON.stringify(data)
    }

    return {
        types: {
            request: 'REGISTER_REQUEST',
            success: 'REGISTER_SUCCESS',
            failure: 'REGISTER_FAILURE',
        },

        apiCallFunction: () => fetchFromApi(config.API_URL + '/api/user/', requestData)
    };
}