import { useEffect, useState } from "react";
import logo from "../assets/logo.png";


export default function StartupLoader({ children }) {
    const [ready, setReady] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        let interval;

        const checkBackend = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/health`
                );

                if (res.ok) {
                    clearInterval(interval);
                    setReady(true);
                }
            } catch (err) { }
        };

        checkBackend();

        const timeout = setTimeout(() => {
            setShowLoader(true);
        }, 1500);

        interval = setInterval(checkBackend, 2000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    if (ready) return children;

    if (!showLoader) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center px-6">

            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 text-center border border-slate-200">

                {/* Logo */}

                <img
                    src={logo}
                    alt="Distribo"
                    className="w-28 sm:w-32 md:w-40 lg:w-48 xl:w-56 h-auto mx-auto mb-6 object-contain"
                />

                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">

                    Distribo

                </h1>

                <p className="text-slate-500 mt-2">
                    Distribution Management System
                </p>

                <div className="flex justify-center mt-10">

                    <div className="w-14 h-14 border-[5px] border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>

                </div>

                <h2 className="mt-8 text-xl font-semibold text-slate-800">

                    Connecting to Server...

                </h2>

                <p className="text-sm text-slate-500 mt-3 leading-6">

                    Please wait while the backend server starts.

                    <br />

                    The first visit may take around
                    <span className="font-semibold text-blue-700"> 30–60 seconds </span>

                    because the application is hosted on a free cloud service.

                </p>

                <div className="mt-8">

                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">

                        <div className="h-2 bg-gradient-to-r from-blue-700 to-blue-400 animate-pulse w-full"></div>

                    </div>

                </div>

            </div>

        </div>
    );
}