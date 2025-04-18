import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const Resume = () => {
  const navigate = useNavigate();
  const { currentUser, userPreferences } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeBlob, setResumeBlob] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [userData, setUserData] = useState(null);
  const fileInputRef = useRef(null);
  const downloadLinkRef = useRef(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
          
          // If user already has a resume URL, set it
          if (userDocSnap.data().resumeUrl) {
            setResumeUrl(userDocSnap.data().resumeUrl);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  // Function to generate resume content
  const generateResumeContent = (userData) => {
    // This is a simplified example of generating resume content
    // In a production app, you'd want a more sophisticated template engine
    
    const {
      displayName,
      email,
      phone,
      location,
      skills = [],
      education = [],
      experience = [],
      summary = "",
      certifications = [],
      projects = []
    } = userData;
    
    let content = "";
    
    // Header
    content += `${displayName || "Name"}\n`;
    content += `${email || ""} | ${phone || ""}\n`;
    content += `${location || ""}\n\n`;
    
    // Summary
    if (summary) {
      content += "PROFESSIONAL SUMMARY\n";
      content += `${summary}\n\n`;
    }
    
    // Skills
    if (skills.length > 0) {
      content += "SKILLS\n";
      content += skills.join(", ") + "\n\n";
    }
    
    // Experience
    if (experience.length > 0) {
      content += "PROFESSIONAL EXPERIENCE\n";
      experience.forEach(exp => {
        content += `${exp.title || "Role"} at ${exp.company || "Company"}\n`;
        content += `${exp.startDate || ""} - ${exp.endDate || "Present"}\n`;
        content += `${exp.description || ""}\n\n`;
      });
    }
    
    // Education
    if (education.length > 0) {
      content += "EDUCATION\n";
      education.forEach(edu => {
        content += `${edu.degree || "Degree"} in ${edu.field || "Field"}\n`;
        content += `${edu.institution || "Institution"}, ${edu.location || ""}\n`;
        content += `${edu.startDate || ""} - ${edu.endDate || ""}\n\n`;
      });
    }
    
    // Certifications
    if (certifications && certifications.length > 0) {
      content += "CERTIFICATIONS\n";
      certifications.forEach(cert => {
        content += `${cert.name || ""}, ${cert.issuer || ""}, ${cert.date || ""}\n`;
      });
      content += "\n";
    }
    
    // Projects
    if (projects && projects.length > 0) {
      content += "PROJECTS\n";
      projects.forEach(project => {
        content += `${project.name || ""}\n`;
        content += `${project.description || ""}\n\n`;
      });
    }
    
    return content;
  };

  // Function to create PDF from user data
  const createResumePDF = async (userData) => {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    const page = pdfDoc.addPage([612, 792]); // Letter size
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;
    const lineHeight = 14;
    
    // Helper function for adding text
    const addText = (text, fontSize = 10, isBold = false, indent = 0) => {
      page.drawText(text, {
        x: margin + indent,
        y,
        size: fontSize,
        font: isBold ? timesRomanBoldFont : timesRomanFont,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight + (fontSize - 10); // Adjust vertical position based on font size
    };
    
    // Helper function for adding section title
    const addSectionTitle = (title) => {
      y -= 10; // Add extra space before section
      addText(title.toUpperCase(), 12, true);
      addText("".padStart(width - 2 * margin, "_"), 8); // Add underline
      y -= 5; // Add space after underline
    };
    
    // Name and contact info
    addText(userData.displayName || "Name", 16, true);
    y -= 5;
    
    const contactInfo = [
      userData.email || "",
      userData.phone || "",
      userData.location || ""
    ].filter(Boolean).join(" | ");
    addText(contactInfo, 10);
    y -= 10;
    
    // Summary
    if (userData.summary) {
      addSectionTitle("Professional Summary");
      addText(userData.summary, 10);
      y -= 10;
    }
    
    // Skills
    if (userData.skills && userData.skills.length > 0) {
      addSectionTitle("Skills");
      addText(userData.skills.join(", "));
      y -= 10;
    }
    
    // Experience
    if (userData.experience && typeof userData.experience === "string") {
        addSectionTitle("Professional Experience");
      
        // Convert the string into an array (assuming it's comma-separated or newline-separated)
        const experiences = userData.experience.split("\n").map(exp => exp.trim());
      
        experiences.forEach(exp => {
          if (exp) {
            addText(exp, 11, false); 
          }
        });
      
        y -= 5;
      } else {
        console.warn("userData.experience is empty or not a string");
      }
      
    if (userData.education && typeof userData.education === "string") {
        addSectionTitle("Education");
      
        const educationEntries = userData.education.split("\n").map(edu => edu.trim());
      
        educationEntries.forEach(edu => {
          if (edu) {
            addText(edu, 11, false); 
          }
        });
      
        y -= 5;
      } else {
        console.warn("userData.education is empty or not a string");
      }
      
    
    // Certifications
    if (userData.certifications && userData.certifications.length > 0) {
      addSectionTitle("Certifications");
      
      userData.certifications.forEach(cert => {
        addText(`${cert.name || ""}, ${cert.issuer || ""}, ${cert.date || ""}`);
      });
      
      y -= 10;
    }
    
    // Projects
    if (userData.projects && userData.projects.length > 0) {
      addSectionTitle("Projects");
      
      userData.projects.forEach(project => {
        addText(project.name || "", 11, true);
        
        if (project.description) {
          const descLines = project.description.split('\n');
          descLines.forEach(line => {
            addText(line, 10, false, 10);
          });
        }
        
        y -= 5;
      });
    }
    
    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    // Create blob for download
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    return blob;
  };

  // Function to analyze resume and provide feedback
  const analyzeResume = (userData) => {
    const feedback = {
      type: "success",
      message: "Your resume has been generated successfully!",
      suggestions: [],
      improvements: [],
      strengths: []
    };
    
    // Check for basic completeness
    if (!userData.summary || userData.summary.length < 50) {
      feedback.suggestions.push("Add a more comprehensive professional summary (aim for 3-5 sentences)");
    } else {
      feedback.strengths.push("Your professional summary effectively highlights your background");
    }
    
    // Check experience entries
    if (!userData.experience || userData.experience.length === 0) {
      feedback.suggestions.push("Add your work experience to strengthen your resume");
    } else {
      let hasQuantifiableResults = false;
      let hasActionVerbs = false;
      
      // Check for action verbs and quantifiable results
      userData.experience.forEach(exp => {
        if (exp.description) {
          if (/increased|decreased|improved|developed|managed|led|created|implemented/i.test(exp.description)) {
            hasActionVerbs = true;
          }
          
          if (/\d+%|\d+ percent|\$\d+|\d+ times/i.test(exp.description)) {
            hasQuantifiableResults = true;
          }
        }
      });
      
      if (!hasActionVerbs) {
        feedback.suggestions.push("Use strong action verbs in your experience descriptions (e.g., 'developed', 'implemented', 'increased')");
      } else {
        feedback.strengths.push("Good use of action verbs in your experience section");
      }
      
      if (!hasQuantifiableResults) {
        feedback.suggestions.push("Add quantifiable achievements to your experience (e.g., 'increased sales by 20%', 'reduced costs by $50K')");
      } else {
        feedback.strengths.push("Effective use of quantifiable results in your experience");
      }
    }
    
    // Check skills
    if (!userData.skills || userData.skills.length < 5) {
      feedback.suggestions.push("Add more skills relevant to your target positions (aim for 8-12 skills)");
    } else {
      feedback.strengths.push("Your skills section is comprehensive");
    }
    
    // Check education
    if (!userData.education || userData.education.length === 0) {
      feedback.suggestions.push("Add your educational background to complete your resume");
    }
    
    // Check for projects or certifications
    if ((!userData.projects || userData.projects.length === 0) && 
        (!userData.certifications || userData.certifications.length === 0)) {
      feedback.suggestions.push("Consider adding projects or certifications to showcase additional qualifications");
    }
    
    return feedback;
  };

  const handleGenerateResume = async () => {
    if (!currentUser) {
      navigate("/login", { state: { from: "/resume", message: "Please log in to generate a resume" } });
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      // Get the latest user data from Firestore if we don't have it already
      let profileData = userData;
      if (!profileData) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          throw new Error("User profile not found. Please complete your profile first.");
        }
        
        profileData = userDocSnap.data();
        setUserData(profileData);
      }
      
      // Check if user has enough profile data to generate a resume
      const requiredFields = ["displayName", "email", "skills", "education", "experience"];
      const missingFields = requiredFields.filter(field => 
        !profileData[field] || 
        (Array.isArray(profileData[field]) && profileData[field].length === 0) ||
        (typeof profileData[field] === 'string' && profileData[field].trim() === '')
      );
      
      if (missingFields.length > 0) {
        throw new Error(`Please complete your profile before generating a resume. Missing: ${missingFields.join(", ")}`);
      }
      
      // Generate resume PDF
      const resumeBlob = await createResumePDF(profileData);
      setResumeBlob(resumeBlob);
      
      // Create object URL for preview and download
      const objectUrl = URL.createObjectURL(resumeBlob);
      setResumeUrl(objectUrl);
      
      // Upload to Firebase Storage
      const storageRef = ref(storage, `resumes/${currentUser.uid}/generated-resume.pdf`);
      await uploadBytes(storageRef, resumeBlob);
      
      // Get Firebase Storage URL
      const firebaseUrl = await getDownloadURL(storageRef);
      
      // Update user document with resume information
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        resumeUrl: firebaseUrl,
        resumeGenerated: true,
        resumeGeneratedAt: new Date(),
      });
      
      // Analyze resume and provide feedback
      const feedbackResults = analyzeResume(profileData);
      setFeedback(feedbackResults);
      
    } catch (err) {
      console.error("Error generating resume:", err);
      setError(err.message || "Failed to generate resume. Please try again later.");
    } finally {
      setGenerating(false);
    }
  };

  const handleResumeUpload = async (e) => {
    if (!currentUser) {
      navigate("/login", { state: { from: "/resume", message: "Please log in to upload a resume" } });
      return;
    }

    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadedFileName(file.name);

    try {
      // Upload file to Firebase Storage
      const storageRef = ref(storage, `resumes/${currentUser.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Create object URL for local preview
      const objectUrl = URL.createObjectURL(file);
      setResumeUrl(objectUrl);
      setResumeBlob(file);
      
      // Update user document with resume information
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        resumeUrl: downloadURL,
        resumeFilename: file.name,
        resumeUploadedAt: new Date(),
      });
      
      // Provide feedback based on user profile - this would be more sophisticated in a real app
      // In a real implementation, you might use an AI service to analyze the resume
      const feedbackData = {
        type: "info",
        message: "Your resume has been analyzed",
        suggestions: [
          "Consider tailoring your resume for each specific job application",
          "Ensure your contact information is up-to-date and professional",
          "Add a LinkedIn profile URL to enhance your professional presence"
        ],
        improvements: [
          "Format your resume with consistent fonts and spacing",
          "Keep your resume to 1-2 pages maximum",
          "Use bullet points instead of paragraphs for better readability"
        ],
        strengths: [
          "Having an existing resume gives you a great foundation to build upon",
          "You've taken an important step in your job search process",
          "Your initiative in seeking feedback shows professional dedication"
        ]
      };
      
      setFeedback(feedbackData);
    } catch (err) {
      console.error("Error uploading resume:", err);
      setError("Failed to upload resume. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleDownloadResume = () => {
    if (resumeBlob) {
      const url = URL.createObjectURL(resumeBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = userData ? `${userData.displayName.replace(/\s+/g, '_')}_Resume.pdf` : 'your_resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
}

export default Resume;