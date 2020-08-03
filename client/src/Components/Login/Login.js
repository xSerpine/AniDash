import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { LoginIMG, LoginWrapper, WrapperInfo } from '../Styled Components/login';
import { Form, InputWrapper } from '../Styled Components/form';
import { Btn } from '../Styled Components/btn';
import { Titulo } from '../Styled Components/text';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function LoginUser({setAuth, setUser}) {
    const [inputs, setInputs] = useState({
        user: "",
        password: ""
    });

    const { user, password } = inputs;
    
    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
    
    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { user, password };
            const response = await fetch(APIUrl + "/autenticar/login",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const parseRes = await response.json();
    
            if (parseRes.jwtToken) {
                toast.success(`Welcome to AniDash, ${parseRes.info.username}!`, { position: "bottom-right" });
                localStorage.setItem("jwtToken", parseRes.jwtToken);
                setUser(
                    parseRes.info.username, 
                    parseRes.info.email, 
                    parseRes.info.avatar, 
                    parseRes.info.postsperpagehome,
                    parseRes.info.postsperpageanimemanga,
                    parseRes.info.postsperpagedetails,
                    parseRes.info.postsperpageprofile
                );
                setAuth(true);
            } else {
                toast.error(parseRes, { position: "bottom-right" });
                setAuth(false);
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <LoginIMG>
            <LoginWrapper>
                <Titulo>AniDash</Titulo>
                <Form onSubmit={onSubmitForm}>
                    <InputWrapper>
                        <input type="text" id="user" name="user" placeholder="Email or Username" value={user} onChange={e => onChange(e)} />
                        <label htmlFor="user">Email or Username</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={e => onChange(e)} />  
                        <label htmlFor="password">Password</label>
                    </InputWrapper>
                    <WrapperInfo>
                        <Btn primary type="submit">Login</Btn> 
                        <p>Don't have an account yet? <Link to="/register">Sign Up!</Link></p>
                    </WrapperInfo>
                </Form>
            </LoginWrapper>
        </LoginIMG>
    );
}

export default LoginUser;