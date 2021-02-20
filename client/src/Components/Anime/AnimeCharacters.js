import React, { useState, useEffect } from 'react';
import { API } from '../../Hooks/API';
import GenericContentCharacters from '../GenericComponents/GenericContentCharacters';
import { Spinner } from '../Styled Components/loader';
import { SpacingElement } from '../Styled Components/navbar';

const AnimeCharacters = ({ id_anime }) => {
    const [loading, setLoading] = useState(true);
    const [characters, setCharacters] = useState([]);

    const getCharacters = async() => {
        const { data } = await API('GET', `https://api.jikan.moe/v3/anime/${id_anime}/characters_staff`);
        setCharacters(data.characters.slice(0, data.characters.length > 50 ? 50 : data.characters.length));
        setLoading(false);
    }

    useEffect(() => {
        const loadingTime = setTimeout(() => {
            getCharacters();
        }, 1000);

        return () => clearTimeout(loadingTime);
   
        // eslint-disable-next-line
    }, [])

    if(loading) return (
        <>
            <SpacingElement unwrapped />
            <Spinner />
        </>
    )

    return (
        <GenericContentCharacters 
            type='anime'
            array={characters}
            emptyMessage="Couldn't find any characters."
        />
    );
}

export default AnimeCharacters;