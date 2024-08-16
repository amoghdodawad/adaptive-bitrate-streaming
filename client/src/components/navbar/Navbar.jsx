import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../redux/userSlice';

function Navbar() {
    const { token } = useSelector(store => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function onLogout(){
        dispatch(removeUser());
        navigate('/');
    }

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="nav-link">Home</Link>
            </div>
            <div className="navbar-right">
                {token && <Link to="/video/upload" className="nav-link">Upload</Link>}
                {token && <div className='nav-link' onClick={onLogout}>Logout</div>}
                {!token && <Link to="/login" className="nav-link">Login</Link>}
            </div>
        </nav>
    );
}

export default Navbar;