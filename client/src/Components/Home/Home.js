import React, { Fragment, useEffect } from 'react';
import { SpacingElement } from '../Styled Components/navbar';
import AiringAnime from './AiringAnime';
import OngoingFavorites from './OngoingFavorites';

const HomeUser = ({ guest }) => {
	document.title = 'Home • AniDash';
	
	useEffect(() => {
		window.scrollTo(0, 0);

	}, [])

	return (
		<Fragment>
			<SpacingElement unwrapped />
			<AiringAnime guest={guest} />
			{!guest &&
				<>
					<OngoingFavorites type='anime' />
					<OngoingFavorites type='manga' />
				</>
			}
		</Fragment>
	);
}

export default HomeUser;