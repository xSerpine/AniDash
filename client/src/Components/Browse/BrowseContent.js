import React, { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContentInfo, TituloWrapper, ContentWrapper } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import { InputWrapper } from '../Styled Components/form';
import UserContext from '../../Context/UserContext';
import BrowseResults from './BrowseResults';

toast.configure();

const BrowseContent = ({ guest }) => {
    const user = useContext(UserContext);

    const [title, setTitle] = useState('');

    const handleEnter = (e) => {
        if(e.keyCode === 13)  {
            if(e.target.value.length < 3) return toast.error('Anime/Manga query needs at least 3 characters', { position: 'bottom-right' });
            setTitle(e.target.value);
        }
    }

    return (
        <ContentWrapper>
            <InputWrapper>
                <input type='text' id='search' placeholder='Look up any anime or manga' onKeyDown={e => handleEnter(e)} autoComplete='off' />  
                <label htmlFor='search'>
                    <span>
                        <i className='fas fa-search'></i> Look up any anime or manga
                    </span>
                </label>
            </InputWrapper>
            <br/>
            <TituloWrapper>
                {title ? 
                    <Titulo primary style={{width: 'inherit'}}>Anime results for {title}</Titulo> 
                    : 
                    <Titulo primary style={{width: 'inherit'}}>Anime</Titulo>
                }
                {title ? 
                    <Titulo primary style={{width: 'inherit'}}>Manga results for {title}</Titulo> 
                    : 
                    <Titulo primary style={{width: 'inherit'}}>Manga</Titulo>
                }
            </TituloWrapper>
            <ContentInfo search>
                <BrowseResults 
                    type='anime'
                    title={title}
                    SFW={guest ? true : user.SFW}
                    guest={guest}
                />
                <BrowseResults 
                    type='manga'
                    title={title}
                    SFW={guest ? true : user.SFW}
                    guest={guest}
                />
            </ContentInfo>
        </ContentWrapper>
    );
}

export default BrowseContent;