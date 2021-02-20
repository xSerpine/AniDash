import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdContent } from '../Styled Components/content';
import { SpacingElement } from '../Styled Components/navbar';
import { Titulo } from '../Styled Components/text';
import AiringContent from './AiringContent';
import OngoingFavorites from './OngoingFavorites';

const Home = ({ guest }) => {
	document.title = 'Home • AniDash';
	
	useEffect(() => {
		window.scrollTo(0, 0);
		
	}, [])

	return (
		<Fragment>
			<SpacingElement unwrapped />
			{guest &&
				<AdContent>
					<div>
						<Titulo style={{fontSize: '30px'}}>Ani<span style={{color: '#fff'}}>Dash</span></Titulo>
						<Link to='/register'>Sign up</Link> for the whole AniDash experience!
					</div>
					<div>
						<ul>
							<li>Set your anime or manga as planning, completed, watching/reading or dropped.</li>
							<li>Keep track of your episodes watched and chapters read.</li>
							<li>Follow your friends to see what they are watching/reading.</li>
							<li>Check your anime and manga stats such as the amount of hours spent watching anime or reading manga.</li>
						</ul>
					</div>
				</AdContent>
			}
			<AiringContent guest={guest} />
			{!guest &&
				<>
					<OngoingFavorites type='anime' />
					<OngoingFavorites type='manga' />
				</>
			}
		</Fragment>
	);
}

export default Home;