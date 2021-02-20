import React, { useState, useEffect } from 'react';
import { API } from '../../Hooks/API';
import GenericContentStats from '../GenericComponents/GenericContentStats';
import { Spinner } from '../Styled Components/loader';
import { SpacingElement } from '../Styled Components/navbar';

const AnimeStats = ({ id_anime }) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);

    const getStats = async() => {
        const { data } = await API('GET', `https://api.jikan.moe/v3/anime/${id_anime}/stats`);
        setStats(data);
        setLoading(false);
    }

    useEffect(() => {
        const loadingTime = setTimeout(() => {
            getStats();
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
        <GenericContentStats 
            type='anime'
            array={stats}
        />
    );
}

export default AnimeStats;