import React from 'react';
import { connect } from 'react-redux';
import { remainingTime } from '../../utils/functions';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const UpcomingMatch = ({
    match
}) => {

    const { matches } = match;

    return (
        <div className="upcomingMatchPage">
            <h3>Upcoming Matches</h3>
            <div className="upcomingMatchBlock">
                {matches.map((match,index)=>{
                    return(
                        <div key={match._id}>
                            <Link to={`/match/${match.team_one_halfname}vs${match.team_two_halfname}`}>
                                <div className="matchBoxParent">
                                    <div className="matchBox">
                                        <div className="matchnamediv">
                                            <p className="text-small">{match.team_one_fullname}</p>
                                            <p className="text-small">{match.team_two_fullname}</p>
                                        </div>
                                        <div className="matchnamediv">
                                            <p className="specialColor">{match.team_one_halfname}</p>
                                            <p>{remainingTime(match.start_time)}</p>
                                            <p className="crushColor">{match.team_two_halfname}</p>
                                        </div>
                                    </div>
                                    <div className="specialCrush playMatch">Play this match</div>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

UpcomingMatch.propTypes = {
    match: PropTypes.object
}

const mapStateToProps = state => ({
    match : state.match
});

export default connect(
    mapStateToProps,
    { }
)(UpcomingMatch);