import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";  
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase"; 

const UploadPwDCertificate = () => {
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
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      setError("Please upload a PDF or image (.pdf, .jpg, .jpeg, .png)");
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
        pwdCertificateUrl: cloudinaryUrl,
        pwdVerificationStatus: "pending" // Set status as pending for admin verification
      });

      console.log("PwD Certificate URL stored in Firestore:", cloudinaryUrl);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      setError("Failed to upload certificate. Please try again.");
      console.error("Error during file upload:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-green-50 px-6 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-teal-600 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500 rounded-full opacity-10 blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <motion.div
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md relative z-10 border border-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-600 to-green-500 flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </motion.div>

        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-teal-700 to-green-600 text-transparent bg-clip-text">
          Upload PwD Certificate
        </motion.h2>
        
        <motion.p variants={itemVariants} className="text-gray-600 text-center mb-6">
          Please upload your PwD certificate for verification and accessibility support
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
            Certificate uploaded successfully! Our team will verify it soon.
          </motion.div>
        )}

        <motion.form variants={containerVariants} className="space-y-5" onSubmit={handleSubmit}>
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">PwD Certificate</label>
            
            <div 
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${isDragging ? "border-teal-500 bg-teal-50" : file ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-teal-400"}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("certificate-upload").click()}
            >
              <input
                id="certificate-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              
              <div className="flex flex-col items-center justify-center">
                {file ? (
                  <div className="text-center">
                    <div className="text-green-600 font-medium mb-1">File Selected</div>
                    <span className="text-gray-600">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span className="mt-2 text-sm text-gray-500">Drag & Drop or Click to Upload</span>
                    <span className="text-xs text-gray-400 mt-1">(PDF, JPG, JPEG, PNG - Max 5MB)</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-sm text-gray-600 p-3 bg-blue-50 rounded-lg">
            <p className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Your certificate will be verified by our team. Once approved, you'll receive access to all accessibility features and support.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              type="submit"
              className={`w-full py-3 bg-teal-600 text-white rounded-xl font-medium ${isLoading ? "cursor-wait" : "hover:bg-teal-700"} transition-colors`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : "Upload Certificate"}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default UploadPwDCertificate;