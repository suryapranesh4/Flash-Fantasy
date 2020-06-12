import React,{ useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Loader from '../utils/Loader';
import { getCurrentMatch } from '../../actions/match';
import { remainingTime } from '../../utils/functions';
import { IoIosArrowBack, IoIosAddCircle } from 'react-icons/io';
import { MdModeEdit } from 'react-icons/md';
import { GrGroup } from 'react-icons/gr';
import { Link , Redirect } from 'react-router-dom';
import { currentTeamTable } from '../../utils/functions';

const Match = ({
    auth,
    match,
    getCurrentMatch
}) => {

    const { currentmatch, currentteam, currentteamexists } = match;
    const { getcurrentmatchL } = match;
    const [ teamDetail , showTeamDetail ] = useState(true);
    const [ leaderDetail, showLeaderDetail ] = useState(false);

    if(auth && !auth.isAuthenticated)
        return <Redirect to="/login"/>
    

    useEffect(()=>{

        function getTeams(){
            let string = window.location.href.split('/');
            let match = string[string.length - 1];
            let teams = match.split('vs');
            return({
                team_one : teams[0],
                team_two : teams[1]
            })
        }

        async function fetchData() {
            var team = await getTeams();
            await getCurrentMatch(team.team_one,team.team_two);
          }
        fetchData();

    },[])

    function showTeamDet(){
        showTeamDetail(true);
        showLeaderDetail(false);
    }

    function showLeaderDet(){
        showTeamDetail(false);
        showLeaderDetail(true);
    }

    return (
        <div>
            { getcurrentmatchL ? <Loader/> : ''}
            <div className="page-minht currentMatchDiv">
                {
                currentmatch ? 
                    <div className="pagemin">
                        <div className="currentmatchheader">
                            <div className="text-small">
                                <Link to="/home" style={{cursor:"pointer"}}>
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

                        <div className="flex-jc-ac">
                            <div className={ teamDetail ? "teamDiv flex-jc-ac selectedDiv" : "teamDiv flex-jc-ac"} onClick={()=> showTeamDet()}>
                                My Team
                            </div>
                            <div className={leaderDetail ? "leaderboardDiv flex-jc-ac selectedDiv" : "leaderboardDiv flex-jc-ac"} onClick={()=> showLeaderDet()}>
                                Leaderboard
                            </div>
                        </div>

                        <div className="matchDetails">
                            {
                                teamDetail ?
                                    currentteamexists ?
                                        <div>
                                            <div className="squadNameEdit">
                                                <div/>
                                                <div className="squadNameEdit">
                                                    <p>Squad : </p>
                                                    <h3 className="specialColor">&nbsp;{currentteam.squadname}</h3>
                                                </div>
                                                {
                                                    !remainingTime(currentmatch.start_time,"matchstarted") ?
                                                    <div className="createEditButton">
                                                        {
                                                            currentmatch.points_added ?
                                                                `${currentteam.points} Points` : 
                                                                <Link to="/team" className="flex-jc-ac">
                                                                    Edit team
                                                                    <MdModeEdit fill="#28a745" size="15px"/>
                                                                </Link> 
                                                        }
                                                    </div> :
                                                    <div/>
                                                }
                                            </div>
                                            <div className="">
                                                {currentTeamTable(currentteam)}
                                            </div> 
                                        </div>
                                        :
                                        <div className="noTeamDiv">
                                            <div className="flex-jc-ac">
                                                <h3 className="noTeamColor">You haven't created your team</h3>
                                                <GrGroup fill="#99999e" size="20px"/>
                                            </div>
                                            {
                                                !remainingTime(currentmatch.start_time,"matchstarted") ?
                                                    <div className="createEditButton bottomlast">
                                                        <Link to="/team" className="flex-jc-ac">
                                                            Crete your team
                                                            <IoIosAddCircle fill="#28a745" size="15px"/>
                                                        </Link> 
                                                    </div>
                                                    :
                                                    ''
                                            }
                                        </div>
                                :
                                <div>
                                    {
                                        currentmatch.points_added ? 
                                            <div>
                                                <h3 className="specialColor flex-jc-ac">
                                                    All Hail the champions!!
                                                </h3>
                                            </div>
                                        :
                                        <div className="createyourteam">
                                            <div>{remainingTime(currentmatch.start_time,"leaderboard")}</div>
                                        </div>
                                    }
                                    {
                                        currentmatch.match_teams.length > 0 ?
                                        <div>
                                            <table cellSpacing="0" cellPadding="0">
                                                <thead>
                                                    <tr>
                                                        <th>Username</th>
                                                        <th>Squadname</th>
                                                        <th>Points</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    currentmatch.match_teams.map((team,index)=>{
                                                            return (
                                                            <tr key={index}>
                                                                <td><p>{team.username}</p> </td>
                                                                <td><p>{team.squadname}</p></td>
                                                                <td><p>{team.points}</p></td>
                                                            </tr>
                                                            )
                                                    })
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                            :
                                        !remainingTime(currentmatch.start_time,"matchstarted") ? 
                                            <h3 className="noTeamColor flex-jc-ac">No squads are created, YET!</h3> :
                                            <h3 className="noTeamColor flex-jc-ac">No squads are created!></h3>
                                    }
                                </div>
                            }
                        </div> 

                    </div>
                    : ''
                }
            </div>
        </div>
    )
}

Match.propTypes = {
    auth : PropTypes.object,
    match : PropTypes.object,
    getCurrentMatch : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth : state.auth,
    match : state.match,
})

export default connect(
    mapStateToProps,
    {  getCurrentMatch }
)(Match);