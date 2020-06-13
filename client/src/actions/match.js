import { 
    config,
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
    ADD_PLAYER,
    ADD_PLAYER_SUCCESS,
    ADD_PLAYER_FAIL,
    GET_ALL_TEAMS,
    GET_ALL_TEAMS_SUCCESS,
    GET_ALL_TEAMS_FAIL,
    ADD_MATCH,
    ADD_MATCH_SUCCESS,
    ADD_MATCH_FAIL
} from './types';

import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

//Get all matches
export const getAllMatches = () => async dispatch => {
    dispatch({ type: GET_ALL_MATCHES });
    if(localStorage.getItem('token')){
        setAuthToken(localStorage.getItem('token'));
    }

    try{
        var res = await axios.get("/api/matches/all",config);

        dispatch({
            type: GET_ALL_MATCHES_SUCCESS,
            payload: res.data
        });

    }catch(err){
        dispatch({
            type: GET_ALL_MATCHES_FAIL,
            payload: err
        });
    }
}

//Get matches by username
export const getUserMatches = () => async dispatch => {
    dispatch({ type: GET_USER_MATCHES });
    if(localStorage.getItem('token')){
        setAuthToken(localStorage.getItem('token'));
    }

    try{
        var res = await axios.get("/api/matches/username",config);

        dispatch({
            type: GET_USER_MATCHES_SUCCESS,
            payload: res.data
        });

    }catch(err){
        dispatch({
            type: GET_USER_MATCHES_FAIL,
            payload: err
        });
    }
}

//Get current match by team halfnames
export const getCurrentMatch = (team_one_halfname,team_two_halfname) => async dispatch => {
    dispatch({ type: GET_CURRENT_MATCH });
    if(localStorage.getItem('token')){
        setAuthToken(localStorage.getItem('token'));
    }

    const body = JSON.stringify({ team_one_halfname, team_two_halfname });

    try{
        var res = await axios.post("/api/matches/currentmatch",body,config);

        dispatch({
            type: GET_CURRENT_MATCH_SUCCESS,
            payload: res.data
        });

    }catch(err){
        dispatch({
            type: GET_CURRENT_MATCH_FAIL,
            payload: err
        });
    }
}

//submit a match_team
export const submitTeam = (team_one_halfname,team_two_halfname,new_team) => async dispatch => {
    dispatch({ type: SUBMIT_TEAM });
    if(localStorage.getItem('token')){
        setAuthToken(localStorage.getItem('token'));
    }

    const body = JSON.stringify({ team_one_halfname,team_two_halfname,new_team });

    try{
        var res = await axios.patch("/api/matches/addTeam",body,config);

        dispatch({
            type: SUBMIT_TEAM_SUCCESS,
            payload: res.data
        });

    }catch(err){
        dispatch({
            type: SUBMIT_TEAM_FAIL,
            payload: err
        });
    }
}



//ADMIN

//add a team
export const addTeam = (fullname,halfname) => async dispatch => {
    dispatch({ type: ADD_TEAM });
    if(localStorage.getItem('token')){
        setAuthToken(localStorage.getItem('token'));
    }

    const body = JSON.stringify({ fullname,halfname });

    try{
        var res = await axios.post("/api/teams",body,config);

        dispatch({
            type: ADD_TEAM_SUCCESS,
            payload: res.data
        });

    }catch(err){
        dispatch({
            type: ADD_TEAM_FAIL,
            payload: err
        });
    }
}

//add a player
export const addPlayer = (team,firstname,lastname,position_fullname,position_halfname) => async dispatch => {
    dispatch({ type: ADD_PLAYER });
    if(localStorage.getItem('token')){
        setAuthToken(localStorage.getItem('token'));
    }

    const body = JSON.stringify({ team,firstname,lastname,position_fullname,position_halfname });

    try{
        var res = await axios.post("/api/players",body,config);

        dispatch({
            type: ADD_PLAYER_SUCCESS,
            payload: res.data
        });

    }catch(err){
        dispatch({
            type: ADD_PLAYER_FAIL,
            payload: err
        });
    }
}

//get all teams
export const getAllTeams = () => async dispatch => {
    dispatch({ type: GET_ALL_TEAMS });
    if(localStorage.getItem('token')){
        setAuthToken(localStorage.getItem('token'));
    }

    try{
        var res = await axios.get("/api/teams/all",config);

        dispatch({
            type: GET_ALL_TEAMS_SUCCESS,
            payload: res.data
        });

    }catch(err){
        dispatch({
            type: GET_ALL_TEAMS_FAIL,
            payload: err
        });
    }
}

//add a match
export const addMatch =  (team_one_halfname,team_one_fullname,team_two_halfname,team_two_fullname,start_time) => async dispatch => {
    console.log(team_one_halfname,team_one_fullname,team_two_halfname,team_two_fullname,start_time);
    dispatch({ type: ADD_MATCH });
    if(localStorage.getItem('token')){
        setAuthToken(localStorage.getItem('token'));
    }

    const body = JSON.stringify({ team_one_fullname,team_one_halfname,team_two_fullname,team_two_halfname,start_time });

    try{
        var res = await axios.post("/api/matches",body,config);

        dispatch({
            type: ADD_MATCH_SUCCESS,
            payload: res.data
        });

    }catch(err){
        dispatch({
            type: ADD_MATCH_FAIL,
            payload: err
        });
    }
}