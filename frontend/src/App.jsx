import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "./components/Button";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedCooldown = localStorage.getItem("cooldown");
    return savedCooldown ? Math.max(0, (parseInt(savedCooldown) - Date.now()) / 1000) : null;
  });

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            localStorage.removeItem("cooldown"); // Remove cooldown when expired
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  const claimCoupon = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/coupons/claim`);
      const data = await response.json();
      console.log(data);
      
      setMessage(data.message);

      // If backend returns a cooldown time, store it
      if (data.timeRemaining) {
        const cooldownTime = data.timeRemaining * 1000;
        localStorage.setItem("cooldown", Date.now() + cooldownTime);
        setTimeLeft(data.timeRemaining);
      }
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

        {timeLeft > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-lg text-white">
            ⏳ Please wait {Math.floor(timeLeft / 60)}m {Math.floor(timeLeft % 60)}s before claiming again.
          </motion.p>
        )}

        {message && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-lg text-white">
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
