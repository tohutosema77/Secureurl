import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout(){
    const navigate= useNavigate();

    useEffect (() =>{
        //clear any stored auth tokens
        localStorage.removeItem("token");
        //Optionally clear user info
        localStorage.removeItem("user");

        //Redirect to Login page after a short delay
        const timer =setTimeout(() =>{
             navigate("/login");
        }, 500);
       return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p className="text-gray-700 text-lg">Logging out.....</p>
        </div>
    )
};

export default Logout;