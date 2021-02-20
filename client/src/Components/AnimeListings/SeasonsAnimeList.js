import React, { useState, useEffect } from 'react';
import { API } from '../../Hooks/API';
import GenericContentList from '../GenericComponents/GenericContentList';
import { Spinner } from '../Styled Components/loader';

const SeasonsAnimeList = ({ list, year, SFW, guest }) => {
    const [loading, setLoading] = useState(true);
    const [seasonsAnime, setSeasonsAnime] = useState([]);

    const getSeasonsAnime = async() => {
        const { data } = await API(
            'GET', 
            ['winter', 'spring', 'summer', 'fall'].includes(list) ?
                `https://api.jikan.moe/v3/season/${year}/${list}`
                :
                'https://api.jikan.moe/v3/season/later'
        );

        const slicedSeasonsAnimeArray = data.anime.slice(0, data.anime.length > 50 ? 50 : data.anime.length);
        const sortSeasonsAnimeArray = slicedSeasonsAnimeArray.sort((a, b) => b.members - a.members);

        setSeasonsAnime(SFW ? sortSeasonsAnimeArray.filter(anime => anime.r18 === false) : sortSeasonsAnimeArray);
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