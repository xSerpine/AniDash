import React from 'react';
import { SideNav } from '../Styled Components/navbar';
import { Link } from 'react-router-dom';
import { Titulo } from '../Styled Components/text';
import { Logout } from '../Styled Components/login';

function SideBar({estado, logout}) {
    let classes = '';

    if(estado) classes = 'open'; 
    return (
       <SideNav className={classes}>
           <Titulo>AniDash</Titulo>
           <ul>
                <li><Link to="/home"><i className="fas fa-home"></i></Link></li>
                <li><Link to="/search"><i className="fas fa-search"></i></Link></li>
                <li><Link to="/anime">Anime</Link></li>
                <li><Link to="/manga">Manga</Link></li>
                <li><Link to="/activity">Activity</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Logout onClick={logout}>Logout</Logout></li>
           </ul>
       </SideNav>
    );
}

export default SideBar;