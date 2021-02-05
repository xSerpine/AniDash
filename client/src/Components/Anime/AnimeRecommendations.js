import React, { useState, useEffect, useRef } from 'react';
import GenericHorizontalList from '../GenericComponents/GenericHorizontalList';
import { Spinner } from '../Styled Components/loader';
import { SpacingElement } from '../Styled Components/navbar';

const AnimeRecommendations = ({ id_anime }) => {
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);

    const carouselRef = useRef(); 

    const handleArrowScroll = (ref, scrollOffset) => {
        ref.current.scroll({
            top: 0,
            left: ref.current.scrollLeft + scrollOffset, 
            behavior: 'smooth'
        });
    }

    const getRecommendations = async() => {
        const res = await fetch(`https://api.jikan.moe/v3/anime/${id_anime}/recommendations`);
        const RecommendationsArray = await res.json();
        
        const SlicedRecommendationsArray = RecommendationsArray.recommendations.slice(0, RecommendationsArray.recommendations.length > 50 ? 50 : RecommendationsArray.recommendations.length);

        setRecommendations(SlicedRecommendationsArray);

        setLoading(false);
    }

    useEffect(() => {
        const loadingTime = setTimeout(() => {
            getRecommendations();
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
        <GenericHorizontalList
            listType='anime'
            listStyles={{width: '100%'}}
            titleStyles={{textAlign: 'center'}}
            array={recommendations}
            propertiesOption='jikanAPI'
            carouselRef={carouselRef}
            item1='Type'
            item2='Episodes'
            item3='Score'
            handleArrowScroll={handleArrowScroll}
            emptyMessage={`No recommendations found.`}
        />
    );
}

export default AnimeRecommendations;