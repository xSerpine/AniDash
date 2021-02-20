import React, { useState, useEffect, Fragment } from 'react';
import { API } from '../../Hooks/API';
import { SpacingElement } from '../Styled Components/navbar';
import { Spinner } from '../Styled Components/loader';
import AiringResults from './AiringResults';

const AiringContent = ({ guest }) => {
	const [loading, setLoading] = useState(true);
	const [airingData, setAiringData] = useState([]);

	const getAiringAnime = async() => {
		const { data } = await API('GET', 'https://api.jikan.moe/v3/schedule');
		setAiringData(data);
		setLoading(false);
	}

	useEffect(() => {
        getAiringAnime();

		// eslint-disable-next-line
	}, []);

    if(loading) return (
		<>
			<SpacingElement unwrapped />
			<Spinner />
		</>
	)

	return (
		<Fragment>
            <AiringResults type='today' array={airingData} guest={guest} />
            <AiringResults type='tomorrow' array={airingData} guest={guest} />
        </Fragment>
	);
}

export default AiringContent;
