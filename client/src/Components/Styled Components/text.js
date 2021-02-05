import styled, { css } from 'styled-components';

const Titulo = styled.h1`
    text-align: center;
    font-size: 40px;
    font-style: italic;
    font-weight: 800; 
    color: #FFF05A;
    & i {
        font-size: 30px;
        color: #ff0000;
        cursor: pointer;
    }
    ${props => props.primary && css`
        font-size: 18px;
    `}
`;

const SubTitulo = styled.h4`
    font-weight: 800; 
    color: white;
    width: 80%;
    margin: 0 auto;
    text-align: left;
    padding: 1rem;
    font-size: 20px;
    & span {
        text-transform: capitalize; 
    }
`;

const Footer = styled.footer`
    position: absolute;
    color: #fff;
    width:100%;
    text-align: center;       
    padding: 1rem 0rem;
    bottom: 0;
    @media (max-width: 768px) {
        display: none !important;
    }  
`;


export {
    Titulo, SubTitulo, Footer
}
