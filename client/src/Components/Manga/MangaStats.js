import React, { useState, useEffect } from 'react';
import { SpacingElement } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';
import GenericContentStats from '../GenericComponents/GenericContentStats';

function MangaStats({ id_manga }) {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState([]);

    const getStats = async() => {
        const res = await fetch(`https://api.jikan.moe/v3/manga/${id_manga}/stats`);
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
            type='manga'
            array={stats}
        />
    );
}

export default MangaStats;