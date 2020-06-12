import React from 'react';
import { IoIosCloseCircle } from "react-icons/io";

export const Profile = (props) => {
    const { username,squadname,setProfile } = props;
    return (
        <div className="loaderWrapper">
           <div className="profileBox">
               <div className="closeButton" onClick={()=> setProfile(false)}>
                    <IoIosCloseCircle fill="#fc575e" size="30px"/>
               </div>
               <div className="flex-jc-ac">
                <h3>User Name : </h3>
                <h3 className="specialColor">&nbsp;{username}</h3>
               </div>
               <div className="flex-jc-ac">
                <h3>Squad Name : </h3>
                <h3 className="crushColor">&nbsp;{squadname}</h3>
               </div>
           </div>
        </div>
    )
}