import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API } from '../../Hooks/API';
import GenericContentList from '../GenericComponents/GenericContentList';
import { Spinner } from '../Styled Components/loader';

const TopAnimeList = ({ guest }) => {
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setcurrentPage] = useState(1);
    const [topAnime, setTopAnime] = useState([]);

    const observer = useRef();

    const lastElement = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setcurrentPage(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node)
    }, [loading, hasMore]);

    const getTopAnime = async() => {
        const { data } = await API('GET', `https://api.jikan.moe/v3/top/anime/${currentPage}`);
        data.top.length === 0 ? setHasMore(false) : setHasMore(true);
        setTopAnime(topAnime.concat(data.top));
        setLoading(false);
    }

    useEffect(() => {
        getTopAnime();

        // eslint-disable-next-line
    }, [currentPage]);

    if(loading) return <Spinner />

    return (
        <GenericContentList
            guest={guest}
            listType='anime'
            array={topAnime}
            propertiesOption='jikanAPI'
            item1='Type'
            item2='Episodes'
            item3='Score'
            lastElement={lastElement}
            hasMore={hasMore}
            emptyMessage="Couldn't find any top anime."
        />
    );
}

export default TopAnimeList;