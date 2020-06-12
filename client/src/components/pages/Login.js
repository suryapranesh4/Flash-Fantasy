import React, { useState,useEffect }from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import PropTypes from 'prop-types';
import Loader from '../utils/Loader';

const Login = ({
    login,
    auth
}) => {
    const [ loginData,setLoginData ] = useState({
        username : '',
        password : ''
    });
    const [ error,setError ] = useState(''); 
    const { username,password } = loginData ;
    const { loginL } = auth;

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

    const onChange = e => setLoginData({ ...loginData , [e.target.name] : e.target.value });

    function handleLogin(){
        if(username.length === 0)
            setError('Enter username');
        else if(password.length === 0)
            setError('Enter password');
        else
            login(username,password);
    }

    if(auth.isAuthenticated)
        return <Redirect to="/home" />

    return (
        <div>
            {loginL? <Loader/> : ''}
            <div className="flex-cen-min-height">
                <form onSubmit={()=> handleLogin()}>
                    <div className="inputs">
                        <p className="large">Username</p>
                        <input type="text" name="username" value={username} placeholder='User Name' autoComplete="off"
                            onChange={e=>onChange(e)}>
                        </input>
                    </div>
                    <div className="inputs">
                        <p className="large">Password</p>
                        <input type="password" name="password" value={password} autoComplete="off"
                                placeholder='Password' onChange={e=>onChange(e)}>
                        </input>
                    </div>
                    { 
                            error && error.length > 0 ? 
                                <div className="alert alert-danger">
                                    {error}
                                </div> :
                                ''
                        }
                    <div className="btn loginBTN mar-left" onClick={()=> handleLogin() }>
                        <p>Login</p>
                    </div>
                </form>
                <p className="specialColor"><Link to="/signup">Create an account here</Link></p>
            </div>
        </div>
    )
}

Login.propTypes = {
    login : PropTypes.func.isRequired,
    auth : PropTypes.object,
}

const mapStateToProps = state => ({
    auth : state.auth
})

export default connect(
    mapStateToProps,
    { login }
)(Login);