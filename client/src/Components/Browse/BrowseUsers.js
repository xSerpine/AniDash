import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link} from 'react-router-dom';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ContentWrapper, ContentInfo, NoContent } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import { InputWrapper } from '../Styled Components/form';
import { Spinner } from '../Styled Components/loader';
import { API } from '../../Hooks/API';

const APIUrl = process.env.REACT_APP_API_URL;

const BrowseUsers = () => {
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResultsUsers, setSearchResultsUsers] = useState([]);
    const [user, setUser] = useState(undefined);

    const observer = useRef();

    const lastElement = useCallback(node => {
        if(loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && hasMore) {
                setCurrentPage(prevPageNumber => prevPageNumber + 1);
            }
        })
        if(node) observer.current.observe(node)
    }, [loading, hasMore])

    const handleEnter = (e) => {
        if(e.keyCode === 13)  {
            setCurrentPage(1);
            setHasMore(true);
            setSearchResultsUsers([]);
            setUser(e.target.value);
        }
    }

    const getSearchResults = async() => {
        if(user) {
            const { data } = await API('GET', `${APIUrl}/users/search/${user.toLowerCase()}?page=${currentPage}`, true);
            data.length === 0 && setHasMore(false);
            setSearchResultsUsers(searchResultsUsers.concat(data));
            setLoading(false);
        }
    }

    useEffect(() => {
        getSearchResults();

        // eslint-disable-next-line
    }, [user, currentPage])

    return (
        <ContentWrapper>
            <InputWrapper>
                <input type='text' id='search' placeholder='Look up any user' onKeyDown={e => handleEnter(e)} autoComplete='off' />  
                <label htmlFor='search'>
                    <span>
                        <i className='fas fa-search'></i> Look up any user
                    </span>
                </label>
            </InputWrapper>
            <br/>
            {user ? 
                <Titulo primary>Users results for {user}</Titulo> 
                : 
                <Titulo primary>Users</Titulo>
            }
            <ContentInfo users>
                {searchResultsUsers.length > 0 ? 
                    searchResultsUsers.map((search, index) => (
                        <div className='item' key={index} ref={searchResultsUsers.length === index + 1 ? lastElement : undefined}>
                            <OverlayTrigger
                                key={index}
                                placement='auto'
                                overlay={
                                    <Tooltip className='TooltipInfo'>
                                        <h3><b>{search.username}</b></h3>
                                    </Tooltip>
                                }
                            >
                                <div variant='secondary'>
                                    {search.avatar ? 
                                        <Link to={`/profile/${search.username}`}><img style={{borderRadius: '50%'}} src={search.avatar} alt={`${search.username} Avatar`} /></Link>
                                        :
                                        <Link to={`/profile/${search.username}`}><img style={{borderRadius: '50%'}} src='/imagens/placeholder.png' alt={`${search.username} Avatar`} /></Link>
                                    }
                                </div>
                            </OverlayTrigger>
                        </div>
                    )) 
                    : 
                    user ?
                        <NoContent>Couldn't find any users.</NoContent>
                        :
                        <NoContent>Look up any user you want!</NoContent>
                }
                {searchResultsUsers.length > 0 && hasMore && <div style={{background: '#1c2541', height: '210px', display: 'flex', alignItems: 'center'}}><Spinner /></div>}
            </ContentInfo>
        </ContentWrapper>
    );
}

export default BrowseUsers;