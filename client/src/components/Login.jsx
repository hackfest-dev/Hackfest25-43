import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  // Pre-generate random values for bubbles to ensure they remain consistent
  const bubbleAnimations = [...Array(12)].map(() => ({
    size: Math.floor(Math.random() * 8) + 3,
    positionTop: Math.random() * 100,
    positionLeft: Math.random() * 100,
    moveY: Math.random() * 20 - 10,
    moveX: Math.random() * 20 - 10,
    duration: 5 + Math.random() * 5
  }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setIsLoading(false);
      setError("Please fill in all fields.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/get-started/step1");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message.includes("user-not-found") || error.message.includes("wrong-password") 
        ? "Invalid email or password." 
        : "Failed to login. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/get-started/step1");
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first.");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Failed to send password reset email. Please check if the email is correct.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-blue-50 px-6 py-12">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated bubbles with pre-computed values */}
        {bubbleAnimations.map((bubble, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-purple-600 to-blue-500 opacity-20"
            style={{ 
              width: `${bubble.size}rem`,
              height: `${bubble.size}rem`,
              top: `${bubble.positionTop}%`, 
              left: `${bubble.positionLeft}%`,
              filter: "blur(1px)" 
            }}
            animate={{
              y: [0, bubble.moveY],
              x: [0, bubble.moveX],
              scale: [1, 1.05, 0.95, 1],
            }}
            transition={{
              duration: bubble.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
        
        {/* Design accents */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>
      
      {/* Logo/Nav */}
      <Link to="/" className="absolute top-8 left-8 z-10">
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          opport<span className="font-extrabold">UNITY</span>
        </motion.h1>
      </Link>