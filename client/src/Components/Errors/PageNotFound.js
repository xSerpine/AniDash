import React from 'react';
import { Link } from 'react-router-dom';
import { Message } from '../Styled Components/content';
import { FullPageWrapper } from '../Styled Components/form';

const PageNotFound = () => {
    document.title = '404 • AniDash'
    return (
        <FullPageWrapper other>
            <Message>
                Oh no... It's a 404.
                <br />
                We need to go back!
                <br/><br/>
                Take me <Link to='/'>home</Link>!
            </Message>
        </FullPageWrapper>
    );
}

export default PageNotFound;