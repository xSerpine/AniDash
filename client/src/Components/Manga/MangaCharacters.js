import React, { useState, useEffect } from 'react';
import { SpacingElement } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';
import GenericContentCharacters from '../GenericComponents/GenericContentCharacters';
import { API } from '../../Hooks/API';

function MangaCharacters({ id_manga }) {
    const [loading, setLoading] = useState(true);
    const [characters, setCharacters] = useState([]);

    const getCharacters = async() => {
        const { data } = await API('GET', `https://api.jikan.moe/v3/manga/${id_manga}/characters`);
        setCharacters(data.characters);
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
            type='manga'
            array={characters}
            emptyMessage="Couldn't find any characters."
        />
    );
}

export default MangaCharacters;