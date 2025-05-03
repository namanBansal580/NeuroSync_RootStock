"use client"

import { motion, AnimatePresence } from "framer-motion"



export default function Notification({ message, type }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg`}>{message}</div>
      </motion.div>
    </AnimatePresence>
  )
}

