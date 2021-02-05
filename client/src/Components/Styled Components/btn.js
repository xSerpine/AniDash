import styled, { css } from 'styled-components';

const Btn = styled.button`
    background: transparent;
    border: 2px solid #FFF05A;
    color: #FFF05A;
    padding: 0.5em 1em;
    margin-top: 5%;
    cursor: pointer;
    ${props => props.primary && css`
        background: #0b132b;
        color: #FFF05A;
        border: 2px solid #FFF05A;
        font-size: 20px;
        @media (max-width: 768px) {
            margin: 0 auto;
            height: auto;
            margin-top: 10px;
        }
    `}
    ${props => props.secondary && css`
        background: #0b132b;
        color: white;
        border: 2px solid white;
        font-size: 25px;
        margin: 0 auto;
        width: 100%;
        @media (max-width: 768px) {
            margin: 0 auto;
            height: auto;
            margin-top: 10px;
        }
    `}
    &:hover{
        background: #1f2833;
        border: 2px solid #1f2833;
        color: white;
        ${props => props.primary && css`
            border: 2px solid white !important;
        `}
    }
`;

const ToggleBtn = styled.button`
    outline: none;
    background: transparent;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border:none;
    padding: 0; 
    box-sizing: border-box;
    width: 30px;
    height: 24px;
    @media (min-width: 801px) {
        display: none;
    }
`;

export {
    Btn, ToggleBtn
}