import React from 'react';
import { Toaster } from 'react-hot-toast'

const ToasterComponent = () => {
    return (
        <>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    style: {
                        background: "#1f2937", // Tailwind slate-800
                        color: "#fff",
                        border: "1px solid #334155", // Tailwind slate-700
                    },
                    success: {
                        iconTheme: {
                            primary: "#10b981", // Tailwind green-500
                            secondary: "#1f2937",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ef4444", // Tailwind red-500
                            secondary: "#1f2937",
                        },
                    },
                }}
            />
        </>
    );
};

export default ToasterComponent;