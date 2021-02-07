import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { Titulo } from '../Styled Components/text';
import { Form, FormWrapper, FullPageWrapper, IMGPreview, InfoWrapper, InputWrapper } from '../Styled Components/form';
import { Btn } from '../Styled Components/btn';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const RegisterUser = () => {
    document.title = 'Sign Up • AniDash';
    
    const [avatar, setAvatar] = useState('');
    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        password: '',
        Cpassword: ''
    });

    const { username, email, password, Cpassword } = inputs;
    
    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const handleFile = async e => {
        const file = e.target.files[0];
       
        previewFile(file);
    }

    const previewFile = file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setAvatar(reader.result)
        }
    }
    
    const onSubmitForm = async e => {
        e.preventDefault();

        if(password !== Cpassword) return toast.error('Passwords do not match.', { position: 'bottom-right' });

        try {
            const body = { username, email, password, avatar };
            const response = await fetch(`${APIUrl}/users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            if(response.status === 200) {
                toast.success('Account created! Please confirm your email.', { position: 'bottom-right' });
                setAvatar('');
                setInputs({
                    username: '',
                    email: '',
                    password: '',
                    Cpassword: ''
                });
            }
            else {
                toast.error(await response.text(), { position: 'bottom-right' });
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <FullPageWrapper auth>
            <FormWrapper>
                <Titulo>Ani<span style={{color: '#fff'}}>Dash</span></Titulo>
                {avatar && <IMGPreview><img src={avatar} alt='User Avatar' /></IMGPreview>}
                <Form onSubmit={onSubmitForm}>
                    <InputWrapper>
                        <input type='file' id='file' name='avatar' placeholder='Choose an avatar' accept='image/*' onChange={handleFile} />  
                        <label htmlFor='file'>Choose an avatar</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type='text' id='username' name='username' placeholder='Username' value={username} onChange={e => onChange(e)} />
                        <label htmlFor='username'>Username</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type='email' id='email' name='email' placeholder='Email' value={email} onChange={e => onChange(e)} />
                        <label htmlFor='email'>Email</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type='password' id='password' name='password' placeholder='Password' value={password} onChange={e => onChange(e)} />  
                        <label htmlFor='password'>Password</label>
                    </InputWrapper>
                    <InputWrapper>
                        <input type='password' id='Cpassword' name='Cpassword' placeholder='Confirm Password' value={Cpassword} onChange={e => onChange(e)} />  
                        <label htmlFor='Cpassword'>Confirm Password</label>
                    </InputWrapper>
                    <InfoWrapper>
                        <Btn primary type='submit'>Register</Btn> 
                        <p>Already have an account? <Link to='/'>Login!</Link></p>
                    </InfoWrapper>
                </Form>
            </FormWrapper>
        </FullPageWrapper>
    );
}

export default RegisterUser;