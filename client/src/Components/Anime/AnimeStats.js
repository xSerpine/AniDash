import React, { useState, useEffect } from 'react';
import GenericContentStats from '../GenericComponents/GenericContentStats';
import { Spinner } from '../Styled Components/loader';
import { SpacingElement } from '../Styled Components/navbar';

const AnimeStats = ({ id_anime }) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);

    const getStats = async() => {
        const res = await fetch(`https://api.jikan.moe/v3/anime/${id_anime}/stats`);
        const StatsArray = await res.json();

        setStats(StatsArray);

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