// import React from 'react'
import { useState } from "react";
import axios from "axios";
import React from "react";
import { serverUrl } from "../helpers/Constants";
import { useNavigate,Link } from "react-router-dom";

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword, setShowPassword]= useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  // 👇 ADD THE FUNCTION HERE
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log("Login clicked");
    // console.log("Email:", email);
    // console.log("Password:", password);
    try {
        
        const response = await axios.post(`${serverUrl}/auth/login`,{ 
            email: email,
            password: password 
        });

        console.log(response.data);

        //save token
        localStorage.setItem("token", response.data.token);
        setErrorMessage("");
        alert("Login successfull");

        //navigating to the main site
        navigate("/dashboard");
        // window.location.href="/dashboard";
    } catch (error: any) {
        console.log(error);

        if(error.response){
            setErrorMessage(error.response.data.message);
        } else {
            setErrorMessage("Login failed. Please try again.");
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>
            {/* 👇 CONNECT FUNCTION HERE */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input 
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="relative">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input 
                    type={showPassword ? "text": "password"}
                    placeholder="Enter password" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus-outline-none focus:right-2 focus:ring-green-400"
                    />

                    {errorMessage && (
                        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                    )}
                    <button
                        type="button"
                        onClick={() =>setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-sm text-gray-600 hover:text-gray-900"
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                    Login
                </button>
                <p className="text-center text-sm text-gray-600 mt-4">Don't have an account
                    <Link to="/register" className="text-blue-500 ml-1 hover:underline">Register</Link>
                </p>
            </form>
        </div>
                
    </div>
  );
};

export default Login;