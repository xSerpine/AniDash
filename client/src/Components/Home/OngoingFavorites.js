import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserContext from '../../Context/UserContext'
import GenericHorizontalList from '../GenericComponents/GenericHorizontalList';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const OngoingFavorites = ({ type }) => {
    const user = useContext(UserContext);

    const [updatedItem, setUpdatedItem] = useState({
        arrayIndex: undefined,
        contentId: undefined
    });
	const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setcurrentPage] = useState(1);
	const [resultsFavorites, setResultsFavorites] = useState([]);
	const [hover, setHover] = useState({
		element: null,
		state: false,
	});

    const favoritesRef = useRef();
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

	const handleHover = (item, isHovering) => {
		setHover({ element: item, state: isHovering });
    };

    const handleUpdateItem = async() => {
        if(!resultsFavorites[updatedItem.arrayIndex]) return;

        const res = await fetch(`${APIUrl}/favorites/favorite/${user.id}/${updatedItem.contentId}/${type}`);
        const UpdatedFavorite = await res.json();

        const favoritesCopy = [...resultsFavorites];
        favoritesCopy[updatedItem.arrayIndex] = UpdatedFavorite;
        setResultsFavorites(favoritesCopy);
    }

    const handleAddCount = async(totalCount, currentCount, id, arrayIndex) => {
        let isCompleted = false;

        if(!isNaN(totalCount)) {
            if(currentCount + 1 > parseInt(totalCount)) return toast.error(`Can't add more episodes.`, { position: 'bottom-right' })
            if(currentCount + 1 === parseInt(totalCount)) isCompleted = true;
        }

        try {
            const body = { 
                count: currentCount + 1,
                completed: isCompleted,
                id: user.id,
                id_content: id,
                type: type
            };

            const res = await fetch(`${APIUrl}/favorites/counter`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': localStorage.getItem('jwtToken')
                    },
                    body: JSON.stringify(body)
                }
            );

            if(res.status === 401) {
                localStorage.clear();
                window.location.reload();
            }

            if (res.status === 200) {
                setUpdatedItem({ arrayIndex: arrayIndex, contentId: id});
            } else {
                toast.error(await res.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleArrowScroll = (ref, scrollOffset) => {
        ref.current.scroll({
            top: 0,
            left: ref.current.scrollLeft + scrollOffset, 
            behavior: 'smooth'
        });
    }

	const getOngoingFavorites = async() => {
		const res = await fetch(`${APIUrl}/favorites/ongoing/${user.id}/${type}?page=${currentPage}`);
		const OngoingFavoriteArray = await res.json();

        OngoingFavoriteArray.length === 0 ? setHasMore(false) : setHasMore(true);

        setResultsFavorites(resultsFavorites.concat(OngoingFavoriteArray));

        setLoading(false);
    }

    useEffect(() => {
        handleUpdateItem();    
    
        // eslint-disable-next-line
    }, [updatedItem])

	useEffect(() => {
        getOngoingFavorites();
    
		// eslint-disable-next-line
	}, [currentPage]);

	return (
		<GenericHorizontalList
            listType={type}
            title={<span>Favorite Ongoing <span>{type}</span></span>}
            overlay={true}
            array={resultsFavorites}
            arrayfavoritos={resultsFavorites}
            propertiesOption='anidashAPI'
            carouselRef={favoritesRef}
            item1={type === 'anime' ? 'Type' : 'Volumes'}
            item2={type === 'anime' ? 'Episodes' : 'Chapters'}
            item3='Score'
            airingType='favoritos'
            hover={hover}
            handleHover={handleHover}
            handleArrowScroll={handleArrowScroll}
            handleAddCount={handleAddCount}
            lastElement={lastElement}
            emptyMessage={<span>No Ongoing <span>{type}</span> was found! You can add more <span>{type}</span> <Link to='/search'>here!</Link></span>}
            hasMore={hasMore}
        />
	);
}

export default OngoingFavorites;
