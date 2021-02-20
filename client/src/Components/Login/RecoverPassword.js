import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API } from '../../Hooks/API';
import { Btn } from '../Styled Components/btn';
import { Form, FormWrapper, FullPageWrapper, InfoWrapper, InputWrapper } from '../Styled Components/form';
import { Titulo } from '../Styled Components/text';

const APIUrl = process.env.REACT_APP_API_URL;

toast.configure();

const RecoverPassword = () => {
    document.title = 'Recover Password • AniDash';

    const [recovered, setRecovered] = useState(false);
    const [inputs, setInputs] = useState({
        password: '',
        Cpassword: ''
    });

    const { token } = useParams();
    const { password, Cpassword } = inputs;

    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }

    const onSubmitForm = async e => {
        e.preventDefault();

        if(password !== Cpassword) return toast.error('Passwords do not match.', { position: 'bottom-right' });

        const body = {
            token: token,
            password: password
        }

        const { status, statusMessage } = API('PUT', `${APIUrl}/users/recover`, null, body);

        if (status === 200) {
            toast.success('Password has been updated! You can now login.', { position: 'bottom-right' });
            setInputs({
                password: '',
                Cpassword: ''
            });
            setRecovered(true);
        } else {
            toast.error(statusMessage, { position: 'bottom-right' });
        }
    }

    return (
        <FullPageWrapper other>
            <FormWrapper>
                <Titulo>{!recovered ? 'Update your password!' : 'Password updated!'}</Titulo>
                {!recovered ?
                    <Form onSubmit={onSubmitForm}>
                        <InputWrapper>
                            <input type='password' id='password' name='password' placeholder='Password' value={password} onChange={e => onChange(e)} />  
                            <label htmlFor='password'>Password</label>
                        </InputWrapper>
                        <InputWrapper>
                            <input type='password' id='Cpassword' name='Cpassword' placeholder='Confirm Password' value={Cpassword} onChange={e => onChange(e)} />  
                            <label htmlFor='Cpassword'>Confirm Password</label>
                        </InputWrapper>
                        <InfoWrapper>
                            <Btn primary type='submit'>Update password</Btn> 
                            <p className='actions' style={{marginTop: '20px'}}>Go back to <Link to='/'>login</Link></p>
                        </InfoWrapper>
                    </Form>
                    :
                    <InfoWrapper> 
                        <p className='actions' style={{marginTop: '20px'}}>Go back to <Link to='/'>login</Link></p>
                    </InfoWrapper>
                }
            </FormWrapper>
        </FullPageWrapper>
    );
}

export default RecoverPassword;