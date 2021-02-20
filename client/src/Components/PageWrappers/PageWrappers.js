import React, { Fragment } from 'react';
import Activity from '../Activity/Activity';
import Anime from '../Anime/Anime';
import AnimeListings from '../AnimeListings/AnimeListings';
import Browse from '../Browse/Browse';
import GenericFooter from '../GenericComponents/GenericFooter';
import GenericNavBar from '../GenericComponents/GenericNavBar';
import Home from '../Home/Home';
import Manga from '../Manga/Manga';
import MangaListings from '../MangaListings/MangaListings';
import Profile from '../Profile/Profile';
import Settings from '../Profile/Settings';

export const HomeWrapper = ({ guest, open, backdrop, handleToggle, logout }) => {
    return (
        <Fragment>
            <GenericNavBar guest={guest} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={logout} />
            <Home guest={guest} />
            <GenericFooter />
        </Fragment>
    );
}

export const BrowseWrapper = ({ guest, open, backdrop, handleToggle, logout }) => {
    return (
        <Fragment>
            <GenericNavBar guest={guest} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={logout} />
            <Browse guest={guest} />
            <GenericFooter />
        </Fragment>
    );
}

export const AnimeWrapper = ({ guest, open, backdrop, handleToggle, logout }) => {
    return (
        <Fragment>
            <GenericNavBar guest={guest} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={logout} />
            <Anime guest={guest} />
            <GenericFooter />
        </Fragment>
    );
}

export const AnimeListingsWrapper = ({ guest, open, backdrop, handleToggle, logout }) => {
    return (
        <Fragment>
            <GenericNavBar guest={guest} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={logout} />
            <AnimeListings guest={guest} />
            <GenericFooter />
        </Fragment>
    );
}

export const MangaWrapper = ({ guest, open, backdrop, handleToggle, logout }) => {
    return (
        <Fragment>
            <GenericNavBar guest={guest} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={logout} />
            <Manga guest={guest} />
            <GenericFooter />
        </Fragment>
    );
}

export const MangaListingsWrapper = ({ guest, open, backdrop, handleToggle, logout }) => {
    return (
        <Fragment>
            <GenericNavBar guest={guest} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={logout} />
            <MangaListings guest={guest} />
            <GenericFooter />
        </Fragment>
    );
}

export const ActivityWrapper = ({ guest, open, backdrop, handleToggle, logout }) => {
    return (
        <Fragment>
            <GenericNavBar guest={guest} open={open} backdrop={backdrop} handleToggle={handleToggle} logout={logout} />
            <Activity />
            <GenericFooter />
        </Fragment>
    );
}

export const ProfileWrapper = ({ open, backdrop, handleToggle, logout }) => {
    return (
        <Fragment>
            <GenericNavBar open={open} backdrop={backdrop} handleToggle={handleToggle} logout={logout} />
            <Profile />
            <GenericFooter />
        </Fragment>
    );
}

export const SettingsWrapper = ({ setUserData, open, backdrop, handleToggle, logout }) => {
    return (
        <Fragment>
            <GenericNavBar open={open} backdrop={backdrop} handleToggle={handleToggle} logout={logout} />
            <Settings setUserData={setUserData} />
            <GenericFooter />
        </Fragment>
    );
}