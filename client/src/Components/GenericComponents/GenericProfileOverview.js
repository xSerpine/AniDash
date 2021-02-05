import React, { Fragment } from 'react';
import { ProfileOverviewWrapper, ProfilePicture, ProfileStats } from '../Styled Components/profile';
import { Titulo } from '../Styled Components/text';

const GenericProfileOverview = ({
    title,
    followState,
    user,
    array
}) => {
    return (
        <Fragment>
            <Titulo>{title} {followState}</Titulo>
            <ProfileOverviewWrapper>
                {user.avatar ? 
                    <ProfilePicture src={user.avatar} alt={`${user.username} avatar`} self />
                    :
                    <ProfilePicture src='/imagens/placeholder.png' alt={`${user.username} avatar`} self />
                }
                <ProfileStats>
                    <div>
                        <b>Anime</b>
                        <br/>
                        {array.animeCount}
                    </div>
                    <div>
                        <b>Manga</b>
                        <br/>
                        {array.mangaCount}
                    </div>
                    <div>
                        <b>Followers</b>
                        <br/>
                        {array.followersCount}
                    </div>
                    <div>
                        <b>Following</b>
                        <br/>
                        {array.followingCount}
                    </div>
                </ProfileStats>
            </ProfileOverviewWrapper>
        </Fragment>
    );
}

export default GenericProfileOverview;