import React, { useState, useRef, useEffect } from 'react';
import { ContentWrapper, ContentInfo, Items, ItemsWrapper } from '../Styled Components/content';
import { SpacingElement } from '../Styled Components/navbar';
import { Titulo } from '../Styled Components/text';
import FavoriteMangaList from './FavoriteMangaList';
import TopMangaList from './TopMangaList';

const MangaListings = ({ guest }) => {
    document.title = 'Manga Lists • AniDash';

    const [key, setKey] = useState(0);
    const [choice, setChoice] = useState(guest ? 'Top Manga' : 'All');

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
                            <span onClick={() => handleClickOptions(0)}>My Manga Lists</span>
                            <div style={{borderLeft: '2px solid'}}>
                                {['All', 'Planning', 'Reading', 'Completed', 'Dropped'].map((option, index) => 
                                    <Items suboption onClick={() => handleChoice(option)} key={index}>{option}</Items>
                                )}
                            </div>    
                        </ItemsWrapper>
                    }
                    <br/>
                    <ItemsWrapper onClick={() => handleChoice('Top Manga')}>
                        <span>Top Manga</span>
                    </ItemsWrapper>
                </div>   
                {!guest && ['All', 'Planning', 'Reading', 'Completed', 'Dropped'].includes(choice) && 
                    <FavoriteMangaList 
                        key={key}
                        list={choice.toLowerCase()} 
                    />
                }    
                {choice === 'Top Manga' && 
                    <TopMangaList 
                        key={key} 
                        guest={guest}
                    />
                }  
            </ContentInfo>
        </ContentWrapper>
    );
}

export default MangaListings;