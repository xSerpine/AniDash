import styled from 'styled-components';

const Header = styled.header`
    top: 0;
    left: 0;
    width: 80%;
    margin: 0 auto;   
`;

const Nav = styled.nav`
    display: flex;
    align-items: center;
    & ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
    }
    & ul li{
        display: block;
        padding: 1.5rem;
    }
    & a {
        padding: 0.5rem 1rem;
        color: #FFF05A;
        text-decoration: none;
        font-size: 20px;
    }
    & ul li:hover a, button:hover {
        color: white;
        cursor: pointer;
    }
    @media (max-width: 768px) {
        .desktop {
            display: none;
        }
        margin-top: 5%;
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
    & ul {
        height: 80%;
        width: inherit;
        list-style: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    & ul li {
        padding: 1rem;
        width: inherit;
        margin: 0 auto;
        text-align:center;  
        font-size: 18px !important;
    }
    &.open{
        transform: translateX(0);
    }
    @media (min-width: 769px) {
        display: none;
    }
`;

const Space = styled.div`
    flex: 1;
`;

const ProfileWrapper = styled.div`
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
    width: inherit;
    padding: 0 1rem;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    & a, button {
        float: none;
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        text-align: left;
    }
    & a:hover, button:hover {
        color: #fff !important;
        text-shadow: 1px 1px #000;
    }
`;

export {
    Header, Nav, SideNav, Space, ProfileWrapper, ProfileOption, ProfileDropdown
}