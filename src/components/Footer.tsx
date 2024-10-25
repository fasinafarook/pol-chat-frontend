// src/components/Footer.tsx
import React from 'react'

const Footer: React.FC = () => (
    <footer className="bg-gray-800 text-white py-8">
    <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
      <div className="text-2xl font-bold mb-4 md:mb-0">PollChat</div>
      <div className="flex space-x-6">
        <a href="#" className="hover:text-gray-300 transition-colors">About</a>
        <a href="#" className="hover:text-gray-300 transition-colors">Features</a>
        <a href="#" className="hover:text-gray-300 transition-colors">Pricing</a>
        <a href="#" className="hover:text-gray-300 transition-colors">Contact</a>
      </div>
    </div>
    <div className="text-center text-gray-400 mt-8">
      © {new Date().getFullYear()} PollChat. All rights reserved.
    </div>
  </footer>
)

export default Footer
