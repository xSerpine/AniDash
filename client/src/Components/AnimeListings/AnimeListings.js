import React, { useRef, useState, useEffect, useContext } from 'react';
import { ContentWrapper, ContentInfo, Items, ItemsWrapper } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import TopAnimeList from './TopAnimeList';
import FavoriteAnimeList from './FavoriteAnimeList';
import { SpacingElement } from '../Styled Components/navbar';
import SeasonsAnimeList from './SeasonsAnimeList';
import UserContext from '../../Context/UserContext';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1;

const AnimeListings = ({ guest }) => {
    document.title = 'Anime Lists • AniDash';
    
    const user = useContext(UserContext);
    
    const [key, setKey] = useState(0);
    const [choice, setChoice] = useState(guest ? 'Top Anime' : 'All');
    
    const itemRef = useRef([]);
   
    const handleChoice = (strChoice) => {
        setChoice(strChoice);
        setKey(prevKey => prevKey + 1);
    }

    const handleClickOptions = (index) => {
        if(itemRef.current[index].classList.contains('active')) 
            itemRef.current[index].classList.remove('active');
        else 
            itemRef.current[index].classList.add('active');
    }   

    useEffect(() => {
        window.scrollTo(0, 0);

    }, [choice])

    return (
        <ContentWrapper>
            <SpacingElement unwrapped />
            <Titulo style={{textAlign: 'center'}}>{choice}</Titulo>
            <ContentInfo lists>
                <div>
                    <Titulo primary>Lists</Titulo>
                    {!guest &&
                        <ItemsWrapper ref={element => itemRef.current.push(element)}>
                            <span onClick={() => handleClickOptions(0)}>My Anime Lists</span>
                            <div style={{borderLeft: '2px solid'}}>
                                {['All', 'Planning', 'Watching', 'Completed', 'Dropped'].map((option, index) => 
                                    <Items suboption onClick={() => handleChoice(option)} key={index}>{option}</Items>
                                )}
                            </div>    
                        </ItemsWrapper>
                    }
                    <br/>
                    <ItemsWrapper ref={element => itemRef.current.push(element)}>
                        <span onClick={() => handleClickOptions(guest ? 0 : 1)}>Seasons</span>
                        <div style={{borderLeft: '2px solid'}}>
                            {[`Winter ${year}`, `Spring ${year}`, `Summer ${year}`, `Fall ${month >= 6 ? year : year - 1}`, 'TBA'].map((option, index) => 
                                <Items suboption onClick={() => handleChoice(option)} key={index}>{option}</Items>
                            )}
                        </div>
                    </ItemsWrapper>
                    <br/>
                    <ItemsWrapper onClick={() => handleChoice('Top Anime')}>
                        <span>Top Anime</span>
                    </ItemsWrapper>
                </div>        
                {!guest && ['All', 'Planning', 'Watching', 'Completed', 'Dropped'].includes(choice) && 
                    <FavoriteAnimeList 
                        key={key} 
                        list={choice.toLowerCase()} 
                    />
                }
                {[`Winter ${year}`, `Spring ${year}`, `Summer ${year}`, `Fall ${month >= 6 ? year : year - 1}`, 'TBA'].includes(choice) && 
                    <SeasonsAnimeList 
                        key={key}
                        list={choice === 'TBA' ? 'later' : choice.toLowerCase().split(' ')[0]} 
                        year={
                            choice === `Fall ${month >= 6 ? year : year - 1}` ? 
                                month >= 6 ? 
                                    year 
                                    : 
                                    year - 1 
                                :
                                year
                        } 
                        SFW={guest ? true : user.SFW}
                        guest={guest}
                    />
                }
                {choice === 'Top Anime' && 
                    <TopAnimeList 
                        key={key}
                        guest={guest}
                    />
                }
            </ContentInfo>
        </ContentWrapper>
    );
}

export default AnimeListings;