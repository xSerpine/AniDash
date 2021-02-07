import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContentInfoBar, ContentWrapper } from '../Styled Components/content';
import { SpacingElement } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';
import GenericContentInformation from '../GenericComponents/GenericContentInformation';
import AnimeRecommendations from './AnimeRecommendations';
import UserContext from '../../Context/UserContext';
import GenericContentOverview from '../GenericComponents/GenericContentOverview';
import AnimeStats from './AnimeStats';
import AnimeCharacters from './AnimeCharacters';
import AnimeTracking from './AnimeTracking';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const AnimeInfo = ({ guest }) => {
    const user = useContext(UserContext);
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [anime, setAnime] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false); 
    const [progress, setProgress] = useState(null);
    const [choice, setChoice] = useState('Overview');
 
    const { id_anime } = useParams();

    const itemRef = useRef();

    const handleClick = () => {
        if(itemRef.current.classList.contains('active')) 
            itemRef.current.classList.remove('active');
        else 
            itemRef.current.classList.add('active');
    }

    const handleAnchor = () => {
        setChoice('Overview');   
        setLoading(true);
    }

    const handleChoice = (option) => {
        setChoice(option);
    }

    const handleSelectedOption = async(selectedOption) => {
        if(selectedOption) handleAddFavorite(false);

        try {
            const body = { 
                progress: selectedOption,
                id: user.id,
                id_content: id_anime,
                type: 'anime'
            };

            const res = await fetch(`${APIUrl}/favorites/progress`,
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
                toast.info(`Anime set as ${selectedOption} sucessfully!`, { position: 'bottom-right' });
                setUpdate(!update);
            } else {
                toast.error(await res.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleAddFavorite = async(updateNow) => {
        if(isFavorite) return;

        try {
            const body = { 
                id: user.id, 
                id_anime: anime.mal_id, 
                type_anime: anime.type ? anime.type : 'N/A', 
                name: anime.title, 
                image: anime.image_url ? anime.image_url.replace('.jpg', 'l.jpg') : 'N/A', 
                episodes: anime.episodes ? anime.episodes : 'N/A', 
                status: anime.status ? anime.status : 'N/A',
                airing_start: anime.airing_start ? anime.airing_start : 'N/A', 
                broadcast: anime.broadcast ? anime.broadcast : 'N/A', 
                score: anime.score ? anime.score : 'N/A', 
                url: anime.url, 
                synopsis: anime.synopsis ? anime.synopsis : 'N/A'
            };

            const res = await fetch(`${APIUrl}/favorites/anime`,
                {
                    method: 'POST',
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
                toast.info(`${anime.title} added to your list!`, { position: 'bottom-right' });
                updateNow && setUpdate(!update);
            } else {
                toast.error(await res.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleRemoveFavorite = async() => {
        try {
            const res = await fetch(`${APIUrl}/favorites/${user.id}/${id_anime}/anime`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': localStorage.getItem('jwtToken')
                    }
                }
            );

            if(res.status === 401) {
                localStorage.clear();
                window.location.reload();
            }
            
            if (res.status === 200) {
                toast.info(`${anime.title} removed from your list!`, { position: 'bottom-right' });
                setUpdate(!update);
            } else {
                toast.error(await res.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const checkIfFavorite = async() => {
        if(guest) return;

        const res = await fetch(`${APIUrl}/favorites/${user.id}/${id_anime}/anime`);
        const parseRes = await res.json();
        setIsFavorite(parseRes);

        const resAnimeFavorites = await fetch(`${APIUrl}/favorites/${user.id}/anime`);
        const AnimeFavoritesArray = await resAnimeFavorites.json();
        const filteredAnimeFavoritesArray = [...AnimeFavoritesArray].filter(anime => anime.id_anime === parseInt(id_anime));
        setProgress(filteredAnimeFavoritesArray.length > 0 ? filteredAnimeFavoritesArray[0].progress : 'Add to list');
    }

    const getAnime = async() => {
        const res = await fetch(`https://api.jikan.moe/v3/anime/${id_anime}`);
        if(res.status === 404) return history.push('/404');
        const AnimeArray = await res.json();

        setAnime(AnimeArray);

        document.title = `${AnimeArray.title} • AniDash`;
    }

    useEffect(() => {
        checkIfFavorite();

        // eslint-disable-next-line
    }, [update])

    useEffect(() => {
        window.scrollTo(0, 0);
        checkIfFavorite();
        getAnime();        
        const loadingTime = setTimeout(() => {
            setLoading(false);
        }, 1000);
   
        return () => {
            handleAnchor();
            clearTimeout(loadingTime);
        }
        // eslint-disable-next-line
    }, [id_anime])

    if(loading) return (
        <>
            <SpacingElement unwrapped />
            <Spinner />
        </>
    )

    return (
        <ContentWrapper>
            <SpacingElement unwrapped />
            <GenericContentInformation 
                guest={guest}
                type='anime'
                title={anime.title}
                option={progress}
                progress1='Completed'
                progress2='Watching'
                progress3='Planning'
                progress4='Dropped'
                array={anime}
                isFavorite={isFavorite}
                handleAddFavorite={handleAddFavorite}
                handleRemoveFavorite={handleRemoveFavorite}
                handleSelectedOption={handleSelectedOption}
                handleClick={handleClick}
                itemRef={itemRef}
            />
            <br/>
            <ContentInfoBar>
                <div className={choice === 'Overview' ? 'active' : ''} onClick={() => handleChoice('Overview')}>Overview</div>
                {!guest && isFavorite && 
                    <div className={choice === 'Tracking' ? 'active' : ''} onClick={() => handleChoice('Tracking')}>Tracking</div>
                }
                <div className={choice === 'Stats' ? 'active' : ''} onClick={() => handleChoice('Stats')}>Stats</div>
                <div className={choice === 'Characters' ? 'active' : ''} onClick={() => handleChoice('Characters')}>Characters</div>
                <div className={choice === 'Recommendations' ? 'active' : ''} onClick={() => handleChoice('Recommendations')}>Recommendations</div>
            </ContentInfoBar>
            <br/>
            {choice === 'Overview' &&
                <GenericContentOverview array={anime} />
            }
            {choice === 'Tracking' &&
                <AnimeTracking id_anime={id_anime} user={user} total={anime.episodes} />
            }
            {choice === 'Stats' &&
                <AnimeStats id_anime={id_anime} />
            }
            {choice === 'Characters' &&
                <AnimeCharacters id_anime={id_anime} />
            }
            {choice === 'Recommendations' &&
                <AnimeRecommendations id_anime={id_anime} />
            }
        </ContentWrapper>
    );
}

export default AnimeInfo;