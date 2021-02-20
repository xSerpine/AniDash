import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContentInfoBar, ContentWrapper } from '../Styled Components/content';
import { SpacingElement } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';
import GenericContentInformation from '../GenericComponents/GenericContentInformation';
import UserContext from '../../Context/UserContext';
import GenericContentOverview from '../GenericComponents/GenericContentOverview';
import MangaRecommendations from './MangaRecommendations';
import MangaCharacters from './MangaCharacters';
import MangaStats from './MangaStats';
import MangaTracking from './MangaTracking';
import { API } from '../../Hooks/API';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const Manga = ({ guest }) => {
    const user = useContext(UserContext);
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [manga, setManga] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false); 
    const [progress, setProgress] = useState(null);
    const [choice, setChoice] = useState('Overview');
 
    const { id_manga } = useParams();

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

        const body = { 
            progress: selectedOption,
            id: user.id,
            id_content: id_manga,
            type: 'manga'
        };

        const { status, statusMessage } = await API('PUT', `${APIUrl}/favorites/progress`, null, body);

        if(status === 401) {
            localStorage.clear();
            window.location.reload();
        }

        if(status === 200) {
            toast.info(`Manga set as ${selectedOption} sucessfully!`, { position: 'bottom-right' });
            setUpdate(!update);
        } else {
            toast.error(statusMessage, { position: 'bottom-right' });
        }
    }

    const handleAddFavorite = async(updateNow) => {
        if(isFavorite) return;
        
        const body = { 
            id: user.id, 
            id_manga: manga.mal_id, 
            type_manga: manga.type ? manga.type : 'N/A', 
            name: manga.title, 
            image: manga.image_url, 
            chapters: manga.chapters ? manga.chapters : 'N/A', 
            volumes: manga.volumes ? manga.volumes : 'N/A', 
            status: manga.status ? manga.status : 'N/A', 
            score: manga.score ? manga.score : 'N/A', 
            url: manga.url, 
            synopsis: manga.synopsis ? manga.synopsis : 'N/A'
        };

        const { status, statusMessage } = await API('POST', `${APIUrl}/favorites/manga`, null, body);

        if(status === 401) {
            localStorage.clear();
            window.location.reload();
        }

        if(status === 200) {
            toast.info(`${manga.title} added to your list!`, { position: 'bottom-right' });
            updateNow && setUpdate(!update);
        } else {
            toast.error(statusMessage, { position: 'bottom-right' });
        }
    }

    const handleRemoveFavorite = async() => {
        const { status, statusMessage } = await API('DELETE', `${APIUrl}/favorites/${user.id}/${id_manga}/manga`);

        if(status === 401) {
            localStorage.clear();
            window.location.reload();
        }

        if(status === 200) {
            toast.info(`${manga.title} removed from your list!`, { position: 'bottom-right' });
            setUpdate(!update);
        } else {
            toast.error(statusMessage, { position: 'bottom-right' });
        }
    }

    const checkIfFavorite = async() => {
        if(guest) return;
        const { data } = await API('GET', `${APIUrl}/favorites/${user.id}/${id_manga}/manga`, true);
        setIsFavorite(data);
    }

    const getMangaFavorite = async() => {
        if(guest) return;
        const { data } = await API('GET', `${APIUrl}/favorites/favorite/${user.id}/${id_manga}/manga`, true);
        setProgress(data ? data.progress : 'Add to list');
    }

    const getManga = async() => {
        const { status, data } = await API('GET', `https://api.jikan.moe/v3/manga/${id_manga}`);
        if(status === 404) return history.push('/404');
        setManga(data);

        document.title = `${data.title} • AniDash`;
    }

    useEffect(() => {
        checkIfFavorite();
        getMangaFavorite();

        // eslint-disable-next-line
    }, [update])

    useEffect(() => {
        window.scrollTo(0, 0);
        getManga();
        checkIfFavorite();
        getMangaFavorite();
        const loadingTime = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => {
            handleAnchor();
            clearTimeout(loadingTime);
        }

        // eslint-disable-next-line
    }, [id_manga])

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
                type='manga'
                title={manga.title}
                option={progress}
                progress1='Completed'
                progress2='Reading'
                progress3='Planning'
                progress4='Dropped'
                array={manga}
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
                <GenericContentOverview array={manga} />
            }
            {choice === 'Tracking' &&
                <MangaTracking id_manga={id_manga} user={user} total={manga.chapters} />
            }
            {choice === 'Stats' &&
                <MangaStats id_manga={id_manga} />
            }
            {choice === 'Characters' &&
                <MangaCharacters id_manga={id_manga} />
            }
            {choice === 'Recommendations' &&
                <MangaRecommendations id_manga={id_manga} />
            }
        </ContentWrapper>
    );
}

export default Manga;