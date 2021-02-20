import React from 'react';

const BackDrop = ({ handleBackdrop }) => {
    return (
        <div onClick={handleBackdrop} style={{position: 'fixed', top: 0, left: 0, width:'100%', height: '100%', background:'rgba(0,0,0,0.3)', zIndex: '100'}} />
    );
}

export default BackDrop;