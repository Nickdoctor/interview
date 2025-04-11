import React, { useState } from 'react';
import { signUp, logIn, logOut } from '../Utils/auth.js';
import { useNavigate } from 'react-router-dom';
import '../Styles/AuthPage.css';
//import { button } from 'react-bootstrap';
import { Typography } from '@mui/material';

const AuthPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign Up and Log In

    const handleAuth = async () => {
        if (isSignUp) {
            const { error } = await signUp(email, password);
            if (error) {
                alert(`Sign Up Failed: ${error}`);
            } else {
                alert('Sign Up Successful! Please log in.');
                setIsSignUp(false);
            }
        } else {
            const { error } = await logIn(email, password);
            if (error) {
                alert(`Log In Failed: ${error}`);
            } else {
                alert('Log In Successful!');
                navigate('/'); // Redirect to home page or dashboard after successful login
            }
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <form className="p-4 bg-white rounded shadow hover-card container-md"style={{ maxWidth: '1000px' }}>
                <h1 className="text-2xl font-bold mb-4 text-center">
                    {isSignUp ? 'Create Account' : 'Log In'}
                </h1>
                <div class="row justify-content-center">
                    <div class="col-md-4">
                        <div class="form-floating mb-3">
                            <input type="email" class="form-control" id="floatingEmail" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            <label for="floatingEmail">Email address</label>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-md-4">
                        <div class="form-floating mb-3">
                            <input type="password" class="form-control" id="floatingPassword" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <label for="floatingPassword">Password</label>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <button
                        onClick={handleAuth}
                        className="btn btn-primary me-3"
                    >
                        {isSignUp ? 'Sign Up' : 'Log In'}
                    </button>
                    <button
                        onClick={logOut}
                        className="btn btn-primary me-3"
                    >Log Out
                    </button>
                </div>
                <Typography className="mt-4 text-center text-sm">
                    {isSignUp ? 'Already have an account?   ' : "Don't have an account?   "}{' '}
                    <button type="button" class="btn btn-primary me-3"
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? 'Log In' : 'Sign Up'}
                    </button>
                </Typography>
            </form>
        </div>
    );
};

export default AuthPage;