import React, { useState, useEffect, Fragment } from 'react';
import {  BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './App.css';
import LoginUser from './Components/Login/Login';
import RegisterUser from './Components/Sign Up/Register';
import HomeUser from './Components/Geral/Home';
import NavBar from './Components/NavBar/Navbar';
import SideBar from './Components/NavBar/Sidebar';
import BackDrop from './Components/NavBar/Backdrop';
import UserAnime from './Components/Anime/Anime';
import Animelistings from './Components/Anime/AnimeListings';
import BrowseAniDash from './Components/Browse/Browse';
import UserManga from './Components/Manga/Manga';
import Mangalistings from './Components/Manga/MangaListings';
import UserProfile from './Components/Profile/Profile';
import ProfileOfGivenUsername from './Components/Profile/ProfileOfGivenUsername';
import UserActivity from './Components/Geral/Activity';
import { Footer } from './Components/Styled Components/text';

const APIUrl = process.env.REACT_APP_API_URL;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
    postsPerPageHome: "",
    postsPerPageAnimeManga: "",
    postsPerPageDetails: "",
    postsPerPageProfile: ""
  });

  const checkAuthenticated = async () => {
    try {
      const res = await fetch(APIUrl + "/autenticar/verificar", {
        headers: { "jwtToken": localStorage.jwtToken }
      })

      const parseRes = await res.json();
      
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);

    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    const data = localStorage.getItem("user");

    if(data) {
      try {
        setUserData(JSON.parse(data));
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    checkAuthenticated();
    localStorage.setItem("user", JSON.stringify(userData));
  });

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }

  const setUser = (username_user, email_user, avatar_user, postshome_user, postsanime_user, postsmanga_user, postsprofile_user) => {
    setUserData({
      username: username_user,
      email: email_user,
      avatar: avatar_user,
      postsPerPageHome: postshome_user,
      postsPerPageAnimeManga: postsanime_user,
      postsPerPageDetails: postsmanga_user,
      postsPerPageProfile: postsprofile_user
    });
  }

  return (
    <Router>
      <Switch>
          <Route exact path="/" render={props => !isAuthenticated ? (<Login {...props} setUser={setUser} setAuth={setAuth} />) : (<Redirect to="/home"/> )}></Route>              
          <Route path="/register" exact component={Register}></Route>              
          <Route path="/home" render={props => isAuthenticated ? (<Home {...props} userData={userData} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
          <Route path="/search" render={props => isAuthenticated ? (<Browse {...props} userData={userData} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
          <Route exact path="/anime" render={props => isAuthenticated ? (<AnimeList {...props} userData={userData} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
          <Route exact path="/manga" render={props => isAuthenticated ? (<MangaList {...props} userData={userData} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
          <Route path="/anime/:id_anime" render={props => isAuthenticated ? (<Anime {...props} userData={userData} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
          <Route path="/manga/:id_manga" render={props => isAuthenticated ? (<Manga {...props} userData={userData} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
          <Route exact path="/profile" render={props => isAuthenticated ? (<Profile {...props} setUser={setUser} userData={userData} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
          <Route path="/profile/:username" render={props => isAuthenticated ? (<ProfileGivenUser {...props} userData={userData} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
          <Route path="/activity" render={props => isAuthenticated ? (<Activity {...props} userData={userData} setAuth={setAuth} />) : (<Redirect to="/" />)}></Route>
       </Switch>
    </Router>
  )
}

export default App;

function Login({setAuth, setUser}) {  
  return (
    <LoginUser setUser={setUser} setAuth={setAuth} />
  )
}

function Register() {
  return (
    <RegisterUser />
  )
}

function Home({setAuth, userData}) {
  const [open, setOpen] = useState(false);

  if(JSON.parse(localStorage.getItem("user")).username !== userData.username || JSON.parse(localStorage.getItem("user")).email !== userData.email) {
    localStorage.removeItem("jwtToken");
  }

  const handleToggle = () => {
    setOpen(!open);
  }

  const handleBackdrop = () => {
    setOpen(false);
  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  let backdrop;

  if(open) {
    backdrop = <BackDrop handleBackdrop={handleBackdrop} />;
  }

  return (
    <Fragment>
      <NavBar userData={userData} handleToggle={handleToggle} logout={logout}/>
      <SideBar estado={open} logout={logout}/>
      {backdrop}
      <HomeUser userData={userData} />
      <Footer>Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></Footer>
    </Fragment>
  )
}

function Browse({setAuth, userData}) {
  const [open, setOpen] = useState(false);

  if(JSON.parse(localStorage.getItem("user")).username !== userData.username || JSON.parse(localStorage.getItem("user")).email !== userData.email) {
    localStorage.removeItem("jwtToken");
  }

  const handleToggle = () => {
    setOpen(!open);
  }

  const handleBackdrop = () => {
    setOpen(false);
  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
    } catch (err) {
      console.error(err.message)
    }
  }

  let backdrop;

  if(open) {
    backdrop = <BackDrop handleBackdrop={handleBackdrop} />;
  }

  return (
    <Fragment>
      <NavBar userData={userData} handleToggle={handleToggle} logout={logout}/>
      <SideBar estado={open} logout={logout}/>
      {backdrop}
      <BrowseAniDash />
      <Footer>Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></Footer>
    </Fragment>
  )
}

function AnimeList({setAuth, userData}) {
  const [open, setOpen] = useState(false);

  if(JSON.parse(localStorage.getItem("user")).username !== userData.username || JSON.parse(localStorage.getItem("user")).email !== userData.email) {
    localStorage.removeItem("jwtToken");
  }

  const handleToggle = () => {
    setOpen(!open);
  }

  const handleBackdrop = () => {
    setOpen(false);
  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
    } catch (err) {
      console.error(err.message)
    }
  }

  let backdrop;

  if(open) {
    backdrop = <BackDrop handleBackdrop={handleBackdrop} />;
  }

  return (
    <Fragment>
      <NavBar userData={userData} handleToggle={handleToggle} logout={logout}/>
      <SideBar estado={open} logout={logout}/>
      {backdrop}
      <Animelistings userData={userData} />
      <Footer>Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></Footer>
    </Fragment>
  )
}

function MangaList({setAuth, userData}) {
  const [open, setOpen] = useState(false);

  if(JSON.parse(localStorage.getItem("user")).username !== userData.username || JSON.parse(localStorage.getItem("user")).email !== userData.email) {
    localStorage.removeItem("jwtToken");
  }

  const handleToggle = () => {
    setOpen(!open);
  }

  const handleBackdrop = () => {
    setOpen(false);
  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
    } catch (err) {
      console.error(err.message)
    }
  }

  let backdrop

  if(open) {
    backdrop = <BackDrop handleBackdrop={handleBackdrop} />;
  }

  return (
    <Fragment>
      <NavBar userData={userData} handleToggle={handleToggle} logout={logout}/>
      <SideBar estado={open} logout={logout}/>
      {backdrop}
      <Mangalistings userData={userData} />
      <Footer>Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></Footer>
    </Fragment>
  )
}

function Anime({setAuth, userData}) {
  const [open, setOpen] = useState(false);

  if(JSON.parse(localStorage.getItem("user")).username !== userData.username || JSON.parse(localStorage.getItem("user")).email !== userData.email) {
    localStorage.removeItem("jwtToken");
  }

  const handleToggle = () => {
    setOpen(!open);
  }

  const handleBackdrop = () => {
    setOpen(false);
  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  let backdrop;

  if(open) {
    backdrop = <BackDrop handleBackdrop={handleBackdrop} />;
  }

  return (
    <Fragment>
      <NavBar userData={userData} handleToggle={handleToggle} logout={logout}/>
      <SideBar estado={open} logout={logout}/>
      {backdrop}
      <UserAnime userData={userData} />
      <Footer>Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></Footer>
    </Fragment>
  )
}

function Manga({setAuth, userData}) {
  const [open, setOpen] = useState(false);

  if(JSON.parse(localStorage.getItem("user")).username !== userData.username || JSON.parse(localStorage.getItem("user")).email !== userData.email) {
    localStorage.removeItem("jwtToken");
  }

  const handleToggle = () => {
    setOpen(!open);
  }

  const handleBackdrop = () => {
    setOpen(false);
  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  let backdrop;

  if(open) {
    backdrop = <BackDrop handleBackdrop={handleBackdrop} />;
  }

  return (
    <Fragment>
      <NavBar userData={userData} handleToggle={handleToggle} logout={logout}/>
      <SideBar estado={open} logout={logout}/>
      {backdrop}
      <UserManga userData={userData} />
      <Footer>Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></Footer>
    </Fragment>
  )
}

function Profile({setAuth, userData, setUser}) {
  const [open, setOpen] = useState(false);

  if(JSON.parse(localStorage.getItem("user")).username !== userData.username || JSON.parse(localStorage.getItem("user")).email !== userData.email) {
    localStorage.removeItem("jwtToken");
  }

  const handleToggle = () => {
    setOpen(!open);
  }

  const handleBackdrop = () => {
    setOpen(false);
  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  let backdrop;

  if(open) {
    backdrop = <BackDrop handleBackdrop={handleBackdrop} />;
  }

  return (
    <Fragment>
      <NavBar userData={userData} handleToggle={handleToggle} logout={logout}/>
      <SideBar estado={open} logout={logout}/>
      {backdrop}
      <UserProfile userData={userData} setUser={setUser} />
      <Footer>Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></Footer>
    </Fragment>
  )
}

function ProfileGivenUser({setAuth, userData}) {
  const [open, setOpen] = useState(false);

  if(JSON.parse(localStorage.getItem("user")).username !== userData.username || JSON.parse(localStorage.getItem("user")).email !== userData.email) {
    localStorage.removeItem("jwtToken");
  }

  const handleToggle = () => {
    setOpen(!open);
  }

  const handleBackdrop = () => {
    setOpen(false);
  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  let backdrop;

  if(open) {
    backdrop = <BackDrop handleBackdrop={handleBackdrop} />;
  }

  return (
    <Fragment>
      <NavBar userData={userData} handleToggle={handleToggle} logout={logout}/>
      <SideBar estado={open} logout={logout}/>
      {backdrop}
      <ProfileOfGivenUsername userData={userData} />
      <Footer>Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></Footer>
    </Fragment>
  )
}

function Activity({setAuth, userData}) {
  const [open, setOpen] = useState(false);

  if(JSON.parse(localStorage.getItem("user")).username !== userData.username || JSON.parse(localStorage.getItem("user")).email !== userData.email) {
    localStorage.removeItem("jwtToken");
  }

  const handleToggle = () => {
    setOpen(!open);
  }

  const handleBackdrop = () => {
    setOpen(false);
  }

  const logout = async e => {
    e.preventDefault();
    try {
      localStorage.removeItem("jwtToken");
      setAuth(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  let backdrop;

  if(open) {
    backdrop = <BackDrop handleBackdrop={handleBackdrop} />;
  }

  return (
    <Fragment>
      <NavBar userData={userData} handleToggle={handleToggle} logout={logout}/>
      <SideBar estado={open} logout={logout}/>
      {backdrop}
      <UserActivity userData={userData} />
      <Footer>Made by <a target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro.</a></Footer>
    </Fragment>
  )
}