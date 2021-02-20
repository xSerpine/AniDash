import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from '../Styled Components/loader';
import GenericContentList from '../GenericComponents/GenericContentList';
import UserContext from '../../Context/UserContext';
import { API } from '../../Hooks/API';

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

        const { data } = await API('GET', `${APIUrl}/favorites/favorite/${user.id}/${updatedItem.contentId}/manga`, true);
        const favoritesCopy = [...favorites];
        favoritesCopy[updatedItem.arrayIndex] = data;
        setFavorites(favoritesCopy);
    }

    const handleAddCount = async(totalCount, currentCount, id, arrayIndex) => {
        let isCompleted = false;

        if(!isNaN(totalCount)) {
            if(currentCount + 1 > parseInt(totalCount)) return toast.error(`Can't add more chapters.`, { position: 'bottom-right' })
            if(currentCount + 1 === parseInt(totalCount)) isCompleted = true;
        }

        const body = { 
            count: currentCount + 1,
            completed: isCompleted,
            id: user.id,
            id_content: id,
            type: 'manga'
        };

        const { status, statusMessage } = await API('PUT', `${APIUrl}/favorites/counter`, null, body);

        if(status === 401) {
            localStorage.clear();
            window.location.reload();
        }

        if(status === 200) {
            setUpdatedItem({ arrayIndex: arrayIndex, contentId: id});
        } else {
            toast.error(statusMessage, { position: 'bottom-right' });
        }
    }

    const getFavorites = async() => {
        const { data } = await API(
            'GET', 
            list === 'all' ?
                `${APIUrl}/favorites/${user.id}/manga?page=${currentPage}`
                :
                `${APIUrl}/favorites/progress/${user.id}/manga/${list}?page=${currentPage}`, 
            true
        );
        data.length === 0 ? setHasMore(false) : setHasMore(true);
        setFavorites(favorites.concat(data));
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