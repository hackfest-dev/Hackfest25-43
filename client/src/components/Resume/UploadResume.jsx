import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";  
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase"; 

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError("");
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      setError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("User is not authenticated. Please log in.");
        console.log("No user is signed in");
        return;
      }

      const userId = user.uid;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "resume_upload_preset");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dnmaxvpjz/upload", 
        formData
      );

      const cloudinaryUrl = response.data.secure_url; 

      console.log("Cloudinary URL:", cloudinaryUrl);

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        resumeUrl: cloudinaryUrl,
      });

      console.log("Resume URL stored in Firestore:", cloudinaryUrl);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      setError("Failed to upload resume. Please try again.");
      console.error("Error during file upload:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-blue-50 px-6 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <motion.div
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md relative z-10 border border-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </motion.div>

        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-700 to-blue-600 text-transparent bg-clip-text">
          Upload Your Resume
        </motion.h2>
        
        <motion.p variants={itemVariants} className="text-gray-600 text-center mb-6">
          Share your resume to enhance your profile and opportunities
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {uploadSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
          >
            Resume uploaded successfully!
          </motion.div>
        )}

        <motion.form variants={containerVariants} className="space-y-5" onSubmit={handleSubmit}>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume File</label>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging ? "border-purple-500 bg-purple-50" : file ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-purple-400"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              
            
              <div className="flex flex-col items-center justify-center">
                {file ? (
                  <span className="text-gray-600">{file.name}</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="mt-2 text-sm text-gray-500">Drag & Drop or Click to Upload</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className={`w-full py-3 bg-purple-600 text-white rounded-xl ${isLoading ? "cursor-wait" : "hover:bg-purple-700"}`}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Resume"}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default UploadResume;


