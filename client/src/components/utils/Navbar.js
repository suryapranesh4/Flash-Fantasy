import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { TiFlash } from 'react-icons/ti';
import { Profile } from '../utils/Profile';

const Navbar = ({
    auth,
    logout
}) => {

    const { isAuthenticated,loading } = auth;
    if(auth.user)
    var { username,squadname } = auth.user;
    const [ profile,setProfile ] = useState(false);

    return (
        <div className="navbar specialCrush">
            { isAuthenticated && squadname && username ? <p className="profile" onClick={()=> setProfile(true)}>Profile</p> : '' }
            { profile && username && squadname ? <Profile username={username} squadname={squadname} setProfile={setProfile} /> : ''}
            <div className="x-large" style={{cursor:"pointer"}}>
                <Link to="/" className="flex-jc-ac">
                    <TiFlash fill="#dfb52c" size="25px"/>
                    Flash Fantasy
                </Link>
            </div>
            { isAuthenticated && !loading? <p className="logout" onClick={()=> logout()}>Logout</p> : ''}
        </div>
    )
}

Navbar.propTypes = {
    auth : PropTypes.object,
    logout : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    { logout }
)(Navbar);