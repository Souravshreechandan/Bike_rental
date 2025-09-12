// src/pages/Login.jsx
import React from 'react';

const Login = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="p-8 bg-white shadow-md rounded-lg w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Login;
