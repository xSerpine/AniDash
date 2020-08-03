import styled from 'styled-components';

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

export {
    Form, InputWrapper
}