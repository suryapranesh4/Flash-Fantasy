import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component , auth: { isAuthenticated, userloadL }, 
                        match: { getallmatchL, getcurrentmatchL, getusermatchL }, ...rest }) => (
    <Route {...rest} 
        render={ 
            props => 
                !(userloadL || getallmatchL || getcurrentmatchL || getusermatchL) && !isAuthenticated ? 
                    <Redirect to="/" /> 
                : 
                <Component {...props} />
            }
    />
)

PrivateRoute.propTypes = {
    auth : PropTypes.object,
    match: PropTypes.object
}

const mapStateToProps = state => ({
    auth : state.auth,
    match : state.match
})

export default connect(
     mapStateToProps,
    { }
)(PrivateRoute);

