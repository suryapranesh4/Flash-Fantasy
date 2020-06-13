import React from 'react';
import { TiCancel,TiTick } from 'react-icons/ti';

export function remainingTime(time,place){
    var d = new Date(Date.parse(time));
    var s = new Date();    
    s = new Date(s.getTime() - s.getTimezoneOffset() * 60000);
    var diffMs = Math.abs(d - s);
    var days = Math.floor(diffMs / 86400000); 
    var hours = Math.floor((diffMs % 86400000) / 3600000); 
    var minutes = Math.floor(((diffMs % 86400000) % 3600000) / 60000);
    if(place === "top"){
        if(s.getTime() > d.getTime()){
            let ms = Math.abs(s-d);
            let min = Math.floor((ms/1000/60) << 0);
            // let sec = Math.floor((ms/1000) % 60);
            if(min > 120)
                return (<span className="steelColor">In Review</span>)
            else
                return (<span className="goGreen">Live</span>)
        }
        if(days > 0)
            return `${days} days ${hours} h ${minutes}m`;
        return `${hours}h ${minutes}m`;
    }
    else if(place === "bottom"){
        if(s.getTime() > d.getTime())
            return (<div className="steelColorBack playMatch">View your team</div>);
        else
            return (<div className="specialCrush playMatch">Manage team</div>);
    }
    else if(place === "leaderboard"){
        if(s.getTime() > d.getTime()){
            let ms = Math.abs(s-d);
            let min = Math.floor((ms/1000/60) << 0);
            if(min > 120)
                return (
                    <p className="steelColor createyourteam">
                        <span>Points In Review!</span>
                        <span>Here's a list of your competitors!</span>
                    </p>
                )
            else
                return (
                    <p className="goGreen createyourteam">
                        <span>The Game is LIVE now!!</span>
                        <span>Here's a list of your competitors!</span>
                    </p>
                )
        }
        return (
                <p className="createyourteam">
                    <span>Patience matters! Game hasn't started!</span>
                    <span>Here's a list of your competitors!</span>
                </p>
            );
    }
    else if(place === "matchstarted"){
        if(s.getTime() > d.getTime())
            return true;
        else
            return false;
    }
    else{
        if(days > 0)
            return `${days} days ${hours} h ${minutes}m`;
        return `${hours}h ${minutes}m`;
    }
}


export async function getCurrentUserTeamIndex(match,user){
    let result = {
        present : false,
        index : -1,
        players : []
    };
    match.match_teams.forEach((team,index)=>{
        if(team.username === user.username){
            result.present = true;
            result.index = index;
            result.players = team.players;
            result.squadname = team.squadname;
            result.points = match.match_teams[index].points;
        }
    });
    return result;
}

export function currentTeamTable(team){
    return(
        <div>
        {
            team.players && team.players.length > 0 ?
                <table cellSpacing="0" cellPadding="0">
                    <thead>
                        <tr>
                            <th>Position</th>
                            <th>Playername</th>
                            <th>Club</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        team.players.map((player,index)=>{
                                return (
                                <tr key={index}>
                                    <td>
                                        <p>
                                            {player.firstname !== " " ?
                                            `${player.firstname[0]}.${player.lastname}` :
                                            player.lastname}
                                        </p>
                                    </td>
                                    <td><p>{player.position_fullname}</p></td>
                                    <td><p>{player.team_halfname}</p></td>
                                    <td><p>{player.points ? player.points : 0}</p></td>
                                </tr>
                                )
                        })
                    }
                    </tbody>
                </table>
            : 
            ''
        }
        </div>
    )
}


export const Wrong = () => {
    return (
        <div className="addbutton">
            <TiCancel fill="#dc3545" size="20px"/>
        </div>
    )
}

export const Wright = () => {
    return (
        <div className="addbutton">
            <TiTick fill="#28a745" size="20px"/>
        </div>
    )
}