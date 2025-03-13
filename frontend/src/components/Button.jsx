import { motion } from "framer-motion";

export default function Button({ onClick, disabled, loading, timeLeft }) {
  return (
    <motion.button 
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className={`px-5 py-3 rounded-xl shadow-md text-white text-lg font-bold transition-all duration-300
        ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl"}`}
      disabled={disabled}
    >
      {loading ? "Claiming..." : timeLeft ? `Wait ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s` : "Claim Coupon"}
    </motion.button>
  );
}
