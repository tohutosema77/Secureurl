// import React from 'react'
import { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword, setShowPassword]= useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    try {
        
        await axios.post(
            "http://localhost:5001/api/auth/register",
            { name,email,password }
        );

        alert("User created! Please login!");

        navigate("/login");

    } catch (error) {
        console.log(error);
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Register</h2>

            <form onSubmit={handleRegister} className="space-y-4">

                <div>
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input 
                    type="text"
                    placeholder="Enter name" 
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus-outline-none focus:right-2 focus:ring-green-400"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input 
                    type="text"
                    placeholder="Enter email" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus-outline-none focus:right-2 focus:ring-green-400"
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

                    <button
                        type="button"
                        onClick={() =>setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-sm text-gray-600 hover:text-gray-900"
                        >
                            {showPassword ? "🙈" : "👁"}
                        </button>
                </div>

                <button type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">Register</button>
            </form>
            
            <p className="text-center text-sm text-gray-600 mt-4">Already have an account?
                <Link to="/login" className="text-blue-500 ml-1 hover:underline">Login</Link>
            </p>
            </div>    
    </div>
  );
}

export default Register;