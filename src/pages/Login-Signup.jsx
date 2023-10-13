import React, { useEffect } from 'react';
import { HiX } from 'react-icons/hi';

import { useGlobalContext } from '../context/SidebarContext';
import InviteContext from '../context/InviteContext';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'

import { useRegisterMutation } from '../slices/usersApiSlice';
import { useLoginMutation } from '../slices/usersApiSlice';
// import { useLogoutMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
// import { logout } from '../slices/authSlice';

import axios from 'axios';
const Login_Signup = () => {
	const { isSidebarOpen, isSignupOpen, isLogout, openLogout, closeSidebar, openSignup, openSidebar, } = useGlobalContext();

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [register, { isLoading }] = useRegisterMutation();
	const [login, { isLoadings}] = useLoginMutation();
	// const [logout, {isLoad}] = useLogoutMutation();

	const { userInfo } = useSelector((state) => state.auth);

	const [myemail, setMyemail] = useState(localStorage.getItem("myapp-email") || "");
	const [mypassword, setMypassword] = useState(localStorage.getItem("myapp-password") || "");
	const [mynote, setMynote] = useState('');
	const [rememberMe, setRememberMe] = useState(localStorage.getItem("myapp-email")&&localStorage.getItem("myapp-password"));

	const {invId} = useContext(InviteContext);
	const [note, setNote] = useState('');
	const [passnote, setPassNote] = useState('');
	const [email, setEmail] = useState('');
	const [code, setCode] = useState('');
	const [password, setPassword] = useState('');
	const [confirm_password, setPassConfirm] = useState('');
	const [referal_link, setReferalLink] = useState(invId || "");

	const [isForgotPassword, setForgot] = useState(false);
	const [forgot_note, setForgotNote] = useState('');
	const [forgot_passnote, setForgotPassNote] = useState('');
	const [forgot_email, setForgotEmail] = useState('');
	const [forgot_code, setForgotCode] = useState('');
	const [forgot_password, setForgotPassword] = useState('');
	const [forgot_confirm_password, setForgotPassConfirm] = useState('');

	useEffect(() => {
		if (userInfo) {
		  navigate('/');
		}
	  }, [navigate, userInfo]);

	  
	useEffect(() => {
		if (isSidebarOpen) {
		  setForgot(false);
		  setEmail('');
		  setPassword('');
		  setPassConfirm('');
		  setReferalLink('');
		  setCode('');
		  setNote('');
		  setMyemail('');
		  setMypassword('');
		}
	  }, [isSidebarOpen]);

	  useEffect(() => {
		if (isSignupOpen) {
		  setForgot(false);
		  setEmail('');
		  setPassword('');
		  setPassConfirm('');
		  setReferalLink('');
		  setCode('');
		  setNote('');
		  setMyemail('');
		  setMypassword('');
		}
	  }, [isSignupOpen]);
	
	const remember = () => {
		if(rememberMe){
			localStorage.setItem("myapp-email", myemail); localStorage.setItem("myapp-password", mypassword)
		}
		else{
			localStorage.setItem("myapp-email", ""); localStorage.setItem("myapp-password", "")
		}
	}

	const handleCheckboxChange = (event) => {
		setRememberMe(event.target.checked);
	};

	const handleLoginClick = async (e) =>{
		e.preventDefault();
		if(!validateEmail(myemail)) {
			setMynote('Invalid Email');
			return;
		} else setMynote('');
		console.log('Email : ' + myemail + ', Password : '+mypassword);

		try {
			
			const email = myemail;
			const password = mypassword;
			const res = await login({ email, password }).unwrap();
			dispatch(setCredentials({ ...res }));
			navigate('/');
			toast('Logged in successfully!', {autoClose: 3000, theme: "dark",});
			remember();
			closeSidebar();
		  } catch (err) {
			toast.error(err?.data?.message || err.error, {autoClose: 3000, theme: "dark",});
		  }
	}

	const handleSendCodeClick = () => {
		if(validateEmail(email)) {

			axios
			.post("/api/users/mail", {email})
			.then( res => {
				setNote(`Sent verification code to ${email}`);
			})
			.catch(err => {
				toast(err.response.data.message, {autoClose: 3000, theme: "dark",});
			});

		} else {
			setNote('Invalid email');
		}
	}

	const handleCodeChange = (e) => {
		const code = e.target.value;
		const numbersOnly = code.replace(/[^0-9]/g, "");
		if(numbersOnly.length<=6){
			setCode(numbersOnly);      
		}
	}

	const handleSignupClick = async (event) => {
		event.preventDefault();

		if(!validatePassword(password)) {
			setPassNote('Requires number, characters, and special characters.')
			return;
		} else setPassNote('');
		
		if((code=='')) {
			setNote('Requires Verify Email with sending code.');
			return;
		}
 		if((password!=confirm_password)) { 
			setPassNote('Do not match password!');
			return;
		}

		try {
			const res = await register({ email, code, password, referal_link }).unwrap();
			dispatch(setCredentials({ ...res }));
			navigate('/');
			toast('User registered successfully!', {autoClose: 3000, theme: "dark",});
			openSidebar();
		} catch (err) {
			toast.error(err?.data?.message || err.error, {autoClose: 3000, theme: "dark",});
			// setNote('');
		}

		console.log('Email : '+ email + ', Verification Code : '+ code +', Password : '+ password +', Confirm Password : '+confirm_password+', Referal LinkL : '+referal_link);
	}
	  
	const handleForgotSendCodeClick = () => {
		if(validateEmail(forgot_email)) setForgotNote(`Sent reset password code to ${forgot_email}`);
		else {
			setForgotNote('Invalid email');
		}
	}

	const handleForgotCodeChange = (e) => {
		const code = e.target.value;
		const numbersOnly = code.replace(/[^0-9]/g, "");
		if(numbersOnly.length<=6){
			setForgotCode(numbersOnly);      
		}
	}


	const handleUpdatePasswordClick = (event) => {
		event.preventDefault();
		if(forgot_code=='') {
			setForgotNote('Send reset password code.');
			return;
		}

		if(!validatePassword(forgot_password)) {
			setForgotPassNote('Requires number, characters, and special characters.')
			return;
		} else setForgotPassNote('');


 		if((forgot_password!=forgot_confirm_password)) {
			setForgotPassNote('Do not match password!');
			return;
		}

		console.log('Forgot Email : '+forgot_email+', Reset Code : '+forgot_code+', New Password : '+forgot_password+', Confirm Password : '+confirm_password);
	}

	const validatePassword = (password) => {
	// Check if the password is empty
	if (!password) {
		return false;
	}
	
	// Check if the password is at least 8 characters long
	if (password.length < 8) {
		return false;
	}
	
	// Check if the password contains at least one uppercase letter
	// if (!/[A-Z]/.test(password)) {
	// 	return false;
	// }
	
	// Check if the password contains at least one lowercase letter
	if (!/[a-z]/.test(password)) {
		return false;
	}
	
	// Check if the password contains at least one number
	if (!/[0-9]/.test(password)) {
		return false;
	}

	if (!/[!@#$%^&*]/.test(password)) {
		return false;
	}
	
	return true;
	};

	const validateEmail = (email) => {
		// Check if the email is empty
		if (!email) {
		  return false;
		}
	  
		// Check if the email is valid
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
  	};

	return (
		<div className='flex'>
			<div
				className={`transition-all duration-500 fixed top-44 ${
					isSidebarOpen|isSignupOpen ? '' : 'hidden'
				} left-1/2 transform -translate-x-1/2 z-10`}
			>
					
					<div className='flex justify-center'>
						<div className='w-[400px] mx-auto bg-gray-900 p-8 rounded-3xl '>
							<a
								onClick={closeSidebar}
								className="absolute top-2 right-2 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center active:bg-gray-300 focus:outline-none ml-6 hover:bg-gray-200 hover:text-gray-800"
							>
								<HiX className="w-5 h-5" />
							</a>
							
							<form className={` ${isSidebarOpen&&!isForgotPassword? '' : 'hidden'}`} onSubmit={handleLoginClick}>
								<h2 className='text-4xl dark:text-white font-bold text-center'>LOG IN</h2>
								<div className='flex flex-col text-gray-400 py-2'>
									<label>Email</label>
									<input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={myemail} onChange={(e) => { setMyemail(e.target.value); setMynote('');}} type="text" required/>
								</div>
								{mynote && <div className=' text-red-300 text-sm'>{mynote}</div>}
								<div className='flex flex-col text-gray-400 py-2'>
									<label>Password</label>
									<input className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={mypassword} onChange={(e) => setMypassword(e.target.value)} type="password" required/>
								</div>
								<div className='flex justify-between text-gray-400 py-2'>
									<p className='flex items-center'><input className='mr-2' type="checkbox" checked={rememberMe} onChange={handleCheckboxChange} /> Remember Me</p>
									<a className='hover:text-white cursor-pointer' onClick={()=>setForgot(true)}>Forgot Password</a>
								</div>
								<button className='py-2 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none mt-6 w-full hover:shadow-sm hover:shadow-white active:translate-y-1'>Log In</button>
								<div className='flex justify-between text-gray-400 py-2 mt-4'>
									<p className='flex items-center'> If you don't have account</p>
									<a className='hover:text-white cursor-pointer' onClick={openSignup}>Sign Up</a>
								</div>
							</form>

							<form className={` ${isSignupOpen? '' : 'hidden'}`} onSubmit={handleSignupClick}>
								<h2 className='text-4xl dark:text-white font-bold text-center'>SIGN UP</h2>
								<div className='flex flex-col text-gray-400 py-2'>
									<label>Email</label>
									<div className='grid grid-cols-6'>
										<input className='rounded-lg col-span-5 bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={email} onChange={(e) => {setEmail(e.target.value); setNote(''); setCode('');}} type="text" required/>
										<a className='ml-2 cursor-pointer hover:text-white' onClick={handleSendCodeClick}>send code</a>
									</div>
									{(note.includes('Invalid email')) && <div className=' text-red-300 text-sm'>{note}</div>}
									{(note.includes('Sent verification code to')) && <div className=' text-white text-sm'>{note}</div>}
									{(note.includes('Requires Verify Email with sending code.')) && <div className=' text-red-300 text-sm'>{note}</div>}
								</div>

								{(validateEmail(email)&&note&&note.includes('Sent verification code to')) &&
								<div className='flex flex-col text-gray-400 py-2'>
									<label>Verification Code</label>
									<input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={code} onChange={handleCodeChange} type="text" required/>
								</div>
								}
								<div className='flex flex-col text-gray-400 py-2'>
									<label>Password</label>
									<input className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required/>
								</div>
								{password && <div className=' text-red-300 text-sm'>{passnote}</div>}
								<div className='flex flex-col text-gray-400 py-2'>
									<label>Confirm Password</label>
									<input className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={confirm_password} onChange={(e)=>setPassConfirm(e.target.value)} type="password" required/>
								</div>
								<div className='flex flex-col text-gray-400 py-2'>
									<label>Referral Code (Optional)</label>
									<input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={referal_link} onChange={(e)=>setReferalLink(e.target.value)} type="text" />
								</div>
								<button className='py-2 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none mt-6 w-full hover:shadow-sm hover:shadow-white active:translate-y-1'>Sign Up</button>
								<div className='flex justify-between text-gray-400 py-2 mt-4'>
									<p className='flex items-center'> If you already have account</p>
									<a className='hover:text-white cursor-pointer' onClick={openSidebar}>Log In</a>
								</div>
							</form>

							<form className={` ${isForgotPassword&&isSidebarOpen? '' : 'hidden'}`} onSubmit={handleUpdatePasswordClick}>
								<h2 className='text-4xl dark:text-white font-bold text-center'>Forgot Password</h2>
								<div className='flex flex-col text-gray-400 py-2 mt-4'>
									<label>Your Email</label>
									<div className='grid grid-cols-6'>
										<input className='rounded-lg col-span-5 bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={forgot_email} onChange={(e)=>{setForgotEmail(e.target.value);setForgotNote('');setForgotCode('');}} type="text" required/>
										<a className='ml-2 cursor-pointer hover:text-white' onClick={handleForgotSendCodeClick}>Send code</a>
									</div>
									{(forgot_note.includes('Invalid')) && <div className=' text-red-300 text-md'>{forgot_note}</div>}
									{(forgot_note.includes('Sent reset password code to')) && <div className=' text-white text-sm'>{forgot_note}</div>}
									{(forgot_note.includes('Send reset password code.')) && <div className=' text-red-300 text-sm'>{forgot_note}</div>}
								</div>

								{(validateEmail(forgot_email)&&forgot_note) &&
								<div className='flex flex-col text-gray-400 py-2'>
									<label>Verification Code</label>
									<input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={forgot_code} onChange={handleForgotCodeChange} type="text" required/>
								</div>
								}
								<div className='flex flex-col text-gray-400 py-2'>
									<label>New Password</label>
									<input className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={forgot_password} onChange={(e)=>setForgotPassword(e.target.value)} type="password" required/>
								</div>
								{forgot_password && <div className=' text-red-300 text-sm'>{forgot_passnote}</div>}
								<div className='flex flex-col text-gray-400 py-2'>
									<label>Confirm Password</label>
									<input className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' value={forgot_confirm_password} onChange={(e)=>setForgotPassConfirm(e.target.value)} type="password" required/>
								</div>
								<button className='py-2 px-6 font-poppins font-medium text-[18px] text-primary bg-blue-gradient rounded-[10px] outline-none mt-6 w-full hover:shadow-sm hover:shadow-white active:translate-y-1'>Reset Password</button>
								<div className='flex justify-between text-gray-400 py-2 mt-4 '>
									<a className='hover:text-white cursor-pointer mr-2 ml-auto' onClick={() => setForgot(false)}>Log In</a>
								</div>
							</form>
						</div>
					</div>
			</div>
		
		</div>

	);
};

export default Login_Signup;
