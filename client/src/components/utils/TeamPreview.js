import React from 'react';
import { IoIosCloseCircle } from "react-icons/io";

export const TeamPreview = (props) => {
    const { players,setPreview,squadname,captain,vicecaptain } = props;
    return (
        <div className="loaderWrapper">
           <div className="profileBox">
               <div className="closeButton" onClick={()=> setPreview(false)}>
                    <IoIosCloseCircle fill="#fc575e" size="30px"/>
               </div>
            <div>
            <div className="squadNameEdit">
                <div className="squadNameEdit">
                    <p>Squad : </p>
                    <h3 className="specialColor">&nbsp;{squadname}</h3>
                </div>
            </div>
            <div className="flex-jc-ac">
                <div className="selectDiv captDiv">
                    <p>Captain : </p>
                    <p className="specialColor">{captain}</p>
                </div>
                <div className="selectDiv captDiv">
                    <p>Vice Captain : </p>
                    <p className="specialColor">{vicecaptain}</p>
                </div>
            </div>
            {
                players && players.length > 0 ?
                    <table cellSpacing="0" cellPadding="0">
                        <thead>
                            <tr>
                                <th>Playername</th>
                                <th>Position</th>
                                <th>Club</th>
                                <th>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            players.map((player,index)=>{
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
                <div className="steelColor flex-jc-ac"> 
                    Add players to your team! 
                </div>
            }
            </div>
        </div>
    </div>
    )
}