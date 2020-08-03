import React, { useState, Fragment } from 'react';
import BrowseAnimeManga from './BrowseAnimeManga';
import { SearchOptions } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import BrowseUsers from './BrowseUsers';

function BrowseAniDash() {
    const [option, setOption] = useState("");

    const handleChoice = (choice) => {
        setOption(choice);
    }

    return (
        <Fragment>
            <Titulo primary>Search Options</Titulo>
            <SearchOptions>
                {["Anime/Manga", "Users"].map((options, index) => (  
                    <p onClick={() => handleChoice(options)} key={index}>{options}</p>       
                ))}
            </SearchOptions>  
            {option === "Anime/Manga" && <BrowseAnimeManga />}
            {option === "Users" && <BrowseUsers />}
        </Fragment>
    );
}

export default BrowseAniDash;