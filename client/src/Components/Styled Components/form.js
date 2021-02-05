import styled, { css } from 'styled-components';

const FullPageWrapper = styled.div`
    width: 100%;
    height: 100vh;
    ${props => props.auth && css`
        background-image: url(/imagens/yourname.webp);
    `}
    ${props => props.other && css`
        background-image: url(/imagens/yourlieinapril.webp);
    `}
    background-position: bottom;
    background-repeat: no-repeat;
    background-size: cover;
`;

const FormWrapper = styled.div`
    width: 40%;
    padding: 2rem;
    background-color: #0b132b;
    color: white;
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    box-shadow: 20px 20px 50px #000;
    opacity: 0.9;
    border-radius: 5px;
    @media (max-width: 768px) {
        width: 100%;
        padding: 15%;
    }
`;

const Form = styled.form`
    width: 80%;
    margin: 0 auto;
`;

const InputWrapper = styled.div`
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 100%;
    & input {
        width: 100%;
        border: 0;
        border-bottom: 2px solid white;
        outline: 0;
        font-size: 1.3rem;
        color: white;
        padding: 7px 0;
        background: transparent;
        transition: border-color 0.2s;
        
        &::placeholder {
            color: transparent;
        }

        &:placeholder-shown ~ label {
            font-size: 1.3rem;
            cursor: text;
            top: 20px;
        }

        ~ label {
            position: absolute;
            top: 0;
            display: block;
            transition: 0.2s;
            font-size: 1rem;
            color: white;
        }
    }
    & label {
        position: absolute;
        bottom: 10%;
        display: block;
        transition: 0.2s;
        font-size: 20px;
        color: #FFF05A;
    }
    & input:focus {
        border-color: #FFF05A;
        padding-bottom: 6px;  
        font-weight: 700;
        border-width: 3px;
        ~ label {
            position: absolute;
            top: 0;
            display: block;
            transition: 0.2s;
            font-size: 1rem;
            color: #FFF05A;
        }
    }
    & textarea {
        min-width: 100%;
        max-width: 100%;
        width: 100%;
        min-height: 1.6rem;
        border: 0;
        outline: 0;
        font-size: 1.3rem;
        color: white;
        padding: 7px 0;
        background: transparent;
        border-bottom: 2px solid white;
        font-family: PT Sans Narrow; 
        &::placeholder {
            font-family: PT Sans Narrow; 
        }
    }
`;

const InfoWrapper = styled.div`
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    justify-items: center;
    & .actions {
        margin: 5px;
        text-align: center;
    }
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

export {
    FullPageWrapper,
    FormWrapper,
    Form, 
    InputWrapper,
    InfoWrapper,
    IMGPreview
}