import { authHeader } from '../helpers/authHeader';
import { fetchFromApi } from "react-redux-api-tools";
import { config } from '../Constants';

export const fetchStages = () => (dispatch, getState) => {
    const requestData = {
        method: 'GET',
        headers: authHeader(getState)
    }

    dispatch({
        types: {
            request: 'FETCH_STAGES_REQUEST',
            success: 'FETCH_STAGES_SUCCESS',
            failure: 'FETCH_STAGES_FAILURE',
        },

        apiCallFunction: () => fetchFromApi(config.API_URL + '/api/stage/', requestData)
    });
}

// export const fetchMultipleProducts = () => {
//     return {
//         types: {
//             request: 'FETCH_MULTIPLE_PRODUCTS',
//             success: 'FETCH_MULTIPLE_PRODUCTS_SUCCESS',
//             failure: 'FETCH_MULTIPLE_PRODUCTS_FAILURE',
//         },
//         apiCallFunction: () => Promise.all([fetchFromApi('/api/inventory/1'), fetchFromApi('/api/inventory/2'),])
//     };
// }