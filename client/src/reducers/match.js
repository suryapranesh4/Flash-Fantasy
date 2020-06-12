import { 
    GET_ALL_MATCHES,
    GET_ALL_MATCHES_SUCCESS,
    GET_ALL_MATCHES_FAIL,
    GET_USER_MATCHES,
    GET_USER_MATCHES_SUCCESS,
    GET_USER_MATCHES_FAIL,
    GET_CURRENT_MATCH,
    GET_CURRENT_MATCH_SUCCESS,
    GET_CURRENT_MATCH_FAIL,
    SUBMIT_TEAM,
    SUBMIT_TEAM_SUCCESS,
    SUBMIT_TEAM_FAIL
} from '../actions/types';

const initialState = { };

export default function( state = initialState , action){
    const { type, payload } = action;
    switch(type){

        case GET_ALL_MATCHES:
            return{
                ...state,
                getallmatchL : true
            }
        case GET_ALL_MATCHES_SUCCESS:
            return{
                ...state,
                ...payload,
                getallmatchL : false
            }  
        case GET_ALL_MATCHES_FAIL:
            return{
                ...state,
                getallmatchL : false
            }


        case GET_USER_MATCHES:
            return{
                ...state,
                getusermatchL : true
            }
        case GET_USER_MATCHES_SUCCESS:
            return{
                ...state,
                ...payload,
                getusermatchL : false
            }  
        case GET_USER_MATCHES_FAIL:
            return{
                ...state,
                getusermatchL : false
            }

        case GET_CURRENT_MATCH:
            return{
                ...state,
                getcurrentmatchL : true
            }   
        case GET_CURRENT_MATCH_SUCCESS:
            return{
                ...state,
                ...payload,
                getcurrentmatchL : false
            }  
        case GET_CURRENT_MATCH_FAIL:
            return{
                ...state,
                getcurrentmatchL : false
            }

        case SUBMIT_TEAM:
            return{
                ...state,
                submitteamL : true
            }   
        case SUBMIT_TEAM_SUCCESS:
            return{
                ...state,
                ...payload,
                submitteamL : false
            }  
        case SUBMIT_TEAM_FAIL:
            return{
                ...state,
                submitteamL : false
            }
        default:
            return state
    } 
}