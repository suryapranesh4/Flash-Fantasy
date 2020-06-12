import React from 'react';
import { connect } from 'react-redux';
import { remainingTime } from '../../utils/functions';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Usermatches = ({
    match,
}) => {

    const { usermatches } = match;

    return (
        <div className="userMatchPage">
            <h3>My Matches</h3>
            <div className="userMatchBlock">
                {usermatches.map((match,index)=>{
                    return(
                        <div key={match._id} className="matchBoxParent">
                            <Link to={`/match/${match.team_one_halfname}vs${match.team_two_halfname}`}>
                                <div className="matchBox">
                                    <div className="matchnamediv">
                                        <p className="text-small">{match.team_one_fullname}</p>
                                        <p className="text-small">{match.team_two_fullname}</p>
                                    </div>
                                    <div className="matchnamediv">
                                        <p className="specialColor">{match.team_one_halfname}</p>
                                        <p>{remainingTime(match.start_time,"top")}</p>
                                        <p className="crushColor">{match.team_two_halfname}</p>
                                    </div>
                                </div>
                                <div className={remainingTime(match.start_time,"class")}>{remainingTime(match.start_time,"bottom")}</div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

Usermatches.propTypes = {
    match: PropTypes.object,
}


const mapStateToProps = state => ({
    match : state.match
});

export default connect(
    mapStateToProps,
    { }
)(Usermatches);