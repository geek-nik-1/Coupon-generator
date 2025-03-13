import { motion } from "framer-motion";

export default function Card({ children }) {
  return (
    <motion.div 
      className="p-4 bg-white/20 backdrop-blur-lg rounded-xl shadow-lg"
      initial={{ opacity: 0, y: -10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
