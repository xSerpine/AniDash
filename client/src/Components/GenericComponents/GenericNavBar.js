import React, { Fragment } from 'react';
import NavBar from '../NavBar/Navbar';
import SideBar from '../NavBar/Sidebar';

const GenericNavBar = ({
    guest,
    open,
    backdrop,
    handleToggle,
    logout
}) => {
    return (
        <Fragment>
            <NavBar guest={guest} handleToggle={handleToggle} logout={logout} />
			<SideBar guest={guest} estado={open} logout={logout} />
			{backdrop}
        </Fragment>
    );
}

export default GenericNavBar;