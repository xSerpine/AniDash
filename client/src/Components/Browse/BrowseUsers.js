import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ContentInfoWrapper, ContentInfo } from '../Styled Components/content';
import { Titulo, SubTitulo } from '../Styled Components/text';
import { InputWrapper } from '../Styled Components/form';
import { Spinner } from '../Styled Components/loader';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function BrowseUsers() {
    const [hasMore, setHasMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResultsUsers, setSearchResultsUsers] = useState([]);
    const [user, setUser] = useState("");

    const handleEnter = (e) => {
        if(e.keyCode === 13)  {
            setCurrentPage(1);
            setHasMore(true);
            setSearchResultsUsers([]);
            setUser(e.target.value);
        }
    }

    async function getSearchResults() {
        if(user) {
            const res = await fetch(`${APIUrl}/users/search/${user.toLowerCase()}?page=${currentPage}`);
            const SearchResultsUsersArray = await res.json();

            SearchResultsUsersArray.length === 0 && setHasMore(false);

            setCurrentPage(currentPage + 1);

            currentPage > 1 ? 
            setSearchResultsUsers(searchResultsUsers.concat(SearchResultsUsersArray))
            :
            setSearchResultsUsers(SearchResultsUsersArray)
        }
    }

    useEffect(() => {
        getSearchResults();

        // eslint-disable-next-line
    }, [user])

    return (
        <ContentInfoWrapper>
            <InputWrapper>
                <input type="text" id="search" placeholder="Look up any user!" onKeyDown={e => handleEnter(e)} autoComplete="off" />  
                <label htmlFor="search">Look up any user!</label>
            </InputWrapper>
            <br/>
            {user ? 
                <Titulo primary>Users results for {user}</Titulo> 
                : 
                <Titulo primary>Users</Titulo>
            }
            <InfiniteScroll 
                dataLength={searchResultsUsers.length}
                next={getSearchResults}
                hasMore={hasMore}
                loader={user && <Spinner className="infiniteScrollItems" />}
                endMessage={
                    (user && searchResultsUsers.length === 0) ? 
                        <SubTitulo className="infiniteScrollItems" style={{textAlign: "center", marginBottom: "2rem"}}>No results for {user} were found.</SubTitulo>
                        :
                        user && <SubTitulo className="infiniteScrollItems" style={{textAlign: "center", marginBottom: "2rem"}}>No more results for {user} were found.</SubTitulo>
                }   
                className="infiniteScroll"
            >
                <ContentInfo bottom users>
                    {searchResultsUsers.length > 0 ? 
                        searchResultsUsers.map((search, index) => (
                            <div className="item" key={index}>
                                <OverlayTrigger
                                    key={index}
                                    placement="auto"
                                    overlay={
                                        <Tooltip className="AnimeDetails">
                                            <h3><b>{search.username}</b></h3>
                                        </Tooltip>
                                    }
                                >
                                    <div variant="secondary">
                                        {   search.avatar ? 
                                            <Link to={`/profile/${search.username}`}><img style={{borderRadius: "50%"}} src={search.avatar} alt="User Avatar" /></Link>
                                            :
                                            <Link to={`/profile/${search.username}`}><img style={{borderRadius: "50%"}} src="/imagens/placeholder.png" alt="User Avatar" /></Link>
                                        }
                                    </div>
                                </OverlayTrigger>
                            </div>
                        )) 
                        : 
                        !user && <div style={{width: "77vw", textAlign: "center"}}>Try looking up any user you want!</div>
                    }
                </ContentInfo>
            </InfiniteScroll>
        </ContentInfoWrapper>
    );
}

export default BrowseUsers;