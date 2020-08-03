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

function Mangalistings({userData}) {
    //Estados
    const [loading, setLoading] = useState(true);
    const [choice, setChoice] = useState("My Manga List");
    const [favorites, setFavorites] = useState([]);
    const [topManga, setTopManga] = useState([]);

    // eslint-disable-next-line
    let Paginate, Pag, currentPage;
    const Top = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageAnimeManga, topManga);
    const Fav = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageAnimeManga, favorites);

    const handleChoice = (strChoice) => {
        setChoice(strChoice);
    }

    //Requests
    async function getfavorites() {
        const res = await fetch(`${APIUrl}/favoritos/${userData.email}/manga`);
        const FavoritesArray = await res.json();
        setFavorites(FavoritesArray);
    }

    async function getTopManga() {
        const res = await fetch("https://api.jikan.moe/v3/top/manga");
        const TopMangaArray = await res.json();
        setTopManga(TopMangaArray.top);
    }

    useEffect(() => {
        getfavorites();
        getTopManga();
        setLoading(false);

        // eslint-disable-next-line
    }, []);

    return (
        <ContentInfoWrapper>
            {choice === "My Manga List" ?
                <Pagination 
                    MainTitle={choice} 
                    postsPerPage={userData.postsPerPageAnimeManga} 
                    totalPosts={favorites.length} 
                    paginate={Fav.Paginate} 
                    currentPage={Fav.currentPage}
                /> 
                :
                <Pagination 
                    MainTitle={choice} 
                    postsPerPage={userData.postsPerPageAnimeManga} 
                    totalPosts={topManga.length} 
                    paginate={Top.Paginate} 
                    currentPage={Top.currentPage}
                /> 
            }
            <ContentInfo listContent>
                <div>
                    <Titulo primary>Options</Titulo>
                    {["My Manga List", "Top Manga"].map((options, index) => (
                        <Items onClick={() => handleChoice(options)} key={index}>{options}</Items>
                    ))}
                </div>  
                {loading || topManga.length === 0 ? 
                    <Spinner />
                    :
                    <ListItems animelist last>
                        {favorites.length === 0 && choice === "My Manga List" && <NoContent><Link to="/search">Add</Link> your favorite manga to this list!</NoContent> }

                        {choice === "My Manga List" && 
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
                                                    <p><b>Volumes: </b>{favorites.volumes ? favorites.volumes : "N/A"} </p>
                                                    <p><b>Chapters: </b>{favorites.chapters ? favorites.chapters : "N/A"}</p>
                                                    <p><b>Score: </b>{favorites.score ? favorites.score : "N/A"}</p>
                                                </div>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            <Link to={`/manga/${favorites.id_manga}`}><img src={favorites.image} alt="Manga Cover" /></Link>
                                        </div>
                                    </OverlayTrigger>
                                </div>
                            ))
                        }

                        {choice === "Top Manga" && 
                            Top.Pag.map((manga, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{manga.title}</b></h3>
                                                <hr style={{color: "white"}}/>
                                                <div className="details">
                                                    <p><b>Type: </b>{manga.type ? manga.type : "N/A"} </p>
                                                    <p><b>Rank: </b>{manga.rank ? manga.rank : "N/A"}</p>
                                                    <p><b>Score: </b>{manga.score ? manga.score : "N/A"}</p>
                                                </div>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            <Link to={`/manga/${manga.mal_id}`}><img src={manga.image_url.replace(".jpg", "l.jpg")} alt="Manga Cover" /></Link>
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

export default Mangalistings;