import styled, { css } from 'styled-components';

const Anchor = styled.div`
    display: none;
    position: fixed;
    bottom: 50px;
    right: 30px;
    cursor: pointer;
    text-shadow: 0 0 8px #000;
    z-index: 1000;
    & i {
        color: #FFF05A;
        font-size: 50px;
    }
    & i:hover {
        color: #fff;
    }
    &.active {
        display: block;
    }
    @media (max-width: 801px) {
        bottom: 20px;
        right: 10px;
        & i {
            font-size: 40px;
        }
    }
`;

const SpacingElement = styled.div`
    margin-top: 100px;
    @media (max-width: 801px) {
        margin-top: 50px;
    }
    @media (min-width: 768px) and (max-width: 801px) {
        padding-top: 5px;
      }
    ${props => props.unwrapped && css`
        margin-top: 150px;
        @media (max-width: 801px) {
            margin-top: 100px;
        }
    `}
    ${props => props.footer && css`
        padding-top: 50px;
        margin-top : 0;
        @media (max-width: 801px) {
            padding-top: 0px;
        }
    `}
`;

const Header = styled.header`
    position: fixed;
    background: #0b132b;
    top: 0;
    width: 100%;
    left: 50%;
    transform: translate(-50%, 0);
    border-bottom: 2px solid #FFF05A;
    &.active {
        background: #13192d;
        z-index: 100;
    }
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;
    width: 80%;
    margin: 0 auto; 
    & ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
    }
    & ul li{
        display: block;
        padding: 0 1rem;
    }
    & a {
        padding: 0rem 1rem;
        color: #FFF05A;
        text-decoration: none;
        font-size: 20px;
    }
    & ul li:hover a, button:hover {
        color: white;
        cursor: pointer;
    }
    @media (max-width: 800px) {
        .desktop {
            display: none;
        }
        padding: 5% 0;
    }
`;

const SideNav = styled.nav`
    background: #181818;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    width: 70%;
    max-width:400px;
    z-index: 200;
    transform: translateX(-100%);
    transition: transform 0.3s ease-out;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    & ul li {
        padding: 1rem;
        margin: 0 auto;
        text-align:center;  
        font-size: 18px;
    }
    & span {
        color: #FFF05A;
        cursor: pointer;
    }
    &.open{
        transform: translateX(0);
    }
    @media (min-width: 801px) {
        display: none;
    }
`;

const Space = styled.div`
    flex: 1;
`;

const ProfileWrapper = styled.div`
    position: relative;
    &:hover .dropdown {
        display: block;
    }
`;

const ProfileOption = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem;
    & img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
    }
    & i {
        margin-left: 10px;
        color: #FFF05A;
        font-size: 25px;
    }
    &:hover i {
        color: white !important;
    }
`;

const ProfileDropdown = styled.div`
    display: none;
    position: absolute;
    background-color: #FFF05A;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    width: 100%;
    & div {
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: start;
        color: #000;
        cursor: pointer;
    }
    & a, span {
        font-size: 18px;
        color: #000;
        padding: 0;
        width: 100%;
        text-align: center;
    }
    & div:hover a, div:hover span, div:hover i {
        color: #fff;
        text-shadow: 0 0 8px #000;
    }
`;

export {
    Anchor,
    SpacingElement,
    Header, 
    Nav, 
    SideNav, 
    Space, 
    ProfileWrapper, 
    ProfileOption, 
    ProfileDropdown
}