import React, { useState,useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { submitTeam } from '../../actions/match';
import { Wrong, Wright, remainingTime } from '../../utils/functions';
import { TiFlash,TiFlashOutline } from 'react-icons/ti';
import { TeamPreview } from '../utils/TeamPreview';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, Redirect } from 'react-router-dom';
import Loader from '../utils/Loader';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const Team = ({
    auth,
    match,
    submitTeam
}) => {

    const { currentmatch, currentteam, currentteamexists, matchteamadd, submitteamL } = match;
    const { user } = auth;
    const [ squadTeam,setSquadTeam ] = useState([]);
    const [ preview,setPreview ] = useState(false);

    const [ gkCount,setGkCount ] = useState(0);
    const [ defCount,setDefCount ] = useState(0);
    const [ midCount,setMidCount ] = useState(0);
    const [ stkCount,setStkCount ] = useState(0);
    const [ teamCount,setTeamCount ] = useState(0);

    const [ gkStatus,setGkStatus ] = useState(false);
    const [ defStatus,setDefStatus ] = useState(false);
    const [ midStatus,setMidStatus ] = useState(false);
    const [ stkStatus,setStkStatus ] = useState(false);
    const [ teamStatus,setTeamStatus ] = useState(false);

    const [ teamAddError, showTeamAddError ] = useState(false);
    const [ error,setError ] = useState(''); 

    const [ selectPlayerList,setSelectPlayerList ] = useState([]);
    const [ captain, setCaptain ] = useState({label:"Points * 2"});
    const [ captainStatus,setCaptainStatus ] = useState(false);
    const [ vicecaptain, setViceCaptain ] = useState({label:"Points * 1.5"});
    const [ viceCaptainStatus,setViceCaptainStatus ] = useState(false);

    if(auth && !auth.isAuthenticated)
        return <Redirect to="/login"/>

    useEffect(()=>{
        if(matchteamadd){
            window.location.href=`/match/${currentmatch.team_one_halfname}vs${currentmatch.team_two_halfname}`;
        }
        if(matchteamadd === false){
            setError('Please re-login and create/edit team!');
            showTeamAddError(true);
        }

        if(showTeamAddError){
            setTimeout(function(){
                setError('');
                showTeamAddError(false);
            },3000);
        }
    })

    useEffect(() => {

        if(currentteamexists){
            setSquadTeam([...currentteam.players]);
            setTeamCount(11);
            setGkStatus(true);
            setDefStatus(true);
            setMidStatus(true);
            setStkStatus(true);
            let deft = 0 ,midt = 0, stkt = 0, gkt = 0;
            currentteam.players.forEach((player)=>{
                if(player.position_halfname === "gk")
                    gkt += 1;
                if(player.position_halfname === "def")
                    deft += 1;
                if(player.position_halfname === "mid")
                    midt += 1;
                if(player.position_halfname === "stk")
                    stkt += 1;
                if(player.isCaptain){
                    setCaptain({ value:player.firstname, label: player.lastname});
                    setCaptainStatus(true);
                }
                if(player.isViceCaptain){
                    setViceCaptain({ value:player.firstname, label: player.lastname});
                    setViceCaptainStatus(true);
                }
            });
            setDefCount(deft);
            setMidCount(midt);
            setStkCount(stkt);
            setGkCount(gkt);
            setTeamStatus(true);
            if(currentteam && currentteam.players){
                let playerList = [];
                currentteam.players.forEach(p => 
                    playerList.push({
                        label: p.lastname,
                        value: p.firstname
                    })
                );
                setSelectPlayerList([...playerList]);
            }
        }

    }, [])

    function submitSquad(players){
        if(captain.label === vicecaptain.label && captain.value === vicecaptain.value){
            setError('Choose different Captain and Vice-Captain!');
            showTeamAddError(true);
        }
        else{
            let new_team = {};
            new_team.username = user.username;
            new_team.squadname = user.squadname;
            new_team.players = players;
            new_team.points = 0;
            new_team.players.forEach((player)=>{
                if(player.firstname === captain.value && player.lastname === captain.label)
                    player.isCaptain = true;
                else
                    player.isCaptain = false;

                if(player.firstname === vicecaptain.value && player.lastname === vicecaptain.label)
                    player.isViceCaptain = true;
                else
                    player.isViceCaptain = false;
            })
            submitTeam(currentmatch.team_one_halfname,currentmatch.team_two_halfname,new_team);
        }
    }


    function isPlayerInSquad(player){
        let inSquad = false;
        squadTeam && squadTeam.length > 0 && squadTeam.forEach(p => {
            if(p.firstname === player.firstname && p.lastname === player.lastname)
                inSquad = true;
            }
        )
        return inSquad;
    }

    function playerRowClass(player){
        let inSquad = isPlayerInSquad(player)
        if(inSquad)
            return 'specialCrush selectRow';
        if(teamCount === 11)
            return 'cantSelect';
        else{
            switch(player.position_halfname){
                case "gk":
                    if(gkStatus)
                        return 'cantSelect';
                    else    
                        return 'selectRow';
                case "def":
                    if(defCount >= 5)
                        return 'cantSelect';
                    else    
                        return 'selectRow';
                case "mid":
                    if(midCount >= 5)
                        return 'cantSelect';
                    else    
                        return 'selectRow';
                case "stk":
                    if(stkCount >=3 )
                        return 'cantSelect';
                    else    
                        return 'selectRow';
                default:
                    return 'selectRow';
            }
        }
        
    }

    function addplayer(player){
        if(!(playerRowClass(player) === 'cantSelect')){
            let tempSquad = [...squadTeam];
            let inSquad = isPlayerInSquad(player);
            if(inSquad){
                switch(player.position_halfname){
                    case "gk":
                        if(gkCount-1 === 1)
                            setGkStatus(true);
                        else
                            setGkStatus(false);
                        setGkCount(gkCount-1);
                        break;

                    case "def":
                        if(defCount-1 >=3 && defCount-1 <=5)
                            setDefStatus(true);
                        else
                            setDefStatus(false);
                        setDefCount(defCount-1);
                        break;

                    case "mid":
                        if(midCount-1 >=3 && midCount-1 <=5)
                            setMidStatus(true);
                        else
                            setMidStatus(false);
                        setMidCount(midCount-1);
                        break;

                    case "stk":
                        if(stkCount-1 >=1 && stkCount-1 <=3)
                            setStkStatus(true);
                        else
                            setStkStatus(false);
                        setStkCount(stkCount-1);
                        break;

                    default:
                        break;
                }
                if(teamCount-1 === 11)
                    setTeamStatus(true);
                else
                    setTeamStatus(false);
                setTeamCount(teamCount-1);

                tempSquad = tempSquad.filter(p => { return p.firstname !== player.firstname && p.lastname !== player.lastname });
                setSquadTeam([...tempSquad]);

                let tSelect = [...selectPlayerList];
                tSelect.forEach((p,index) =>{
                    if(p.value === player.firstname && p.label === player.lastname)
                        tSelect.splice(index,1);
                })
                setSelectPlayerList([...tSelect]);
            }
            else{
                switch(player.position_halfname){
                    case "gk":
                        if(gkCount+1 === 1)
                            setGkStatus(true);
                        else
                            setGkStatus(false);
                        setGkCount(gkCount+1);
                        break;

                    case "def":
                        if(defCount+1 >=3 && defCount+1 <=5)
                            setDefStatus(true);
                        else
                            setDefStatus(false);
                        setDefCount(defCount+1);
                        break;

                    case "mid":
                        if(midCount+1 >=3 && midCount+1 <=5)
                            setMidStatus(true);
                        else
                            setMidStatus(false);
                        setMidCount(midCount+1);
                        break;

                    case "stk":
                        if(stkCount+1 >=1 && stkCount+1 <=3)
                            setStkStatus(true);
                        else
                            setStkStatus(false);
                        setStkCount(stkCount+1);
                        break;

                    default:
                        break;
                }
                if(teamCount+1 === 11)
                    setTeamStatus(true);
                else
                    setTeamStatus(false);
                setTeamCount(teamCount+1);

                tempSquad.push({...player});
                setSquadTeam([...tempSquad]);

                let tSelect = [...selectPlayerList];
                tSelect.push({
                    value: player.firstname,
                    label: player.lastname
                });
                setSelectPlayerList([...tSelect]);
            }
        }
    }

    function chooseCaptain(player){
        setCaptain(player);
        setCaptainStatus(true);
    }


    function chooseViceCaptain(player){
        setViceCaptain(player);
        setViceCaptainStatus(true);
    }

    return (
        <div>
            { submitteamL ? <Loader/> : ''}
            { preview ? <TeamPreview players={squadTeam} setPreview={setPreview} squadname={user.squadname} 
                        captain={captain.label !== "Points * 2" ? captain.label : 'Not Selected'}
                        vicecaptain={vicecaptain.label !== "Points * 1.5" ? vicecaptain.label : 'Not Selected'}/> : ''}
            <div className="page-minht currentMatchDiv">
                {
                    currentmatch ?
                        <div>
                            <div className="currentmatchheader">
                                <div className="text-small">
                                    <Link to={`/match/${currentmatch.team_one_halfname}vs${currentmatch.team_two_halfname}`} style={{cursor:"pointer"}}>
                                        <IoIosArrowBack size="20px" fill="#fff"/>
                                    </Link>
                                </div>
                                <div className="text-small">
                                    <p className="matchTitle">{currentmatch.team_one_fullname} Vs {currentmatch.team_two_fullname}</p>
                                    {
                                        !remainingTime(currentmatch.start_time,"matchstarted") ? 
                                            <p>{remainingTime(currentmatch.start_time)}</p> :
                                                ''
                                    }
                                </div>
                                <div>
                                </div>
                            </div>
                            <div className="squadNameEdit">
                                <div className="createEditButton" 
                                    onClick={()=> setPreview(true)}>
                                    Team Preview
                                </div>
                                <div className="squadNameEdit">
                                    <p>Squad : </p>
                                    <h3 className="specialColor">&nbsp;{user.squadname}</h3>
                                </div>
                                {
                                    captainStatus && viceCaptainStatus &&
                                        teamStatus && gkStatus && defStatus && midStatus && stkStatus &&
                                        !(remainingTime(currentmatch.start_time,"matchstarted")) ?
                                            <div className="submitButton" onClick={() => submitSquad(squadTeam)}>
                                                Submit Team
                                            </div> :
                                            <div className="submitOpacity">
                                            Submit Team
                                            </div>
                                }
                                
                            </div>
                            <div className="flex-jc-ac">
                                <div className="selectDiv">
                                    <p className="specialColor"> Captain </p>
                                    <Dropdown onChange={(player) => chooseCaptain(player)} 
                                                    value={captain} 
                                                    options={selectPlayerList} />
                                </div>
                                <div className="selectDiv">
                                    <p className="crushColor"> Vice Captain </p>
                                    <Dropdown onChange={(player) => chooseViceCaptain(player)} 
                                                value={vicecaptain} 
                                                options={selectPlayerList}/>
                                </div>
                            </div>
                            {
                                teamAddError ?
                                <div className="alert alert-danger">
                                    {error}
                                </div>  : ''
                            }
                        </div>
                    :
                        ''
                }
                {
                    currentmatch ?
                        <table cellSpacing="0" cellPadding="0" className="tablemar">
                            <thead>
                                <tr>
                                    <th>Goalkeeper</th>
                                    <th>Defender</th>
                                    <th>Midfielder</th>
                                    <th>Striker</th>
                                    <th>11 Players</th>
                                </tr>
                                <tr className="steelColorOpacity">
                                    <th>Select 1</th>
                                    <th>Select 3-5</th>
                                    <th>Select 3-5</th>
                                    <th>Select 1-3</th>
                                    <th>Select 11</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{ gkStatus ? <Wright/> : <Wrong/> }</td>
                                    <td>{ defStatus ? <Wright/> : <Wrong/> }</td>
                                    <td>{ midStatus ? <Wright/> : <Wrong/> }</td>
                                    <td>{ stkStatus ? <Wright/> : <Wrong/> }</td>
                                    <td>{ teamStatus ? <Wright/> : <Wrong/> }</td>
                                </tr>
                            </tbody>
                        </table> 
                        : ''
                }
                <div className="tablemar">
                    {
                        currentmatch && currentmatch.match_players && currentmatch.match_players.length > 0 ?
                            <table cellSpacing="0" cellPadding="0">
                                <thead>
                                    <tr className="blackTR">
                                        <th>Playername</th>
                                        <th>Position</th>
                                        <th>Club</th>
                                        <th>Select player</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    currentmatch.match_players.map((player,index)=>{
                                            return (
                                            <tr key={index} 
                                                className={playerRowClass(player)}
                                                onClick={()=> addplayer(player)}>
                                                <td>
                                                    <p>
                                                        {player.firstname !== " " ?
                                                        `${player.firstname[0]}.${player.lastname}` :
                                                        player.lastname}
                                                    </p>
                                                </td>
                                                <td><p>{player.position_fullname}</p></td>
                                                <td><p>{player.team_halfname}</p></td>
                                                <td className="flex-jc-ac">
                                                    {
                                                        isPlayerInSquad(player) ?
                                                        <div className="addbutton">
                                                            <TiFlash fill="#ffffff" size="20px"/>
                                                        </div> :
                                                        <div className="addbutton">
                                                            <TiFlashOutline fill="#fc575e" size="20px"/>
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                            )
                                    })
                                }
                                </tbody>
                            </table>
                            :
                            <div className="flex-jc-ac">
                                No players found for this match!
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

Team.propTypes = {
    auth : PropTypes.object,
    match : PropTypes.object,
    submitTeam: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth : state.auth,
    match : state.match,
})

export default connect(
    mapStateToProps,
    { submitTeam }
)(Team);