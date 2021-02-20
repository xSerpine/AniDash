import React, { Fragment } from 'react';
import { SpacingElement } from '../Styled Components/navbar';
import { Footer } from '../Styled Components/text';

const GenericFooter = () => {
    return (
        <Fragment>
            <SpacingElement footer />
			<Footer>
				Made by	<a target='_blank' rel='noopener noreferrer' href='https://github.com/xSerpine'>Luís Ferro.</a>
			</Footer>
        </Fragment>
    );
}

export default GenericFooter;