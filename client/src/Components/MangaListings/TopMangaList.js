import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API } from '../../Hooks/API';
import GenericContentList from '../GenericComponents/GenericContentList';
import { Spinner } from '../Styled Components/loader';

const TopMangaList = ({ guest }) => {
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setcurrentPage] = useState(1);
    const [topManga, setTopManga] = useState([]);

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
    }, [loading, hasMore])

    const getTopManga = async() => {
        const { data } = await API('GET', `https://api.jikan.moe/v3/top/manga/${currentPage}`);
        data.top.length === 0 ? setHasMore(false) : setHasMore(true);
        setTopManga(topManga.concat(data.top));
        setLoading(false);
    }

    useEffect(() => {
        getTopManga();

        // eslint-disable-next-line
    }, [currentPage]);

    if(loading) return <Spinner />

    return (
        <GenericContentList
            guest={guest}
            listType='manga'
            array={topManga}
            propertiesOption='jikanAPI'
            item1='Volumes'
            item2='Chapters'
            item3='Score'
            lastElement={lastElement}
            hasMore={hasMore}
            emptyMessage="Couldn't find any top manga."
        />
    );
}

export default TopMangaList;