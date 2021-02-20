import React, { useState, useEffect, Fragment, useRef, useContext } from 'react';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GenericHorizontalList from '../GenericComponents/GenericHorizontalList';
import UserContext from '../../Context/UserContext';
import { API } from '../../Hooks/API';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const date = new Date();
const day = date.getDay();
const week = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const tomorrow = day === 6 ? 0 : day + 1;
const afterTomorrow = tomorrow === 6 ? 0 : tomorrow + 1;
const JPNTimezone = parseInt(moment().tz('Asia/Tokyo').format('Z'));

const AiringResults = ({ type, array, guest }) => {
    const user = useContext(UserContext);

    const [update, setUpdate] = useState(false);
    const [favorites, setFavorites] = useState([]);
	const [airing, setAiring] = useState([]);
	const [hover, setHover] = useState({
		element: null,
		state: false,
    });
    
    const carouselRef = useRef();

	const handleHover = (item, isHovering) => {
        setHover({ element: item, state: isHovering });
    };

    const handleArrowScroll = (ref, scrollOffset) => {
        ref.current.scroll({
            top: 0,
            left: ref.current.scrollLeft + scrollOffset, 
            behavior: 'smooth'
        });
    }

    const handleAddCount = async(totalCount, currentCount, id) => {
        let isCompleted = false;

        if(!isNaN(totalCount)) {
            if(currentCount + 1 > parseInt(totalCount)) return toast.error(`Can't add more episodes.`, { position: 'bottom-right' })
            if(totalCount + 1 === parseInt(totalCount)) isCompleted = true;
        }

        const body = { 
            count: currentCount + 1,
            completed: isCompleted,
            id: user.id,
            id_content: id,
            type: 'anime'
        };

        const { status, statusMessage } = await API('PUT', `${APIUrl}/favorites/counter`, null, body);

        if(status === 401) {
            localStorage.clear();
            window.location.reload();
        }

        if (status === 200) {
            setUpdate(!update);
        } else {
            toast.error(statusMessage, { position: 'bottom-right' });
        }
    }
    
    const getFavoriteAnime = async() => {
        if(guest) return;

        const { data } = await API('GET', `${APIUrl}/favorites/${user.id}/anime`, true);
        setFavorites(data);
    }

	const getAiringDay = async() => {
        const AiringFiltered = [...array[week[type === 'today' ? day : tomorrow]]].filter(anime => parseInt(anime.airing_start.slice(11, 13)) + JPNTimezone < 24);
		const Airing = AiringFiltered.concat(
            [...array[week[type === 'today' ? tomorrow : afterTomorrow]]].filter(anime => parseInt(anime.airing_start.slice(11, 13)) + JPNTimezone >= 24)
		);
		const sortedAiring = Airing.sort((a, b) => b.members - a.members);

		setAiring(user.SFW ? sortedAiring.filter(anime => anime.r18 === false) : sortedAiring);
	}

	useEffect(() => {
        getAiringDay();
        getFavoriteAnime();

		// eslint-disable-next-line
	}, [update]);

	return (
		<Fragment>
            <GenericHorizontalList 
                guest={guest}
                listType='anime'
                title={`Airing ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                overlay={true}
                array={airing}
                arrayfavoritos={favorites}
                propertiesOption='jikanAPI'
                carouselRef={carouselRef}
                item1='Type'
                item2='Episodes'
                item3='Score'
                airingType={type}
                hover={hover}
                handleHover={handleHover}
                handleArrowScroll={handleArrowScroll}
                handleAddCount={handleAddCount}
                emptyMessage={`Couldn't find any anime airing ${type}.`}
            />
		</Fragment>
	);
}

export default AiringResults;
