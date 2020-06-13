import React,{ useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllMatches, getUserMatches } from '../../actions/match';
import UpcomingMatch from '../utils/UpcomingMatch';
import UserMatches from '../utils/UserMacthes';
import Loader from '../utils/Loader';
import { Redirect } from 'react-router-dom';

const Home = ({
    auth,
    match,
    getAllMatches,
    getUserMatches
}) => {

    const { matches,usermatches } = match;
    const { getallmatchL,getusermatchL } = match;

    useEffect(() => {
        getAllMatches();
        getUserMatches();
    }, [])

    if(auth && !auth.isAuthenticated)
        return <Redirect to="/login"/>

    return (
        <div>
            {getallmatchL || getusermatchL ? <Loader/> : ''}
            <div className="page-minht">
                { usermatches && usermatches.length > 0 ? <UserMatches /> : '' }
                { matches && matches.length > 0 ? <UpcomingMatch /> : '' }
            </div>
        </div>
    )
}

Home.propTypes = {
    auth : PropTypes.object,
    match : PropTypes.object,
    getAllMatches : PropTypes.func.isRequired,
    getUserMatches : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth : state.auth,
    match : state.match,
})

export default connect(
    mapStateToProps,
    { getAllMatches, getUserMatches }
)(Home);