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

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function MangaInfo({ guest }) {
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

        try {
            const body = { 
                progress: selectedOption,
                id: user.id,
                id_content: id_manga,
                type: 'manga'
            };

            const response = await fetch(`${APIUrl}/favorites/progress`,
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
                toast.info(`Manga set as ${selectedOption} sucessfully!`, { position: 'bottom-right' });
                setUpdate(!update);
            } else {
                toast.error(await response.text(), { position: 'bottom-right' });
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

            const response = await fetch(`${APIUrl}/favorites/manga`,
                {
                    method: 'POST',
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
                toast.info(`${manga.title} added to your list!`, { position: 'bottom-right' });
                updateNow && setUpdate(!update);
            } else {
                toast.error(await response.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleRemoveFavorite = async() => {
        try {
            const response = await fetch(`${APIUrl}/favorites/${user.id}/${id_manga}/manga`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': localStorage.getItem('jwtToken')
                    }
                }
            );

            if(response.status === 401) {
                localStorage.clear();
                window.location.reload();
            }
    
            if (response.status === 200) {
                toast.info(`${manga.title} removed from your list!`, { position: 'bottom-right' });
                setUpdate(!update);
            } else {
                toast.error(await response.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const checkIfFavorite = async() => {
        if(guest) return;

        const res = await fetch(`${APIUrl}/favorites/${user.id}/${id_manga}/manga`);
        const parseRes = await res.json();
        setIsFavorite(parseRes);

        const resMangaFavorites = await fetch(`${APIUrl}/favorites/${user.id}/manga`);
        const MangaFavoritesArray = await resMangaFavorites.json();
        const filteredMangaFavoritesArray = [...MangaFavoritesArray].filter(manga => manga.id_manga === parseInt(id_manga));
        setProgress(filteredMangaFavoritesArray.length > 0 ? filteredMangaFavoritesArray[0].progress : 'Add to list');
    }

    const getManga = async() => {
        const res = await fetch(`https://api.jikan.moe/v3/manga/${id_manga}`);
        if(!res.ok) return history.push('/404');
        const MangaArray = await res.json();
        setManga(MangaArray);

        document.title = `${MangaArray.title} • AniDash`;
    }

    useEffect(() => {
        checkIfFavorite();

        // eslint-disable-next-line
    }, [update])

    useEffect(() => {
        window.scrollTo(0, 0);
        checkIfFavorite();
        getManga();
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

export default MangaInfo;