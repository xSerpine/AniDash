import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ContentInfoWrapper, ContentInfo, SearchItems, TituloWrapper } from '../Styled Components/content';
import { Titulo, SubTitulo } from '../Styled Components/text';
import { InputWrapper } from '../Styled Components/form';
import { Space } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';

toast.configure();

function BrowseAnimeManga() {
    const [hasMore, setHasMore] = useState({
        anime: false,
        manga: false
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchResults, setSearchresults] = useState({
        anime: [],
        manga: []
    });
    const [title, setTitle] = useState("");

    const handleEnter = (e) => {
        if(e.keyCode === 13)  {
            setCurrentPage(1);
            setHasMore({ anime: true, manga: true });
            setSearchresults({ anime: [], manga: [] });
            setTitle(e.target.value);
        }
    }

    async function getSearchResults() {
        if(searchResults.manga.length >= 150 || searchResults.anime.length >= 150) {
            return setHasMore({ manga: false, anime: false});
        }

        if(title) {
            const res_anime = await fetch(`https://api.jikan.moe/v3/search/anime?q=${title}&page=${currentPage}`);
            const SearchResultsAnimeArray = await res_anime.json();
            SearchResultsAnimeArray.length === 0 && setHasMore({ anime: false, manga: hasMore.manga});

            const res_manga = await fetch(`https://api.jikan.moe/v3/search/manga?q=${title}&page=${currentPage}`);
            const SearchResultsMangaArray = await res_manga.json();
            SearchResultsMangaArray.length === 0 && setHasMore({ manga: false, anime: hasMore.anime});

            setCurrentPage(currentPage + 1);

            currentPage > 1 ? 
            setSearchresults({ anime: searchResults.anime.concat(SearchResultsAnimeArray.results), manga: searchResults.manga.concat(SearchResultsMangaArray.results) })
            :
            setSearchresults({ anime: SearchResultsAnimeArray.results, manga: SearchResultsMangaArray.results })
        
        }
    }

    useEffect(() => {
        getSearchResults();
        
        // eslint-disable-next-line
    }, [title])

    return (
        <ContentInfoWrapper>
            <InputWrapper>
                <input type="text" id="search" placeholder="Look up any anime or manga" onKeyDown={e => handleEnter(e)} autoComplete="off" />  
                <label htmlFor="search">Look up any anime or manga</label>
            </InputWrapper>
            <br/>
            <TituloWrapper>
                {title ? 
                    <Titulo primary>Anime results for {title}</Titulo> 
                    : 
                    <Titulo primary>Anime</Titulo>
                }
                <Space />
                {title ? 
                    <Titulo primary>Manga results for {title}</Titulo> 
                    : 
                    <Titulo primary>Manga</Titulo>
                }
                <Space />
            </TituloWrapper>
            <InfiniteScroll 
                dataLength={searchResults.anime.length /*podia meter searchResults.anime.length. vai dar ao mesmo resultado*/}
                next={getSearchResults}
                hasMore={hasMore.anime}
                loader={title && <Spinner className="infiniteScrollItems" />}
                endMessage={
                    title && <SubTitulo className="infiniteScrollItems" style={{textAlign: "center", marginBottom: "2rem"}}>No more results for {title} were found.</SubTitulo>
                }   
                className="infiniteScroll"
            >
                <ContentInfo search>
                    <SearchItems>
                        {searchResults.anime.length > 0 ?
                            searchResults.anime.map((searched, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{searched.title}</b></h3>
                                                <hr style={{color: "white"}}/>
                                                <div className="details">
                                                    <p><b>Type: </b>{searched.type ? searched.type : "N/A"} </p>
                                                    <p><b>Episodes: </b>{searched.episodes ? searched.episodes : "N/A"}</p>
                                                    <p><b>Score: </b>{searched.score ? searched.score : "N/A"}</p>
                                                </div>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            <Link to={`/anime/${searched.mal_id}`}><img src={searched.image_url.replace(".jpg", "l.jpg")} alt="Anime Cover" /></Link>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            )) 
                            :
                            !title && <div style={{width: "37vw", textAlign: "center"}}>Try looking up any anime you want!</div> 
                        }
                    </SearchItems>
                    <SearchItems>
                        {searchResults.manga.length > 0 ? 
                            searchResults.manga.map((searched, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{searched.title}</b></h3>
                                                <hr style={{color: "white"}}/>
                                                <div className="details">
                                                    <p><b>Volumes: </b>{searched.volumes ? searched.volumes : "N/A"} </p>
                                                    <p><b>Chapters: </b>{searched.chapters ? searched.chapters : "N/A"}</p>
                                                    <p><b>Score: </b>{searched.score ? searched.score : "N/A"}</p>
                                                </div>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            <Link to={`/manga/${searched.mal_id}`}><img src={searched.image_url.replace(".jpg", "l.jpg")} alt="Manga Cover" /></Link>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            )) 
                            : 
                            !title && <div style={{width: "37vw", textAlign: "center"}}>Try looking up any manga you want!</div> 
                        }
                    </SearchItems>
                </ContentInfo>
            </InfiniteScroll>
        </ContentInfoWrapper>
    );
}

export default BrowseAnimeManga;