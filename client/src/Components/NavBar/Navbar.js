import React from 'react';
import ToggleButton from './ToggleMenu';
import { Link } from 'react-router-dom';
import { Header, Nav, Space, ProfileOption, ProfileDropdown, ProfileWrapper } from '../Styled Components/navbar';
import { Logout } from '../Styled Components/login';

function NavBar({userData, handleToggle, logout}) {
    return (
      <Header>
          <Nav>
            <div className="desktop">
                <ul>
                    <li><Link to="/home"><i className="fas fa-home"></i></Link></li>
                    <li><Link to="/search"><i className="fas fa-search"></i></Link></li>
                    <li><Link to="/anime">Anime</Link></li>
                    <li><Link to="/manga">Manga</Link></li>
                    <li><Link to="/activity">Activity</Link></li>
                </ul>
            </div>
            <Space />
            <ProfileWrapper className="desktop">
                <ProfileOption>
                    {userData.avatar ? <img src={userData.avatar} alt="User Avatar" /> : <img src="/imagens/placeholder.png" alt="User Avatar" />}
                    <i className="fas fa-caret-down"></i>
                </ProfileOption>
                <ProfileDropdown className="dropdown">
                    <Link to="/profile">Profile</Link>
                    <hr/>
                    <Logout onClick={logout}>Logout</Logout>
                </ProfileDropdown>
            </ProfileWrapper>
            <div>
                <ToggleButton handleToggle={handleToggle} />
            </div>
          </Nav>
      </Header>
    );
}

export default NavBar;

//<Logout onClick={logout}>Logout</Logout>