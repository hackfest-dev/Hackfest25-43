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
    };
};

export default Resume;