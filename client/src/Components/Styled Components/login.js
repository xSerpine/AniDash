import styled from 'styled-components';

const LoginIMG = styled.div`
    height: 100vh;
    background-image: url("https://images.unsplash.com/photo-1583200786218-ccee132a8567?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1189&q=80");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;

const LoginWrapper = styled.div`
    width: 40%;
    padding: 5%;
    background-color: #0b132b;
    color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    opacity: 90%;
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const WrapperInfo = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    justify-items: center;
`;

const IMGPreview = styled.div`
    width: 100%;
    text-align: center;
    & img {
        height: 150px;
        width: 150px;
        border-radius: 50%;
    }
`;

const Logout = styled.button`
    color: #FFF05A;
    font-size: 20px;
    font-family: PT Sans Narrow; 
    outline: none;
    background: transparent;
    border:none;
    padding: 0; 
`;

export {
    LoginIMG, LoginWrapper, WrapperInfo, Logout, IMGPreview
}