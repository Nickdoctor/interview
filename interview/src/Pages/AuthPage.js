import React, { useState } from 'react';
import { signUp, logIn, logOut } from '../Utils/auth.js';
import { useNavigate } from 'react-router-dom';
import '../Styles/AuthPage.css'; 
import { button } from 'react-bootstrap'; 

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {isSignUp ? 'Create Account' : 'Log In'}
                </h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg p-2"
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg p-2"
                        placeholder="Enter your password"
                    />
                </div>
                <button
                    onClick={handleAuth}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {isSignUp ? 'Sign Up' : 'Log In'}
                </button>
                <button
                    onClick={logOut}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition mt-4"
                >Log Out
                </button>

                <p className="mt-4 text-center text-sm">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button type="button" class="btn btn-primary"
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? 'Log In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;