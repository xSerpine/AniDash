import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import UserContext from './Context/UserContext';
import BackDrop from './Components/NavBar/Backdrop';
import Login from './Components/Login/Login';
import Register from './Components/Sign Up/Register';
import { Titulo } from './Components/Styled Components/text';
import PageNotFound from './Components/Errors/PageNotFound';
import ConfirmationPage from './Components/Sign Up/ConfirmationPage';
import RecoverMethod from './Components/Login/RecoverMethod';
import RecoverPassword from './Components/Login/RecoverPassword';
import { API } from './Hooks/API';
import { Spinner, SpinnerWithText } from './Components/Styled Components/loader';
import { ActivityWrapper, AnimeListingsWrapper, AnimeWrapper, BrowseWrapper, HomeWrapper, MangaListingsWrapper, MangaWrapper, ProfileWrapper, SettingsWrapper } from './Components/PageWrappers/PageWrappers';

const APIUrl = process.env.REACT_APP_API_URL;

const App = () => {
	const data = localStorage.getItem('user');
	const token = localStorage.getItem('jwtToken');

	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(token ? true : false);
	const [user, setUser] = useState({
		id: data ? JSON.parse(data).id : '',
		username: data ? JSON.parse(data).username : '',
		email:  data ? JSON.parse(data).email : '',
		avatar:  data ? JSON.parse(data).avatar : '',
		SFW: data ? JSON.parse(data).SFW : ''
	})

	const checkAPI = async() => {
		const { status } = await API('GET', `${APIUrl}`);
		if(status === 200) setLoading(false);
	}

	const checkAuthenticated = async() => {
		if(!user.id) return;

		try {
			const { data } = await API('GET', `${APIUrl}/auth/verify`, true);
			setIsAuthenticated(data ? true : false);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {	
		checkAPI();	
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

	const handleToggle = () => {
		setOpen(!open);
	};

	const handleBackdrop = () => {
		setOpen(false);
	};

	let backdrop;
	if(open) backdrop = <BackDrop handleBackdrop={handleBackdrop} />;

	const handleLogout = () => {
		localStorage.clear();
		setIsAuthenticated(false);
		setUser({
			id: '',
			username: '',
			email: '',
			avatar: '',
			SFW: ''
		})
	}

	if(loading) return (
		<SpinnerWithText>
			<Spinner />
			<Titulo>Booting up AniDash API... Might take a few seconds 🙂</Titulo>
		</SpinnerWithText>
	);

	return (
		<UserContext.Provider value={user}>
			<Router>
				<Switch>
					<Route exact path='/' render={props => !isAuthenticated ? <Login {...props} setAuth={setAuth} setUserData={setUserData} /> : <Redirect to='/home'/> }></Route>              
					<Route exact path='/register' component={Register}></Route>
            
					<Route exact path='/home' render={props => isAuthenticated ? <HomeWrapper {...props} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/search' render={props => isAuthenticated ? <BrowseWrapper {...props} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/anime' render={props => isAuthenticated ? <AnimeListingsWrapper {...props} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/manga' render={props => isAuthenticated ? <MangaListingsWrapper {...props} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/anime/:id_anime' render={props => isAuthenticated ? <AnimeWrapper {...props} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/manga/:id_manga' render={props => isAuthenticated ? <MangaWrapper {...props} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/profile/:username' render={props => isAuthenticated ? <ProfileWrapper {...props} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/activity' render={props => isAuthenticated ? <ActivityWrapper {...props} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					<Route exact path='/settings' render={props => isAuthenticated ? <SettingsWrapper {...props} setUserData={setUserData} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} /> : <Redirect to='/' />}></Route>
					
					<Route exact path='/guest' render={props => <HomeWrapper {...props} guest={true} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} />}></Route>
					<Route exact path='/guest/search' render={props => <BrowseWrapper {...props} guest={true} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} />}></Route>
					<Route exact path='/guest/anime' render={props => <AnimeListingsWrapper {...props} guest={true} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} />}></Route>
					<Route exact path='/guest/manga' render={props => <MangaListingsWrapper {...props} guest={true} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} />}></Route>
					<Route exact path='/guest/anime/:id_anime' render={props => <AnimeWrapper {...props} guest={true} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} />}></Route>
					<Route exact path='/guest/manga/:id_manga' render={props => <MangaWrapper {...props} guest={true} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={handleLogout} />}></Route>

					<Route exact path='/forgot' component={RecoverMethod}></Route>
					<Route exact path='/forgot/:token' component={RecoverPassword}></Route>
					<Route exact path='/confirm/:token' component={ConfirmationPage}></Route>
					<Route component={PageNotFound} />
				</Switch>
			</Router>
		</UserContext.Provider>
	);
}

export default App;