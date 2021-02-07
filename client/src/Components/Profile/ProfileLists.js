import React, { useCallback, useEffect, useRef, useState } from 'react';
import GenericContentList from '../GenericComponents/GenericContentList';

const APIUrl = process.env.REACT_APP_API_URL;

function ProfileLists({ user, type, typeStyles, profile, item1, item2, item3, emptyMessage }) {
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setcurrentPage] = useState(1);
    const [content, setContent] = useState([]);

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

    const getContent = async() => {
        const res = await fetch(
            type === 'profile' ?
                `${APIUrl}/follows/${user.username}?page=${currentPage}`
                :
                `${APIUrl}/favorites/${user.id}/${type}?page=${currentPage}`
            );
        const ContentArray = await res.json();
        
        const ListContent = profile ? ContentArray[profile] : ContentArray;

        ListContent.length === 0 ? setHasMore(false) : setHasMore(true);

        setContent(content.concat(ListContent));

        setLoading(false);
    }

    useEffect(() => {
        getContent();
        
        // eslint-disable-next-line
    }, [currentPage]);

    return (
        <GenericContentList
            listStyles={{width: '80%'}}
            listType={type}
            typeStyles={typeStyles}
            array={content}
            propertiesOption='anidashAPI'
            item1={item1}
            item2={item2}
            item3={item3}
            lastElement={lastElement}
            emptyMessage={emptyMessage}
            hasMore={hasMore}
        />
    );
}

export default ProfileLists;