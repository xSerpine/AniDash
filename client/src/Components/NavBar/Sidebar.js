import React, { useContext } from 'react';
import { SideNav } from '../Styled Components/navbar';
import { Link } from 'react-router-dom';
import { SubTitulo, Titulo } from '../Styled Components/text';
import UserContext from '../../Context/UserContext';

function SideBar({ guest, estado, logout }) {
    const user = useContext(UserContext);

    let classes = '';

    if(estado) classes = 'open'; 
    return (
       <SideNav className={classes}>
           <div>
                <Titulo style={{fontSize: '25px'}}>Ani<span style={{color: '#fff'}}>Dash</span></Titulo>
                <SubTitulo style={{fontSize: '15px', textAlign: 'center'}}>Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a></SubTitulo>
           </div>
           <ul>
                <li><Link to={guest ? '/guest' : '/home'}><i className='fas fa-home'></i></Link></li>
                <li><Link to={guest ? '/guest/search' : '/search'}><i className='fas fa-search'></i></Link></li>
                <li><Link to={guest ? '/guest/anime' : '/anime'}>Anime</Link></li>
                <li><Link to={guest ? '/guest/manga' : '/manga'}>Manga</Link></li>
                {!guest &&
                    <li><Link to='/activity'>Activity</Link></li>
                }
                {!guest &&
                    <li><Link to={`/profile/${user.username}`}>Profile</Link></li>
                }
                {!guest &&
                    <li><span onClick={logout}>Logout</span></li>
                }
                {guest &&
                    <li><Link to='/'>Login</Link></li>
                }
                {guest &&
                    <li><Link to='/register'>Sign up</Link></li>
                }
           </ul>
       </SideNav>
    );
}

export default SideBar;