"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 ">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-gray-800">
        <div className="text-2xl font-bold text-white">PollChat</div>
        <div className="space-x-4">
          <Link to="/login">
            <button className="text-white hover:text-gray-800 transition-colors">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
              Signup
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-8">
        <motion.div
          className="text-center space-y-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Create engaging polls and spark meaningful conversations
          </h1>
          <p className="text-xl text-gray-600 mt-6">
            PollChat is your all-in-one platform for interactive polling and
            real-time discussions. Elevate your audience engagement
            effortlessly.
          </p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Link to="/login">
              <button className="bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold px-8 py-3 rounded-full transition-colors shadow-lg">
                Start
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose PollChat?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                title: "Real-time Results",
                description:
                  "Watch poll results update instantly as participants respond.",
              },
              {
                title: "Customizable Polls",
                description:
                  "Create polls that fit your unique needs with our flexible options.",
              },
              {
                title: "Engaging Discussions",
                description:
                  "Foster meaningful conversations around your poll topics.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
