export const config = {
    headers: {
        'Content-Type' : 'application/json'
    }
}

//User Signup - Login - Logout
export const SIGNUP = 'SIGNUP';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAIL = 'SIGNUP_FAIL';

export const USER_LOAD = 'USER_LOAD';
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';

export const LOGIN = 'LOGIN'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const LOGOUT = 'LOGOUT';


//Matches
export const GET_ALL_MATCHES = 'GET_ALL_MATCHES';
export const GET_ALL_MATCHES_SUCCESS = 'GET_ALL_MATCHES_SUCCESS';
export const GET_ALL_MATCHES_FAIL = 'GET_ALL_MATCHES_FAIL';

export const GET_USER_MATCHES = 'GET_USER_MATCHES';
export const GET_USER_MATCHES_SUCCESS = 'GET_USER_MATCHES_SUCCESS';
export const GET_USER_MATCHES_FAIL = 'GET_USER_MATCHES_FAIL';

export const GET_CURRENT_MATCH = 'GET_CURRENT_MATCH';
export const GET_CURRENT_MATCH_SUCCESS = 'GET_CURRENT_MATCH_SUCCESS';
export const GET_CURRENT_MATCH_FAIL = 'GET_CURRENT_MATCH_FAIL';

export const SUBMIT_TEAM = 'SUBMIT_TEAM';
export const SUBMIT_TEAM_SUCCESS = 'SUBMIT_TEAM_SUCCESS';
export const SUBMIT_TEAM_FAIL = 'SUBMIT_TEAM_FAIL';