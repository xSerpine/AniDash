import React, { useState, useEffect } from 'react';
import GenericContentList from '../GenericComponents/GenericContentList';
import { Spinner } from '../Styled Components/loader';

const SeasonsAnimeList = ({ list, year, SFW, guest }) => {
    const [loading, setLoading] = useState(true);
    const [seasonsAnime, setSeasonsAnime] = useState([]);

    const getSeasonsAnime = async() => {
        const res = await fetch(
            ['winter', 'spring', 'summer', 'fall'].includes(list) ?
                `https://api.jikan.moe/v3/season/${year}/${list}`
                :
                'https://api.jikan.moe/v3/season/later'
        );
        const SeasonsAnimeArray = await res.json();

        const filteredSeasonsAnimeArray = SFW ? 
            SeasonsAnimeArray.anime.filter(anime => anime.r18 === false)
            :
            SeasonsAnimeArray.anime;
        const sortSeasonsAnimeArray = filteredSeasonsAnimeArray.sort((a, b) => b.members - a.members);
        const slicedSeasonsAnimeArray = list === 'later' && [...sortSeasonsAnimeArray].slice(0, sortSeasonsAnimeArray.length > 50 ? 50 : sortSeasonsAnimeArray.length);

        setSeasonsAnime(list === 'later' ? slicedSeasonsAnimeArray : sortSeasonsAnimeArray);

        setLoading(false);
    }

    useEffect(() => {  
        getSeasonsAnime();   

        // eslint-disable-next-line
    }, [list]);

    if(loading) return <Spinner />

    return ( 
        <GenericContentList 
            guest={guest}
            listType='anime'
            array={seasonsAnime}
            propertiesOption='jikanAPI'
            item1='Type'
            item2='Episodes'
            item3='Score'
            emptyMessage="Couldn't find any season anime."
        />
    );
}

export default SeasonsAnimeList;