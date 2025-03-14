import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "./components/Button";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const claimCoupon = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/coupons/claim`);
      const data = await response.json();
      console.log(data)
      
      if (data.message.includes("minutes")) {
        const minutes = parseInt(data.message.match(/\d+/)[0], 10);
        setTimeLeft(minutes * 60);
      }
      
      setMessage(data.message);
    } catch (error) {
      setMessage("Error claiming coupon. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="p-6 bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl text-center max-w-md"
      >
        <h1 className="text-3xl font-extrabold text-white mb-4">🎟️ Claim Your Exclusive Coupon</h1>
        <p className="text-white/80 mb-4">Click the button below to claim a coupon. Limited availability.</p>

        <Button onClick={claimCoupon} disabled={loading || timeLeft} loading={loading} timeLeft={timeLeft} />

        {message && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-lg text-white">
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}