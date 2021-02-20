import React from 'react';
import { ToggleBtn } from '../Styled Components/btn';

const ToggleButton = ({ handleToggle }) => {
    return (
        <ToggleBtn onClick={handleToggle}>
            <div style={{width: '30px', height: '2px', backgroundColor: 'white'}} />
            <div style={{width: '30px', height: '2px', backgroundColor: 'white'}} />
            <div style={{width: '30px', height: '2px', backgroundColor: 'white'}} />
        </ToggleBtn>
    );
}

export default ToggleButton;