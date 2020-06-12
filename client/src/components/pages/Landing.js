import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({
    auth
}) => {

    if(auth.isAuthenticated)
        return <Redirect to="/home"/>

    return (
        <div>
            <div className="flex-cen-min-height specialColor">
                <p className="x-large">Welcome to Flash Fantasy</p>
                <p className="large">Play the game and Have fun!</p>
                <div className="homeButtons">
                    <div className="btn signupBTN"><Link to="/signup">Sign Up</Link></div>
                    <div className="btn loginBTN"><Link to="/login">Log In</Link></div>
                </div>
            </div>
        </div>
    )
}

Landing.propTypes = {
    auth : PropTypes.object,
}

const mapStateToProps = state => ({
    auth : state.auth
})

export default connect(
    mapStateToProps,
    {  }
)(Landing);