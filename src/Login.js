import React from 'react';
import axios from 'axios';

const Login = () => {
  const handleLogin = async () => {
    try {
      // Send a request to your backend's login route
      const authenticationUrl= 'https://unisync-api.onrender.com/login'
    
      // Handle the response, e.g., redirect to the authentication URL
      

      // Redirect the user to the authentication URL
      window.location.href = authenticationUrl;
    } catch (error) {
      console.error('Error during login:', error);
      // Handle error, show error message, etc.
    }
  };

  return (

      <div className="h-screen bg-[#232323]">
            <div className="fixed -top-56 -left-36 w-2/5 aspect-square rounded-full" style={{backgroundImage: 'conic-gradient(from 46.66deg,#89a3ff,#5a1dff,#89a3ff'}}>
            </div>
            <div className="fixed -bottom-48 -right-32 w-1/3 aspect-square rounded-full" style={{backgroundImage: 'conic-gradient(from -52.13deg,#89a3ff,#5a1dff,#89a3ff'}}>
            </div>
            <div className="fixed -bottom-40 -left-14 w-1/4 aspect-square rounded-full" style={{backgroundImage: 'conic-gradient(from 90deg,#89a3ff,#5a1dff,#89a3ff'}}>
            </div>
            <div className="fixed -top-40 right-32 w-1/4 aspect-square rounded-full" style={{backgroundImage: 'conic-gradient(from -90deg,#89a3ff,#5a1dff,#89a3ff'}}>
            </div>
            <div className="fixed top-20 -right-12 w-1/6 aspect-square rounded-full" style={{backgroundImage: 'conic-gradient(from 90deg,#89a3ff,#5a1dff,#89a3ff'}}>
            </div>
            <div className="fixed top-60 left-1/4 w-1/6 aspect-square rounded-full" style={{backgroundImage: 'conic-gradient(from 90deg,#89a3ff,#5a1dff,#89a3ff'}}>
            </div>
            <div className="fixed top-40 left-1/2 w-1/12 aspect-square rounded-full" style={{backgroundImage: 'conic-gradient(from 180deg,#89a3ff,#5a1dff,#89a3ff'}}>
            </div>
            <div className="fixed top-1/2 right-1/4 w-1/12 aspect-square rounded-full" style={{backgroundImage: 'conic-gradient(from -90deg,#89a3ff,#5a1dff,#89a3ff'}}>
            </div>
            <div className="grid relative h-screen w-screen justify-center items-center">
                <div className="place-content-center text-[12rem] font-extrabold text-white self-center">
                    UniSync
                </div>
                <div onClick={handleLogin} className="cursor-pointer hover:text-blue-500 absolute justify-self-center bottom-0 text-3xl text-white p-12 underline underline-offset-8">
                
                    Login through Microsoft
                </div>
            </div>
        </div>
  );
};

export default Login;
