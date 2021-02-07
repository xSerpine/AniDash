import React, { useState, useEffect, Fragment, useRef, useContext } from 'react';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GenericHorizontalList from '../GenericComponents/GenericHorizontalList';
import UserContext from '../../Context/UserContext';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const date = new Date();
const dia = date.getDay();
const semana = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const amanha = dia === 6 ? 0 : dia + 1;
const depoisDeAmanha = amanha === 6 ? 0 : amanha + 1;
const JPNTimezone = parseInt(moment().tz('Asia/Tokyo').format('Z'));

const AiringAnime = ({ guest }) => {
    const user = useContext(UserContext);

    const [update, setUpdate] = useState(false);
    const [resultsFavorites, setResultsFavorites] = useState([]);
	const [resultsAiring, setResultsAiring] = useState({
		today: [],
		tomorrow: []
    });
	const [hoverAiringToday, setHoverAiringToday] = useState({
		element: null,
		state: false,
    });
    const [hoverAiringTomorrow, setHoverAiringTomorrow] = useState({
		element: null,
		state: false,
    });
    
    const carouselAiringTodayRef = useRef();
    const carouselAiringTomorrowRef = useRef();

	const handleHoverAiringToday = (item, isHovering) => {
        setHoverAiringToday({ element: item, state: isHovering });
    };

    const handleHoverAiringTomorrow = (item, isHovering) => {
        setHoverAiringTomorrow({ element: item, state: isHovering });
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

        try {
            const body = { 
                count: currentCount + 1,
                completed: isCompleted,
                id: user.id,
                id_content: id,
                type: 'anime'
            };

            const response = await fetch(`${APIUrl}/favorites/counter`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': localStorage.getItem('jwtToken')
                    },
                    body: JSON.stringify(body)
                }
            );

            if(response.status === 401) {
                localStorage.clear();
                window.location.reload();
            }

            if (response.status === 200) {
                setUpdate(!update);
            } else {
                toast.error(await response.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }
    
    const getFavoriteAnime = async() => {
        if(guest) return;

        const res = await fetch(`${APIUrl}/favorites/${user.id}/anime`);
        const FavoritesArray = await res.json();

        setResultsFavorites(FavoritesArray);
    }

	const getAiringAnime = async() => {
		const res = await fetch('https://api.jikan.moe/v3/schedule');
        const AiringArray = await res.json();

        const AiringTodayFiltered = [...AiringArray[semana[dia]]].filter(anime => parseInt(anime.airing_start.slice(11, 13)) + JPNTimezone < 24);
		const AiringToday = AiringTodayFiltered.concat(
            [...AiringArray[semana[amanha]]].filter(anime => parseInt(anime.airing_start.slice(11, 13)) + JPNTimezone >= 24)
		);
		const sortedAiringToday = AiringToday.sort((a, b) => b.members - a.members);

        const AiringTomorrowFiltered = AiringArray[semana[amanha]].filter(anime => parseInt(anime.airing_start.slice(11, 13)) + JPNTimezone < 24);
		const AiringTomorrow = AiringTomorrowFiltered.concat(
            [...AiringArray[semana[depoisDeAmanha]]].filter(anime => parseInt(anime.airing_start.slice(11, 13)) + JPNTimezone >= 24)
		);
		const sortedAiringTomorrow = AiringTomorrow.sort((a, b) => b.members - a.members);

		setResultsAiring({ today: sortedAiringToday, tomorrow: sortedAiringTomorrow })
	}

	useEffect(() => {
        getFavoriteAnime();
		getAiringAnime();

		// eslint-disable-next-line
	}, [update]);

	return (
		<Fragment>
            <GenericHorizontalList 
                guest={guest}
                listType='anime'
                title='Airing Today'
                overlay={true}
                array={resultsAiring.today}
                arrayfavoritos={resultsFavorites}
                propertiesOption='jikanAPI'
                carouselRef={carouselAiringTodayRef}
                item1='Type'
                item2='Episodes'
                item3='Score'
                airingType='today'
                hover={hoverAiringToday}
                handleHover={handleHoverAiringToday}
                handleArrowScroll={handleArrowScroll}
                handleAddCount={handleAddCount}
                emptyMessage="Couldn't find any anime airing today."
            />
            <GenericHorizontalList 
                guest={guest}
                listType='anime'
                title='Airing Tomorrow'
                overlay={true}
                array={resultsAiring.tomorrow}
                arrayfavoritos={resultsFavorites}
                propertiesOption='jikanAPI'
                carouselRef={carouselAiringTomorrowRef}
                item1='Type'
                item2='Episodes'
                item3='Score'
                airingType='tomorrow'
                hover={hoverAiringTomorrow}
                handleHover={handleHoverAiringTomorrow}
                handleArrowScroll={handleArrowScroll}
                handleAddCount={handleAddCount}
                emptyMessage="Couldn't find any anime airing tomorrow."
            />
		</Fragment>
	);
}

export default AiringAnime;
