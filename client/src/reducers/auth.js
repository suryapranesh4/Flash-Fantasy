import { 
    SIGNUP,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    USER_LOAD,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null
}

export default function( state = initialState , action){
    const { type, payload } = action;
    switch(type){
        
        case SIGNUP:
            return{
                ...state,
                signupL : true
            }
        case SIGNUP_SUCCESS:
            localStorage.setItem('token',payload.token);
            return{
                ...state,
                ...payload,
                isAuthenticated : true,
                signupL : false 
            }  
        case SIGNUP_FAIL:
            localStorage.removeItem('token');
            return{
                ...state,
                error : payload.response.data.error,
                token : null,
                isAuthenticated : false,
                signupL : false 
            }

        case USER_LOAD:
            return{
                ...state,
                userloadL : true
            }
        case USER_LOADED:
            return{
                ...state,
                isAuthenticated : true,
                userloadL : false,
                user : payload,
            } 
        case AUTH_ERROR:
            localStorage.removeItem('token');
            return{
                ...state,
                token : null,
                isAuthenticated : false,
                userloadL : false
            }

        case LOGIN:
            return{
                ...state,
                loginL : true
            }
        case LOGIN_SUCCESS:
            localStorage.setItem('token',payload.token);
            return{
                ...state,
                ...payload,
                isAuthenticated : true,
                loginL : false
            }  
        case LOGIN_FAIL:
            localStorage.removeItem('token');
            return{
                ...state,
                error : payload.response.data.error,
                token : null,
                isAuthenticated : false,
                loginL : false
            }

        case LOGOUT:
            localStorage.removeItem('token');
            return{
                ...state,
                token : null,
                isAuthenticated : false,
            }
        default:
            return state
    } 
}