import React, { useState, useEffect, Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import LoginUser from './Components/Login/Login';
import RegisterUser from './Components/Sign Up/Register';
import HomeUser from './Components/Home/Home';
import NavBar from './Components/NavBar/Navbar';
import SideBar from './Components/NavBar/Sidebar';
import BackDrop from './Components/NavBar/Backdrop';
import AnimeInfo from './Components/Anime/Anime';
import Animelistings from './Components/AnimeListings/AnimeListings';
import BrowseAniDash from './Components/Browse/Browse';
import MangaInfo from './Components/Manga/Manga';
import Mangalistings from './Components/MangaListings/MangaListings';
import UserProfile from './Components/Profile/Profile';
import UserActivity from './Components/Activity/Activity';
import { Footer } from './Components/Styled Components/text';
import { SpacingElement } from './Components/Styled Components/navbar';
import UserContext from './Context/UserContext';
import PageNotFound from './Components/Errors/PageNotFound';
import ConfirmationPage from './Components/Sign Up/ConfirmationPage';
import RecoverMethod from './Components/Login/RecoverMethod';
import RecoverPassword from './Components/Login/RecoverPassword';
import UserSettings from './Components/Profile/Settings';

const APIUrl = 'https://anidash-api.herokuapp.com';

const App = () => {
	const data = localStorage.getItem('user');
	const token = localStorage.getItem('jwtToken');

	const [isAuthenticated, setIsAuthenticated] = useState(token ? true : false);
	const [user, setUser] = useState({
		id: data ? JSON.parse(data).id : '',
		username: data ? JSON.parse(data).username : '',
		email:  data ? JSON.parse(data).email : '',
		avatar:  data ? JSON.parse(data).avatar : '',
		SFW: data ? JSON.parse(data).SFW : ''
	})

	const checkAuthenticated = async () => {
		if(!user.id) return;

		try {
			const res = await fetch(`${APIUrl}/auth/verify`, {
				headers: {
					Authorization: localStorage.getItem('jwtToken')
				}
			});

			const parseRes = await res.json();

			setIsAuthenticated(parseRes ? true : false);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {		
		checkAuthenticated();

		// eslint-disable-next-line
	}, []);

	const setAuth = (boolean) => {
		setIsAuthenticated(boolean);
	};

	const setUserData = (id, username, email, avatar, sfw) => {
		setUser({
			id: id,
			username: username,
			email: email,
			avatar: avatar,
			SFW: sfw
		})
	}

	const handleLogout = () => {
		localStorage.clear();
		setIsAuthenticated(false);
	}

	return (
		<UserContext.Provider value={user}>
			<Router>
				<Switch>
					<Route exact path='/' render={props => !isAuthenticated ? <Login {...props} setAuth={setAuth} setUserData={setUserData} /> : <Redirect to='/home'/> }></Route>              
					<Route exact path='/register' component={Register}></Route>
            
					<Route exact path='/home' render={props => isAuthenticated ? <Home {...props} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/search' render={props => isAuthenticated ? <Browse {...props} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/anime' render={props => isAuthenticated ? <AnimeList {...props} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/manga' render={props => isAuthenticated ? <MangaList {...props} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/anime/:id_anime' render={props => isAuthenticated ? <Anime {...props} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/manga/:id_manga' render={props => isAuthenticated ? <Manga {...props} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/profile/:username' render={props => isAuthenticated ? <Profile {...props} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/activity' render={props => isAuthenticated ? <Activity {...props} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/settings' render={props => isAuthenticated ? <Settings {...props} setUserData={setUserData} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					
					<Route exact path='/guest' render={props => <Home {...props} guest={true} logout={handleLogout} />}></Route>
					<Route exact path='/guest/search' render={props => <Browse {...props} guest={true} logout={handleLogout} />}></Route>
					<Route exact path='/guest/anime' render={props => <AnimeList {...props} guest={true} logout={handleLogout} />}></Route>
					<Route exact path='/guest/manga' render={props => <MangaList {...props} guest={true} logout={handleLogout} />}></Route>
					<Route exact path='/guest/anime/:id_anime' render={props => <Anime {...props} guest={true} logout={handleLogout} />}></Route>
					<Route exact path='/guest/manga/:id_manga' render={props => <Manga {...props} guest={true} logout={handleLogout} />}></Route>

					<Route exact path='/forgot' component={Forgot}></Route>
					<Route exact path='/forgot/:token' component={Recover}></Route>
					<Route exact path='/confirm/:token' component={Confirm}></Route>
					<Route component={Error} />
				</Switch>
			</Router>
		</UserContext.Provider>
	);
}

export default App;

const Error = () => {
	return <PageNotFound />
}

const Forgot = () => {
	return <RecoverMethod />
}

const Recover = () => {
	return <RecoverPassword />
}

const Confirm = () => {
	return <ConfirmationPage />
}

const Login = ({ setAuth, setUserData }) => {
	return <LoginUser setAuth={setAuth} setUserData={setUserData} />;
}

const Register = () => {
	return <RegisterUser />;
}

const Home = ({ guest = false, logout }) => {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if (open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	return (
		<Fragment>
			<NavBar guest={guest} handleToggle={handleToggle} logout={logout} />
			<SideBar guest={guest} estado={open} logout={logout} />
			{backdrop}
			<HomeUser guest={guest} />
			<SpacingElement footer />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
		</Fragment>
	);
}

const Browse = ({ guest = false, logout }) => {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if (open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	return (
		<Fragment>
			<NavBar guest={guest} handleToggle={handleToggle} logout={logout} />
			<SideBar guest={guest} estado={open} logout={logout} />
			{backdrop}
			<BrowseAniDash guest={guest} />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
		</Fragment>
	);
}

const AnimeList = ({ guest = false, logout }) => {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if (open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	return (
		<Fragment>
			<NavBar guest={guest} handleToggle={handleToggle} logout={logout} />
			<SideBar guest={guest} estado={open} logout={logout} />
			{backdrop}
			<Animelistings guest={guest} />
			<SpacingElement footer />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
		</Fragment>
	);
}

const MangaList = ({ guest = false, logout }) => {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if (open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	return (
		<Fragment>
			<NavBar guest={guest} handleToggle={handleToggle} logout={logout} />
			<SideBar guest={guest} estado={open} logout={logout} />
			{backdrop}
			<Mangalistings guest={guest} />
			<SpacingElement footer />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
		</Fragment>
	);
}

const Anime = ({ guest = false, logout }) => {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if (open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	return (
		<Fragment>
			<NavBar guest={guest} handleToggle={handleToggle} logout={logout} />
			<SideBar guest={guest} estado={open} logout={logout} />
			{backdrop}
			<AnimeInfo guest={guest} />
			<SpacingElement footer />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
		</Fragment>
	);
}

const Manga = ({ guest = false, logout }) => {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if (open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	return (
		<Fragment>
			<NavBar guest={guest} handleToggle={handleToggle} logout={logout} />
			<SideBar guest={guest} estado={open} logout={logout} />
			{backdrop}
			<MangaInfo guest={guest} />
			<SpacingElement footer />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
		</Fragment>
	);
}

const Profile = ({ logout }) => {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if (open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	return (
		<Fragment>
			<NavBar handleToggle={handleToggle} logout={logout} />
			<SideBar estado={open} logout={logout} />
			{backdrop}
			<UserProfile />
			<SpacingElement footer />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
		</Fragment>
	);
}

const Activity = ({ logout,  }) => {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if (open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	return (
		<Fragment>
			<NavBar handleToggle={handleToggle} logout={logout} />
			<SideBar estado={open} logout={logout} />
			{backdrop}
			<UserActivity />
			<SpacingElement footer />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
		</Fragment>
	);
}

const Settings = ({ setUserData, logout }) => {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if (open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	return (
		<Fragment>
			<NavBar handleToggle={handleToggle} logout={logout} />
			<SideBar estado={open} logout={logout} />
			{backdrop}
			<UserSettings setUserData={setUserData} />
			<SpacingElement footer />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
		</Fragment>
	);
}