// ============================================
// pages/NotFound.jsx - 404 Page
// Route match aagaama poana page!
// ============================================
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
            <div className="text-8xl mb-6">✂️</div>
            <h1 className="text-6xl font-black text-slate-900 mb-2">404</h1>
            <p className="text-slate-500 text-lg mb-8">
                Oops! This page got its hair cut too short. We can't find it!
            </p>
            <button
                onClick={() => navigate("/")}
                className="bg-blue-700 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-800 transition-colors"
            >
                Go Back Home
            </button>
        </div>
    );
};

export default NotFound;
