import React, { useState, Fragment } from 'react';
import BrowseContent from './BrowseContent';
import { SearchOptions } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import BrowseUsers from './BrowseUsers';
import { SpacingElement } from '../Styled Components/navbar';

const BrowseAniDash = ({ guest }) => {
    document.title = 'Browse • AniDash';
    
    const [option, setOption] = useState(undefined);

    const handleChoice = (choice) => {
        setOption(choice);
    }

    return (
        <Fragment>
            <SpacingElement unwrapped />
            <Titulo primary>Search Options</Titulo>
            {!guest ?
                <SearchOptions>
                    {['Anime/Manga', 'Users'].map((options, index) => (  
                        <p onClick={() => handleChoice(options)} key={index}>{options}</p>       
                    ))}
                </SearchOptions>  
                :
                <SearchOptions style={{gridTemplateColumns: 'auto'}}>
                    <p onClick={() => handleChoice('Anime/Manga')}>Anime/Manga</p>       
                </SearchOptions> 
            }
            {option === 'Anime/Manga' && <BrowseContent guest={guest} />}
            {!guest && option === 'Users' && <BrowseUsers />}
        </Fragment>
    );
}

export default BrowseAniDash;