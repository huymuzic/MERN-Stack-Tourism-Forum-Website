//modules
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './index.css'


//context
import { useUser } from '../../utils/UserContext';
const baseURL = import.meta.env.VITE_BASE_URL;

function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, dirtyFields, isSubmitting }, setError } = useForm({ mode: 'onChange' });
    const [showPassword, setShowPassword] = useState(false);
    const { user, setUser } = useUser();

    const [successMsg, setSuccessMsg] = useState(false);
    const [errorMsg, setErrorMsg] = useState(false);
    const [callAPI, setCallAPI] = useState(false);

    const togglePasswordVisibility = (e) => {
        setShowPassword(!showPassword);
    };

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${baseURL}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseBody = await response.json();
        if (!response.ok) {
                setError('pwd', { type: 'server', message: responseBody.message });
                if(!callAPI) {
                    pushError('Something went wrong. Please try again')
                    setCallAPI(true); 
                }   
            } else {
                localStorage.setItem('accessToken', responseBody.token); 
                setUser(responseBody.data._id);
                navigate('/');
                window.location.reload();
                if(!successMsg) {
                    pushSuccess(`Login successfully!`)
                    setSuccessMsg(true);
                }
            }

        } catch (error) {
            console.error('Error:', error);
            if(!errorMsg) {
                pushError('Failed to login. Please try again')
                setErrorMsg(true);
            }
        }
    }


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className='col-sm-6 col-lg-4 col-xl-3 mx-auto mt-5 mb-5 d-flex align-items-center flex-column rounded-4 shadow'>
                <strong className='mt-4 mb-4'><h3>Welcome back!</h3></strong>

                <div className="mb-3 col-8">
                    <label htmlFor="emailInput" className="form-label">Email address</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}${dirtyFields.email && !errors.email ? 'is-valid' : ''}`}
                        id="emailInput"
                        aria-describedby="emailInput"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email cannot be empty.",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: 'Email address must be valid.'
                            }
                        })}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>

                <div className="mb-1 col-8">
                    <label htmlFor="pwdInput" className="form-label">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control ${errors.pwd ? 'is-invalid' : ''}${dirtyFields.pwd && !errors.pwd ? 'is-valid' : ''}`}
                        id="pwdInput"
                        placeholder="Enter your password"
                        aria-describedby='pwdInput'
                        {...register("pwd", {
                            required: "Password cannot be empty.",
                        })}
                    />
                    <div className='position-relative'>
                        <FontAwesomeIcon className='eye-icon' icon={showPassword ? faEye : faEyeSlash} onClick={togglePasswordVisibility} />
                    </div>
                    {errors.pwd && <div className="invalid-feedback">{errors.pwd.message}</div>}
                </div>

                <a className="mb-3 text-end col-8" href='/resetPass'>Forgot password?</a>

                <div className="mb-3 form-check col-8">
                    <input type="checkbox" className="form-check-input" id="remember"
                     {...register("rem")} 
                    defaultChecked={false}></input>
                    <label
                        className="form-check-label"
                        htmlFor="remember"
                    >Remember me
                    </label>
                </div>

                <p>Don't have an account? <Link to='/register'>Register</Link></p>

                <button type="submit" disabled={isSubmitting} className="mb-5 btn btn-primary col-8">Submit</button>
            </form>
        </>


    );
}

export default Login