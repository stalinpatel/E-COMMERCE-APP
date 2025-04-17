import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
            >
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            </motion.div>
        </div>
    );
};

export default LoadingSpinner;
