import React, { useState, Fragment } from 'react';
import BrowseContent from './BrowseContent';
import { SearchOptions } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import BrowseUsers from './BrowseUsers';
import { SpacingElement } from '../Styled Components/navbar';

const Browse = ({ guest }) => {
    document.title = 'Browse • AniDash';
    
    const [option, setOption] = useState(guest ? 'Anime/Manga' : undefined);

    const handleChoice = (choice) => {
        setOption(choice);
    }

    return (
        <Fragment>
            <SpacingElement unwrapped />
            {!guest ?
                <Titulo primary>Search Options</Titulo>
                :
                <Titulo>Browse</Titulo>
            }
            {!guest &&
                <SearchOptions>
                    {['Anime/Manga', 'Users'].map((options, index) => (  
                        <p onClick={() => handleChoice(options)} key={index}>{options}</p>       
                    ))}
                </SearchOptions> 
            }
            {option === 'Anime/Manga' && <BrowseContent guest={guest} />}
            {!guest && option === 'Users' && <BrowseUsers />}
        </Fragment>
    );
}

export default Browse;