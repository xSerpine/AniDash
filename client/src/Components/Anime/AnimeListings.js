import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ContentInfoWrapper, ContentInfo, ListItems, Items, NoContent } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import Pagination from '../Geral/Pagination';
import { Spinner } from '../Styled Components/loader';
import usePaginate from '../Utils/usePaginate';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function Animelistings({userData}) {
    //Estados
    const [loading, setLoading] = useState(true);
    const [choice, setChoice] = useState("My Anime List");
    const [favorites, setFavorites] = useState([]);
    const [upcomingAnime, setUpcomingAnime] = useState([]);
    const [topAnime, setTopAnime] = useState([]);
   
    // eslint-disable-next-line
    let Paginate, Pag, currentPage;
    const Upcoming = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageAnimeManga, upcomingAnime);
    const Top = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageAnimeManga, topAnime);
    const Fav = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageAnimeManga, favorites);

    const handleChoice = (strChoice) => {
        setChoice(strChoice);
    }

    //Requests
    async function getfavorites() {
        const res = await fetch(`${APIUrl}/favoritos/${userData.email}/anime`);
        const FavoritesArray = await res.json();
        setFavorites(FavoritesArray);
    }

    async function getUpcomingAnime() {
        const res = await fetch("https://api.jikan.moe/v3/season/later");
        const UpcomingAnimeArray = await res.json();
        setUpcomingAnime(UpcomingAnimeArray.anime);
    }

    async function getTopAnime() {
        const res = await fetch("https://api.jikan.moe/v3/top/anime");
        const TopAnimeArray = await res.json();
        setTopAnime(TopAnimeArray.top);
    }

    useEffect(() => {
        getfavorites();
        getUpcomingAnime();
        getTopAnime();
        setLoading(false);

        // eslint-disable-next-line
    }, []);

    return (
        <ContentInfoWrapper>
            {choice === "My Anime List" ?
                <Pagination 
                    MainTitle={choice} 
                    postsPerPage={userData.postsPerPageAnimeManga} 
                    totalPosts={favorites.length} 
                    paginate={Fav.Paginate} 
                    currentPage={Fav.currentPage}
                /> 
                :
                choice === "Upcoming Seasons" ?
                    <Pagination 
                        MainTitle={choice} 
                        postsPerPage={userData.postsPerPageAnimeManga} 
                        totalPosts={upcomingAnime.length} 
                        paginate={Upcoming.Paginate} 
                        currentPage={Upcoming.currentPage}
                    /> 
                    :
                    <Pagination 
                        MainTitle={choice} 
                        postsPerPage={userData.postsPerPageAnimeManga} 
                        totalPosts={topAnime.length} 
                        paginate={Top.Paginate} 
                        currentPage={Top.currentPage}
                    /> 
            }
            <ContentInfo listContent last>
                <div>
                    <Titulo primary>Options</Titulo>
                    {["My Anime List", "Upcoming Seasons", "Top Anime"].map((options, index) => (
                        <Items onClick={() => handleChoice(options)} key={index}>{options}</Items>
                    ))}
                </div>        
                {loading || upcomingAnime.length === 0 || topAnime.length === 0 ? 
                    <Spinner /> 
                    :   
                    <ListItems animelist>
                        {favorites.length === 0 && choice === "My Anime List" && <NoContent><Link to="/search">Add</Link> your favorite anime to this list!</NoContent>}
                        
                        {choice === "My Anime List" && 
                            Fav.Pag.map((favorites, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{favorites.nome}</b></h3>
                                                <hr style={{color: "white"}}/>
                                                <div className="details">
                                                    <p><b>Type: </b>{favorites.type_anime ? favorites.type_anime : "N/A"} </p>
                                                    <p><b>Episodes: </b>{favorites.episodes ? favorites.episodes : "N/A"}</p>
                                                    <p><b>Score: </b>{favorites.score ? favorites.score : "N/A"}</p>
                                                </div>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            <Link to={`/anime/${favorites.id_anime}`}><img src={favorites.image} alt="Anime Cover" /></Link>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            ))
                        }

                        {choice === "Upcoming Seasons" && 
                            Upcoming.Pag.map((airing, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{airing.title}</b></h3>
                                                <hr style={{color: "white"}}/>
                                                <div className="details">
                                                    <p><b>Type: </b>{airing.type ? airing.type : "N/A"} </p>
                                                    <p><b>Episodes: </b>{airing.episodes ? airing.episodes : "N/A"}</p>
                                                    <p><b>Score: </b>{airing.score ? airing.score : "N/A"}</p>
                                                </div>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            <Link to={`/anime/${airing.mal_id}`}><img src={airing.image_url.replace(".jpg", "l.jpg")} alt="Anime Cover" /></Link>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            ))
                        }

                        {choice === "Top Anime" && 
                            Top.Pag.map((airing, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{airing.title}</b></h3>
                                                <hr style={{color: "white"}}/>
                                                <div className="details">
                                                    <p><b>Type: </b>{airing.type ? airing.type : "N/A"} </p>
                                                    <p><b>Episodes: </b>{airing.episodes ? airing.episodes : "N/A"}</p>
                                                    <p><b>Score: </b>{airing.score ? airing.score : "N/A"}</p>
                                                </div>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            <Link to={`/anime/${airing.mal_id}`}><img src={airing.image_url.replace(".jpg", "l.jpg")} alt="Anime Cover" /></Link>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            ))
                        }    
                    </ListItems>
                }
            </ContentInfo>
        </ContentInfoWrapper>
    );
}

export default Animelistings;