import React, { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProfilePicture, ProfilePageWrapper, InfoWrapper } from '../Styled Components/profile';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ContentInfoWrapper, ContentInfo, TituloWrapper } from '../Styled Components/content';
import { Titulo } from '../Styled Components/text';
import { Space } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';
import Pagination from '../Geral/Pagination';
import usePaginate from '../Utils/usePaginate';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function ProfileOfGivenUsername({userData}) {
    //Estados
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
    const [isFollow, setIsFollow] = useState(false);
    const [user, setUser] = useState([]);
    const [anime, setAnime] = useState([]);
    const [manga, setManga] = useState([]);
    const [follow, setFollow] = useState({
        countFollowers: 0,
        countFollowing: 0,
        userFollowers: [],
        userFollowing: []
    });

    //Parametro do url
    const { username } = useParams();

    // eslint-disable-next-line
    let Paginate, Pag, currentPage;
    const Anime = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageProfile, anime);
    const Manga = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageProfile, manga);
    const Followers = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageProfile, follow.userFollowers);
    const Following = { Paginate, Pag, currentPage } = usePaginate(userData.postsPerPageProfile, follow.userFollowing);

    //Atualizar conteudo
    const handleAnchor = () => {
        setUpdate(!update);
        setLoading(true);
    }

    //Ações
    const handleAddFollow = async() => {
        try {
            const body = { 
                id_utilizador: user.id_utilizador, 
                email_follower: userData.email, 
            };

            const response = await fetch(`${APIUrl}/follow`,
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );
    
            const parseRes = await response.json();
    
            if (parseRes === "OK") {
                toast.success("You're now following " + user.username, { position: "bottom-right" });
                setUpdate(!update);
            } else {
                toast.error(parseRes, { position: "bottom-right" });
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleRemoveFollow = async() => {
        try {
            const body = { 
                id_utilizador: user.id_utilizador, 
                email_follower: userData.email, 
            };

            const response = await fetch(`${APIUrl}/follow`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );
    
            const parseRes = await response.json();
    
            if (parseRes === "OK") {
                toast.success("You stopped following " + user.username, { position: "bottom-right" });
                setUpdate(!update);
            } else {
                toast.error(parseRes, { position: "bottom-right" });
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    //Requests
    async function checkIfFollow() {
        const res = await fetch(`${APIUrl}/follow/${username}/${userData.email}`);
        const parseRes = await res.json();
        if(parseRes) setIsFollow(true);
    }

    async function getFollows() {
        const res = await fetch(`${APIUrl}/follow/${username}`);
        const FollowsArray = await res.json();
        setFollow({
            countFollowers: FollowsArray.contagem_followers.followers,
            countFollowing: FollowsArray.contagem_following.followers,
            userFollowers: FollowsArray.info_followers,
            userFollowing: FollowsArray.info_following
        });
    }

    async function getUser() {
        const res = await fetch(`${APIUrl}/users/${username}`);
        const UserArray = await res.json();
        setUser(UserArray);
    }

    async function getAnime() {
        const res = await fetch(`${APIUrl}/favoritos/${username}/anime`);
        const AnimeArray = await res.json();
        setAnime(AnimeArray);
    }

    async function getManga() {
        const res = await fetch(`${APIUrl}/favoritos/${username}/manga`);
        const MangaArray = await res.json();
        setManga(MangaArray);
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        getUser();
        getFollows();
        getAnime();
        getManga();
        checkIfFollow();
        setIsFollow(false);
        setLoading(false);

        // eslint-disable-next-line
    }, [update]);

    return (
        <Fragment>
            <TituloWrapper>
                <Space />
                {userData.username === username ?
                    <Titulo>{user.username}'s Profile</Titulo>
                    :
                    isFollow ? 
                        <Titulo>{user.username}'s Profile <i onClick={handleAddFollow} className='far fa-heart'></i></Titulo> 
                        : 
                        <Titulo>{user.username}'s Profile <i onClick={handleRemoveFollow} className='fas fa-heart'></i></Titulo>                     
                }
                <Space />
            </TituloWrapper>
            {loading ?
                <Spinner />
                :
                <ProfilePageWrapper>
                    {user.avatar ? 
                        <ProfilePicture src={user.avatar} alt="User Avatar" /> 
                        : 
                        <ProfilePicture src="/imagens/placeholder.png" alt="User Avatar" /> 
                    }
                    <InfoWrapper>
                        <Space />
                        <p><b>Username</b><br/>{user.username}</p>
                        <Space />
                        <p><b>Anime</b><br/>{anime.length}</p>
                        <Space />
                        <p><b>Manga</b><br/>{manga.length}</p>
                        <Space />
                        <p><b>Followers</b><br/>{follow.countFollowers}</p>
                        <Space />
                        <p><b>Following</b><br/>{follow.countFollowing}</p>
                        <Space />
                    </InfoWrapper>
                </ProfilePageWrapper>
            }
            <Pagination 
                style={{width: "80%", margin: "0 auto"}} 
                MainTitle={`${user.username}'s Anime`} 
                postsPerPage={userData.postsPerPageProfile} 
                totalPosts={anime.length} 
                paginate={Anime.Paginate} 
                currentPage={Anime.currentPage}/
            > 
            {loading ?
                <Spinner />
                :
                <ContentInfoWrapper>
                    <ContentInfo bottom>
                        {anime.length > 0 ? 
                            Anime.Pag.map((anime, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{anime.nome}</b></h3>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            <Link to={`/anime/${anime.id_anime}`}><img src={anime.image} alt="Anime Cover"/></Link>
                                        </div>
                                    </OverlayTrigger>
                        
                                </div>
                            )) 
                            : 
                            <div style={{width: "77vw", textAlign: "center"}}>You don't have any Anime yet!</div>
                        }
                    </ContentInfo>
                </ContentInfoWrapper>
            }
            <Pagination 
                style={{width: "80%", margin: "0 auto"}} 
                MainTitle={`${user.username}'s Manga`} 
                postsPerPage={userData.postsPerPageProfile} 
                totalPosts={manga.length} 
                paginate={Manga.Paginate} 
                currentPage={Manga.currentPage}
            /> 
            {loading ?
                <Spinner />
                :
                <ContentInfoWrapper>
                    <ContentInfo bottom>
                        {manga.length > 0 ? 
                            Manga.Pag.map((manga, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{manga.nome}</b></h3>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            <Link to={`/manga/${manga.id_manga}`}><img src={manga.image} alt="Anime Cover"/></Link>
                                        </div>
                                    </OverlayTrigger>
                        
                                </div>
                            )) 
                            : 
                            <div style={{width: "77vw", textAlign: "center"}}>You don't have any Manga yet!</div>
                        }
                    </ContentInfo>
                </ContentInfoWrapper>
            }
            <Pagination 
                style={{width: "80%", margin: "0 auto"}} 
                MainTitle={`${user.username}'s Followers`} 
                postsPerPage={userData.postsPerPageProfile} 
                totalPosts={follow.userFollowers.length} 
                paginate={Followers.Paginate} 
                currentPage={Followers.currentPage}
            /> 
            {loading ?
                <Spinner />
                :
                <ContentInfoWrapper>
                    <ContentInfo bottom users>
                        {follow.userFollowers.length > 0 ? 
                            Followers.Pag.map((user, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{user.username}</b></h3>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            {   user.avatar ? 
                                                <Link onClick={handleAnchor} to={`/profile/${user.username}`}><img style={{borderRadius: "50%"}} src={user.avatar} alt="User Avatar" /></Link>
                                                :
                                                <Link onClick={handleAnchor} to={`/profile/${user.username}`}><img style={{borderRadius: "50%"}} src="/imagens/placeholder.png" alt="User Avatar" /></Link>
                                            }                                   
                                        </div>
                                    </OverlayTrigger>
                        
                                </div>
                            )) 
                            : 
                            <div style={{width: "77vw", textAlign: "center"}}>{user.username} doesn't have any followers yet!</div>
                        }
                    </ContentInfo>
                </ContentInfoWrapper>
            }
            <Pagination 
                style={{width: "80%", margin: "0 auto"}} 
                MainTitle={`${user.username}'s Following`} 
                postsPerPage={userData.postsPerPageProfile} 
                totalPosts={follow.userFollowing.length} 
                paginate={Following.Paginate} 
                currentPage={Following.currentPage}
            /> 
            {loading ?
                <Spinner />
                :
                <ContentInfoWrapper>
                    <ContentInfo bottom users last>
                        {follow.userFollowing.length > 0 ? 
                            Following.Pag.map((user, index) => (
                                <div className="item" key={index}>
                                    <OverlayTrigger
                                        key={index}
                                        placement="auto"
                                        overlay={
                                            <Tooltip className="AnimeDetails">
                                                <h3><b>{user.username}</b></h3>
                                            </Tooltip>
                                        }
                                    >
                                        <div variant="secondary">
                                            {   user.avatar ? 
                                                <Link onClick={handleAnchor} to={`/profile/${user.username}`}><img style={{borderRadius: "50%"}} src={user.avatar} alt="User Avatar" /></Link>
                                                :
                                                <Link onClick={handleAnchor} to={`/profile/${user.username}`}><img style={{borderRadius: "50%"}} src="/imagens/placeholder.png" alt="User Avatar" /></Link>
                                            }                                   
                                        </div>
                                    </OverlayTrigger>
                        
                                </div>
                            )) 
                            : 
                            <div style={{width: "77vw", textAlign: "center"}}>{user.username} isn't following anyone yet!</div>
                        }
                    </ContentInfo>
                </ContentInfoWrapper>
            }
        </Fragment>
    );
}

export default ProfileOfGivenUsername;