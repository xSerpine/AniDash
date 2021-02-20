import React, { useState, useEffect, useContext } from 'react';
import ToggleButton from './ToggleMenu';
import { Link } from 'react-router-dom';
import { Header, Nav, Space, ProfileOption, ProfileDropdown, ProfileWrapper, SpacingElement, Anchor } from '../Styled Components/navbar';
import { Titulo } from '../Styled Components/text';
import { Fragment } from 'react';
import UserContext from '../../Context/UserContext';

const NavBar = ({ guest, handleToggle, logout }) => {
    const user = useContext(UserContext);

    const [isScroll, setIsScroll] = useState(false);
    const [showAnchor, setShowAnchor] = useState(false);

    const handleAnchor = () => {
        window.scrollTo(0, 0);
    }

    const ScrollEvents = () => {
        window.scrollY > 0 ? setIsScroll(true) : setIsScroll(false);

        window.scrollY > 1000 ? setShowAnchor(true) : setShowAnchor(false);
    }

    useEffect(() => {
        window.addEventListener('scroll', ScrollEvents);
        
        return () => {
            window.removeEventListener('scroll', ScrollEvents);
        }

        // eslint-disable-next-line
    }, [])

    return (
        <Fragment>
            <Header className={isScroll && 'active'}>
                <Nav>
                    <Link to={guest ? '/guest' : '/home'}><Titulo className='desktop' style={{fontSize: '30px'}}>Ani<span style={{color: '#fff'}}>Dash</span></Titulo></Link>
                    <Space />
                    <div className='desktop'>
                        <ul>
                            <li><Link to={guest ? '/guest' : '/home'}><i className='fas fa-home'></i></Link></li>
                            <li><Link to={guest ? '/guest/search' : '/search'}><i className='fas fa-search'></i></Link></li>
                            <li><Link to={guest ? '/guest/anime' : '/anime'}>Anime</Link></li>
                            <li><Link to={guest ? '/guest/manga' : '/manga'}>Manga</Link></li>
                            {!guest && 
                                <li><Link to='/activity'>Activity</Link></li>
                            }
                        </ul>
                    </div>
                    <Space />
                    <ProfileWrapper eWrapper className='desktop'>
                        <ProfileOption>
                            {user.avatar ? <img src={user.avatar} alt={`${user.username} avatar`} /> : <img src='/imagens/placeholder.png' alt={`${user.username} avatar`} />}
                            <i className='fas fa-caret-down'></i>
                        </ProfileOption>
                        <ProfileDropdown className='dropdown'>
                            {!guest &&
                                <div>
                                    <i className='fas fa-user'></i>
                                    <Link to={`/profile/${user.username}`}>Profile</Link>
                                </div>
                            }
                            {!guest &&
                                <div>
                                    <i className='fas fa-cog'></i>
                                    <Link to='/settings'>Settings</Link>
                                </div>
                            }
                            {!guest &&
                                <div>
                                    <i className='fas fa-sign-out-alt'></i>
                                    <span onClick={logout}>Logout</span>
                                </div>
                            }
                            {guest &&
                                <div>
                                    <i className='fas fa-sign-in-alt'></i>
                                    <Link to='/'>Login</Link>
                                </div>
                            }
                            {guest &&
                                <div>
                                    <i className='fas fa-user-plus'></i>
                                    <Link to='/register'>Sign up</Link>
                                </div>
                            }
                        </ProfileDropdown>
                    </ProfileWrapper>
                    <div>
                        <ToggleButton handleToggle={handleToggle} />
                    </div>
                </Nav>
            </Header>
            <SpacingElement />
            <Anchor className={showAnchor && 'active'} onClick={handleAnchor}><i className='far fa-arrow-alt-circle-up'></i></Anchor>
        </Fragment>
    );
}

export default NavBar;