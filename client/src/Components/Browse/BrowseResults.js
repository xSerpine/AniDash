import React, { useState, useEffect, useRef, useCallback } from 'react';
import { API } from '../../Hooks/API';
import GenericContentList from '../GenericComponents/GenericContentList';
import { Spinner } from '../Styled Components/loader';

const BrowseResults = ({ type, title, SFW, guest }) => {
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResults, setSearchresults] = useState([]);

    const observer = useRef();

    const lastElement = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setCurrentPage(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node)
    }, [loading, hasMore])

    const getSearchResults = async() => {
        if(title) {
            const { data } = await API('GET', `https://api.jikan.moe/v3/search/${type}?q=${title}&page=${currentPage}`);
            data.results.length === 0 ? setHasMore(false) : setHasMore(true);
            
            const ResultsArray = type === 'anime' ? 
                data.results.filter(result => result.type !== 'Music') 
                : 
                data.results;
            const SearchResults = SFW ? 
                type === 'anime' ? 
                    ResultsArray.filter(result => result.rated !== 'Rx') 
                    : 
                    ResultsArray.filter(result => result.members > 1000)
                :
                ResultsArray;

            setSearchresults(currentPage > 1 ? searchResults.concat(SearchResults) : SearchResults);
            setLoading(false);
        }
    }

    useEffect(() => {
        const loadingTime = setTimeout(() => {
            getSearchResults();
        }, 1000);
        
        return () => clearTimeout(loadingTime);
        
        // eslint-disable-next-line
    }, [title, currentPage])

    if(title && loading) return (
        <div style={{width: '100%'}}><Spinner /></div>
    ) 

    return (
        <GenericContentList 
            guest={guest}
            listType={type}
            array={searchResults}
            propertiesOption='jikanAPI'
            item1={type === 'anime' ? 'Type' : 'Volumes'}
            item2={type === 'anime' ? 'Episodes' : 'Chapters'}
            item3='Score'
            lastElement={lastElement}
            hasMore={hasMore}
            emptyMessage={`Look up any ${type} you want!`}
        />
    );
}

export default BrowseResults;