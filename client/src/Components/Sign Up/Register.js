import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useHistory } from 'react-router-dom';
import { LoginIMG, LoginWrapper, WrapperInfo, IMGPreview } from '../Styled Components/login';
import { Titulo } from '../Styled Components/text';
import { Form, InputWrapper } from '../Styled Components/form';
import { Btn } from '../Styled Components/btn';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

function RegisterUser() {
    const [avatar, setAvatar] = useState("");
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        Cpassword: ""
    });

    const { username, email, password, Cpassword } = inputs;

    const history = useHistory();
    
    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const handleFile = async e => {
        const file = e.target.files[0];
       
        previewFile(file);
    }

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setAvatar(reader.result)
        }
    }
    
    const onSubmitForm = async e => {
        e.preventDefault();

        if(password !== Cpassword) return toast.error("Passwords do not match.", { position: "bottom-right" });

        try {
            const body = { username, email, password, avatar };
            const response = await fetch(APIUrl + "/users",
                {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const parseRes = await response.json();

            if(parseRes === "OK") {
                history.push("/");
                history.go();
            }
            else {
                toast.error(parseRes, { position: "bottom-right" });
            }
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <LoginIMG>
            <LoginWrapper>
                <Titulo>AniDash</Titulo>
                {avatar && <IMGPreview><img src={avatar} alt="User Avatar" /></IMGPreview>}
                <Form onSubmit={onSubmitForm}>
                    <InputWrapper>
                        <input type="file" id="file" name="avatar" placeholder="Choose an avatar" onChange={handleFile} />  
                        <label htmlFor="file">Choose an avatar</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={e => onChange(e)} />
                        <label htmlFor="username">Username</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type="email" id="email" name="email" placeholder="Email" value={email} onChange={e => onChange(e)} />
                        <label htmlFor="email">Email</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type="password" id="password" name="password" placeholder="Password" value={password} onChange={e => onChange(e)} />  
                        <label htmlFor="password">Password</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type="password" id="Cpassword" name="Cpassword" placeholder="Confirm Password" value={Cpassword} onChange={e => onChange(e)} />  
                        <label htmlFor="Cpassword">Confirm Password</label>
                    </InputWrapper>
                    <WrapperInfo>
                        <Btn primary type="submit">Register</Btn> 
                        <p>Already have an account? <Link to="/">Login!</Link></p>
                    </WrapperInfo>
                </Form>
            </LoginWrapper>
        </LoginIMG>
    );
}

export default RegisterUser;