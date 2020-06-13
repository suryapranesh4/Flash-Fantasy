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
    SUBMIT_TEAM_FAIL,
    ADD_TEAM,
    ADD_TEAM_SUCCESS,
    ADD_TEAM_FAIL,
    GET_ALL_TEAMS,
    GET_ALL_TEAMS_SUCCESS,
    GET_ALL_TEAMS_FAIL,
    ADD_PLAYER,
    ADD_PLAYER_SUCCESS,
    ADD_PLAYER_FAIL,
    ADD_MATCH,
    ADD_MATCH_SUCCESS,
    ADD_MATCH_FAIL
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

        case ADD_TEAM:
            return{
                ...state,
                addteamL : true
            }   
        case ADD_TEAM_SUCCESS:
            return{
                ...state,
                ...payload,
                addteamL : false
            }  
        case ADD_TEAM_FAIL:
            return{
                ...state,
                error : payload.response.data.error,
                addteamL : false
            }

        case GET_ALL_TEAMS:
            return{
                ...state,
                getallteamL : true
            }   
        case GET_ALL_TEAMS_SUCCESS:
            return{
                ...state,
                ...payload,
                getallteamL : false
            }  
        case GET_ALL_TEAMS_FAIL:
            return{
                ...state,
                error : payload.response.data.error,
                getallteamL : false
            }

        case ADD_PLAYER:
            return{
                ...state,
                addplayerL : true
            }   
        case ADD_PLAYER_SUCCESS:
            return{
                ...state,
                ...payload,
                addplayerL : false
            }  
        case ADD_PLAYER_FAIL:
            return{
                ...state,
                error : payload.response.data.error,
                addplayerL : false
            }

        case ADD_MATCH:
            return{
                ...state,
                addmatchL : true
            }   
        case ADD_MATCH_SUCCESS:
            return{
                ...state,
                ...payload,
                addmatchL : false
            }  
        case ADD_MATCH_FAIL:
            return{
                ...state,
                error : payload.response.data.error,
                addmatchL : false
            }
        default:
            return state
    } 
}