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
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [resumeBlob, setResumeBlob] = useState(null);
  const [userData, setUserData] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserData(data);

          if (data.resumeUrl) {
            setResumeUrl(data.resumeUrl);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const createResumePDF = async (userData) => {
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    const page = pdfDoc.addPage([612, 792]);
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;
    const lineHeight = 14;

    const addText = (text, fontSize = 10, isBold = false, indent = 0) => {
      if (y <= 50) {
        y = height - margin;
        pdfDoc.addPage([612, 792]);
      }
      page.drawText(text, {
        x: margin + indent,
        y,
        size: fontSize,
        font: isBold ? timesRomanBoldFont : timesRomanFont,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight + (fontSize - 10);
    };

    const addSectionTitle = (title) => {
      y -= 10;
      addText(title.toUpperCase(), 12, true);
      addText("".padStart(width - 2 * margin, "_"), 8);
      y -= 5;
    };

    addText(userData.displayName || "Name", 16, true);
    y -= 5;

    const contactInfo = [
      userData.email || "",
      userData.phone || "",
      userData.location || ""
    ].filter(Boolean).join(" | ");
    addText(contactInfo, 10);
    y -= 10;

    if (userData.summary) {
      addSectionTitle("Professional Summary");
      addText(userData.summary, 10);
      y -= 10;
    }

    if (userData.skills?.length) {
      addSectionTitle("Skills");
      addText(userData.skills.join(", "));
      y -= 10;
    }

    if (Array.isArray(userData.experience)) {
      addSectionTitle("Professional Experience");
      userData.experience.forEach(exp => {
        addText(`${exp.title || "Role"} at ${exp.company || "Company"}`, 11, true);
        addText(`${exp.startDate || ""} - ${exp.endDate || "Present"}`);
        addText(exp.description || "", 10, false, 10);
        y -= 5;
      });
    }

    if (Array.isArray(userData.education)) {
      addSectionTitle("Education");
      userData.education.forEach(edu => {
        addText(`${edu.degree || "Degree"} in ${edu.field || "Field"}`, 11, true);
        addText(`${edu.institution || "Institution"}, ${edu.location || ""}`);
        addText(`${edu.startDate || ""} - ${edu.endDate || ""}`);
        y -= 5;
      });
    }

    if (Array.isArray(userData.certifications)) {
      addSectionTitle("Certifications");
      userData.certifications.forEach(cert => {
        addText(`${cert.name}, ${cert.issuer}, ${cert.date}`);
      });
      y -= 10;
    }

    if (Array.isArray(userData.projects)) {
      addSectionTitle("Projects");
      userData.projects.forEach(project => {
        addText(project.name, 11, true);
        project.description?.split("\n").forEach(line => addText(line, 10, false, 10));
        y -= 5;
      });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  };

  const analyzeResume = (userData) => {
    const feedback = {
      message: "Your resume has been generated successfully!",
      suggestions: [],
      strengths: []
    };

    if (!userData.summary || userData.summary.length < 50) {
      feedback.suggestions.push("Add a more comprehensive professional summary.");
    } else {
      feedback.strengths.push("Strong professional summary.");
    }

    if (!Array.isArray(userData.experience) || userData.experience.length === 0) {
      feedback.suggestions.push("Add work experience.");
    } else {
      const descs = userData.experience.map(e => e.description || "").join(" ");
      if (!/increased|decreased|developed|led|managed|created/i.test(descs)) {
        feedback.suggestions.push("Use strong action verbs in experience.");
      } else {
        feedback.strengths.push("Effective use of action verbs.");
      }
      if (!/\d+%|\d+|\$/.test(descs)) {
        feedback.suggestions.push("Add quantifiable results.");
      } else {
        feedback.strengths.push("Good quantifiable outcomes in experience.");
      }
    }

    if (!userData.skills || userData.skills.length < 5) {
      feedback.suggestions.push("List more relevant skills.");
    } else {
      feedback.strengths.push("Solid skills section.");
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
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        throw new Error("User profile not found.");
      }

      const profileData = userDocSnap.data();
      setUserData(profileData);

      const requiredFields = ["displayName", "email", "skills", "education", "experience"];
      const missingFields = requiredFields.filter(field =>
        !profileData[field] ||
        (Array.isArray(profileData[field]) && profileData[field].length === 0)
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      const blob = await createResumePDF(profileData);
      setResumeBlob(blob);

      const storageRef = ref(storage, `resumes/${currentUser.uid}.pdf`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setResumeUrl(downloadURL);

      await updateDoc(userDocRef, { resumeUrl: downloadURL });
      const resumeFeedback = analyzeResume(profileData);
      setFeedback(resumeFeedback);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Resume Generator</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {feedback && (
        <div className="p-4 mb-4 border rounded bg-green-50">
          <p className="font-semibold">{feedback.message}</p>
          <ul className="list-disc pl-5 text-sm mt-2">
            {feedback.suggestions.map((sug, idx) => <li key={idx}>{sug}</li>)}
          </ul>
          <ul className="list-disc pl-5 text-sm mt-2 text-green-700">
            {feedback.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
          </ul>
        </div>
      )}

      <button
        onClick={handleGenerateResume}
        disabled={generating}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {generating ? "Generating..." : "Generate Resume"}
      </button>

      {resumeUrl && (
        <div className="mt-6">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View or Download Resume
          </a>
        </div>
      )}
    </div>
  );
};

export default Resume;
