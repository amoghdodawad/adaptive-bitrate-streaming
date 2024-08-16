import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { checkValidData } from '../../utils/validate';
import './Login.css';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Login() {
    const [ isSignUp, setIsSignUp ] = useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const nameRef = useRef(null);
    const bioRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const next = useSearchParams()[0].get('next');

    function addToStore(name, email, token, bio = ''){
        dispatch(setUser({ name, email, token, bio }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = checkValidData(emailRef.current.value, passwordRef.current.value);
            if(response){
                toast.error(response);
                return;
            }
            if(isSignUp){
                const response = await fetch('/auth/signup', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        name: nameRef.current.value,
                        email: emailRef.current.value,
                        password: passwordRef.current.value,
                        bio: bioRef.current.value
                    })
                });
                const json = await response.json();
                if(response.status === 400){
                    toast.error(json.message);
                    return;
                }
                const { name, email, token } = json;
                addToStore(name,email,token);
                toast.success(`Welcome ${name}`, { duration: 6000 });
                navigate(next ? next : '/');
            } else {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        email: emailRef.current.value,
                        password: passwordRef.current.value
                    })
                });
                const json = await response.json();
                if(response.status === 400){
                    toast.error(json.message);
                    return;
                }
                const { name, email, token } = json;
                addToStore(name,email,token);
                toast.success(`Welcome back ${name}`, { duration: 6000 });
                navigate(next ? next : '/');
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
                {isSignUp && (
                    <div className="input-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" ref={nameRef} required />
                    </div>
                )}
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" ref={emailRef} required />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={passwordRef} required />
                </div>
                {isSignUp && (
                    <div className="input-group">
                        <label htmlFor="bio">Bio (optional)</label>
                        <textarea id="bio" ref={bioRef}></textarea>
                    </div>
                )}
                <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
                <p onClick={() => setIsSignUp(!isSignUp)} className="toggle-form">
                    {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
                </p>
            </form>
        </div>
    );
}

export default Login;