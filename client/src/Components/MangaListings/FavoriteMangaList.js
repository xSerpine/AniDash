import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from '../Styled Components/loader';
import GenericContentList from '../GenericComponents/GenericContentList';
import UserContext from '../../Context/UserContext';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const FavoriteMangaList = ({ list }) => {
    const user = useContext(UserContext);

    const [updatedItem, setUpdatedItem] = useState({
        arrayIndex: undefined,
        contentId: undefined
    });
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setcurrentPage] = useState(1);
    const [favorites, setFavorites] = useState([]);

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

    const handleUpdateItem = async() => {
        if(!favorites[updatedItem.arrayIndex]) return;

        const res = await fetch(`${APIUrl}/favoritos/favorite/${user.email}/${updatedItem.contentId}/manga`);
        const UpdatedFavorite = await res.json();

        const favoritesCopy = [...favorites];
        favoritesCopy[updatedItem.arrayIndex] = UpdatedFavorite;
        setFavorites(favoritesCopy);
    }

    const handleAddCount = async(totalCount, currentCount, id, arrayIndex) => {
        let isCompleted = false;

        if(!isNaN(totalCount)) {
            if(currentCount + 1 > parseInt(totalCount)) return toast.error(`Can't add more chapters.`, { position: 'bottom-right' })
            if(currentCount + 1 === parseInt(totalCount)) isCompleted = true;
        }

        try {
            const body = { 
                count: currentCount + 1,
                completed: isCompleted,
                email: user.email,
                id: id,
                type: 'manga'
            };

            const response = await fetch(`${APIUrl}/favoritos/counter`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );
    
            const parseRes = await response.json();

            if (parseRes === 'OK') {
                setUpdatedItem({ arrayIndex: arrayIndex, contentId: id});
            } else {
                toast.error(parseRes, { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getFavorites = async() => {
        const res = await fetch(
            list === 'all' ?
                `${APIUrl}/favoritos/${user.email}/manga?page=${currentPage}`
                :
                `${APIUrl}/favoritos/progress/${user.email}/manga/${list}?page=${currentPage}`  
        );
        const FavoritesArray = await res.json();

        FavoritesArray.length === 0 ? setHasMore(false) : setHasMore(true);

        setFavorites(favorites.concat(FavoritesArray));

        setLoading(false);
    }

    useEffect(() => {
        handleUpdateItem();

        // eslint-disable-next-line
    }, [updatedItem])

    useEffect(() => {
        getFavorites();

        // eslint-disable-next-line
    }, [list, currentPage]);

    if(loading) return <Spinner />

    return (
        <GenericContentList
            contentListType='favorites'
            listType='manga'
            array={favorites}
            propertiesOption='anidashAPI'
            item1='Volumes'
            item2='Chapters'
            item3='Score'
            lastElement={lastElement}
            hasMore={hasMore}
            handleAddCount={handleAddCount}
            emptyMessage={<span><Link to='/search'>Add</Link> your favorite manga to this list and set its status!</span>}
        />
    );
}

export default FavoriteMangaList;