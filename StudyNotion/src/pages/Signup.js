import React, { useState } from 'react';
import signupStudent from '../assets/Images/signup.webp';
import signupInstructor from '../assets/Images/signlogInstructor.jpeg';
import frame from "../assets/Images/frame.png";
import { CTAButton } from '../components/core/HomePage/CTAButton';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";


const student = {
    heading : "Join the millions learning to code with StudyNotion for free",
    subHeading : "Build skills for today, tomorrow, and beyond.",
    subHeadingPortion : "Education to future-proof your career."
}

const instructor = {
  heading : "Welcome Back",
  subHeading : "Discover your passions,",
  subHeadingPortion : "Be Unstoppable",
}

export const Signup = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [isCnfVisible, setIsCnfVisible] = useState(false);
  const [formData, setFormData] = useState({
    accountType : "Student",
    fName : "",
    lName : "",
    email : "",
    phone : "",
    password : "jl;adk",
    cnfPassword : "j;j;l"
  }) 

  return (<div className='bg-richblack-900 min-h-screen flex'>
    <form className='w-[508px] h-[804px] border border-caribbeangreen-100'>
      <div>
        <label>
          <p className='text-richblack-5'>First Name</p>
          <input
            required
            type='text'
            className='placeholder:text-richblack-200'
            value={formData.fName}
            placeholder='Enter first name'
            name='fName'
            id='firstName'
            // onChange={}
          />
        </label>
        <label>
          <p className='text-richblack-5'>Last Name</p>
          <input
            required
            type='text'
            className='placeholder:text-richblack-200'
            value={formData.lName}
            placeholder='Enter last name'
            name='lName'
            id='lastName'
            // onChange={}
          />
        </label>
      </div>

      <label>
        <p className='text-richblack-5'>Email Address</p>
        <input
          required
          type='email'
          className='placeholder:text-richblack-200'
          value={formData.email}
          placeholder='Enter email address'
          name='email'
          id='mail'
          // onChange={}
        />
      </label>

      <br/>
      <label htmlFor='number' className='text-richblack-5'>Phone Number</label>
      <div>
        <input/>
        <input 
          required
          type='Number'
          className='placeholder:text-richblack-200'
          id='number'
          value={formData.phone}
          placeholder='12345 67890'
          name='phone'
          // onChange={}
        />
      </div>

      <div>
        <label>
          <p className='text-richblack-5'>Create Password</p>
          <input 
            required
            type={`${isVisible ? "text" : "password" }`}
            className='placeholder:text-richblack-200'
            placeholder='Enter Password'
            value={formData.password}
            name='password'
            id='pwd'
            // onChange={}
          />
          <span onClick={() => (setIsVisible(!isVisible))}>
            {
              isVisible ? <FaEyeSlash className='bg-white'/> : <FaEye className='bg-white'/>
            }
          </span>
        </label>
        <label>
          <p className='text-richblack-5'>Confirm Password</p>
          <input
            required
            className='placeholder:text-richblack-200'
            placeholder='Enter Password'
            type={`${isCnfVisible ? "text" : "password"}`}
            name='cnfPassword'
            id='cnfPwd'
            value={formData.cnfPassword}
            // onChange={}
          />
          <span onClick={() => (setIsCnfVisible(!isCnfVisible))}>
            {
              isCnfVisible ? <FaEyeSlash className='bg-white'/> : <FaEye className='bg-white'/>
            }
          </span>
        </label>
      </div>

      <CTAButton active={true}>
        Create Account
      </CTAButton>
    </form>
    <div className='text-black relative'>
      <img src={`${formData.accountType === "Student" ? signupStudent : signupInstructor}`} alt=''/>
      <img src={frame} className='absolute' alt=''/>
    </div>
  </div>)
}
