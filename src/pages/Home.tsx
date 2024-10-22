import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  variant?: 'default' | 'outline';
  size?: 'default' | 'lg';
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  className = '',
  children,
  onClick,
}) => {
  const baseStyles = "font-semibold rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-primary text-primary hover:bg-primary/10",
  };
  const sizeStyles = {
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/20">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="text-2xl font-bold text-primary">PollChat</div>
        <div className="space-x-4">
          <Button variant="default" size="default" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="outline" size="default" onClick={() => navigate('/register')}>
            Register
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <motion.main className="flex-grow flex items-center justify-center p-4">
        <motion.div className="text-center space-y-8 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 className="text-4xl font-bold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Welcome to PollChat
          </motion.h1>
          <motion.p className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Your go-to platform for interactive polls and engaging conversations.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button variant="default" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
              Register
            </Button>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <motion.footer className="text-center text-muted-foreground p-4 bg-white shadow-inner">
        <p>© {new Date().getFullYear()} PollChat. All rights reserved.</p>
      </motion.footer>
    </div>
  );
}
