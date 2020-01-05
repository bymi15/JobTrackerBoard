import { combineReducers } from 'redux';
import api_auth from './api_auth';
import api_application from './api_application';
import api_board from './api_board';
import api_boardlist from './api_boardlist';
import api_stage from './api_stage';
import api_company from './api_company';
import dashboard from './dashboard';
import map from './map';

export default combineReducers({
   api_auth,
   api_application,
   api_board,
   api_boardlist,
   api_stage,
   api_company,
   dashboard,
   map
})