import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signup } from '../../actions/auth';
import PropTypes from 'prop-types';
import Loader from '../utils/Loader';

const Signup = ({ 
    signup,
    auth
 }) => {
    const [ signupData,setSignupData ] = useState({
        username : '',
        squadname : '',
        password : '',
        cpassword : ''
    });
    const [ error,setError ] = useState(''); 
    const { username,squadname,password,cpassword } = signupData;
    const { signupL } = auth;

    useEffect(() => {
        if(error && error.length > 0){
            setTimeout(function(){
                setError('');
            },5000);
        }
        if(auth && auth.error){
            setError(auth.error);
            auth.error = '';
        }
    })

    const onChange = e => setSignupData({ ...signupData , [e.target.name] : e.target.value });

    function handleSignup(){
        if( username.length === 0 || squadname.length === 0 || password.length === 0 || cpassword.length === 0)
            setError('Please fill in the necessary fields!');
        else if(username === squadname){
            setError('Username & Squadname must not be the same!');
        }
        else if(password !== cpassword)
            setError('Passwords does not match!');
        else if(password.length <=6)
            setError('Password length is too low!');
        else
            signup(username,squadname,password);
    }

    if(auth.isAuthenticated)
        return <Redirect to="/home" />

    return (
        <div>
            { signupL ? <Loader/> : ''}
            <div className="flex-cen-min-height">
                <div className="flex-cen-min-height">
                    <h1 className="specialColor">Register account</h1>
                    <form onSubmit={()=> handleSignup()}>
                        <div className="inputs">
                            <p>User name</p>
                            <input type="text" name="username" value={username} placeholder='User Name' autoComplete="off"
                                    onChange={e=>onChange(e)} required>
                            </input>
                        </div>
                        <div className="inputs">
                            <p>Squadname</p>
                            <input type="text" name="squadname" value={squadname} placeholder='Squad Name' autoComplete="off"
                                    onChange={e=>onChange(e)} required>
                            </input>
                        </div>
                        <div className="inputs">
                            <p>Password<span className="specialColor text-small"> (minLength - 6)</span></p>
                            <input type="password" name="password" value={password} placeholder='Password' autoComplete="off"
                                    onChange={e=>onChange(e)} required minLength='6'>
                            </input>
                        </div>
                        <div className="inputs">
                            <p>Confirm Password</p>
                            <input type="password" name="cpassword" value={cpassword} autoComplete="off"
                                    placeholder='Confirm Password' onChange={e=>onChange(e)} required minLength='6'>
                            </input>
                        </div>
                        { 
                            error && error.length > 0 ? 
                                <div className="alert alert-danger">
                                    {error}
                                </div> :
                                ''
                        }
                        <div className="btn loginBTN mar-left" onClick={()=> handleSignup()}>Sign Up</div>
                    </form>
                    <div>Already an user, <span className="specialColor"><Link to="/login">Log In</Link></span></div>
                </div>
            </div>
        </div>
    )
}

Signup.propTypes = {
    signup : PropTypes.func.isRequired,
    auth : PropTypes.object,
}

const mapStateToProps = state => ({
    auth : state.auth
})

export default connect(
    mapStateToProps,
    { signup }
)(Signup);