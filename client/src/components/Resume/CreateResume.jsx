import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";

// Main Resume Builder Component
const ResumeBuilder = () => {
  const [view, setView] = useState("edit"); // "edit" or "preview"
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      summary: ""
    },
    education: [
      { degree: "", institution: "", duration: "", location: "" }
    ],
    experience: [
      { 
        position: "", 
        company: "", 
        duration: "", 
        location: "", 
        description: "",
        responsibilities: [""],
        achievements: [""]
      }
    ],
    skills: {
      frontend: [],
      backend: [],
      databases: [],
      tools: [],
      languages: []
    },
    projects: [
      { 
        name: "", 
        description: [""] 
      }
    ],
    certificates: [
      { 
        name: "", 
        description: "" 
      }
    ],
    languages: [
      { 
        name: "", 
        proficiency: "" 
      }
    ]
  });

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {view === "edit" ? (
        <ResumeForm 
          resumeData={resumeData} 
          setResumeData={setResumeData} 
          onPreview={() => setView("preview")} 
        />
      ) : (
        <ResumePreview 
          resumeData={resumeData} 
          onBack={() => setView("edit")} 
          onDownload={handleDownloadPDF} 
        />
      )}
    </div>
  );
};

// Resume Form Component for Editing
const ResumeForm = ({ resumeData, setResumeData, onPreview }) => {
  const updatePersonalInfo = (field, value) => {
    setResumeData({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    });
  };

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        { degree: "", institution: "", duration: "", location: "" }
      ]
    });
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index][field] = value;
    setResumeData({
      ...resumeData,
      education: updatedEducation
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation.splice(index, 1);
    setResumeData({
      ...resumeData,
      education: updatedEducation
    });
  };

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { 
          position: "", 
          company: "", 
          duration: "", 
          location: "", 
          description: "",
          responsibilities: [""],
          achievements: [""]
        }
      ]
    });
  };

  const updateExperience = (index, field, value) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[index][field] = value;
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };

  const addResponsibility = (expIndex) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[expIndex].responsibilities.push("");
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };

  const updateResponsibility = (expIndex, respIndex, value) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[expIndex].responsibilities[respIndex] = value;
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };

  const removeResponsibility = (expIndex, respIndex) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[expIndex].responsibilities.splice(respIndex, 1);
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };

  const addAchievement = (expIndex) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[expIndex].achievements.push("");
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };

  const updateAchievement = (expIndex, achIndex, value) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[expIndex].achievements[achIndex] = value;
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };

  const removeAchievement = (expIndex, achIndex) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience[expIndex].achievements.splice(achIndex, 1);
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };

  const removeExperience = (index) => {
    const updatedExperience = [...resumeData.experience];
    updatedExperience.splice(index, 1);
    setResumeData({
      ...resumeData,
      experience: updatedExperience
    });
  };

  const updateSkills = (category, value) => {
    setResumeData({
      ...resumeData,
      skills: {
        ...resumeData.skills,
        [category]: value.split(",").map(item => item.trim()).filter(item => item !== "")
      }
    });
  };

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        { name: "", description: [""] }
      ]
    });
  };

  const updateProject = (index, field, value) => {
    const updatedProjects = [...resumeData.projects];
    if (field === "name") {
      updatedProjects[index].name = value;
    }
    setResumeData({
      ...resumeData,
      projects: updatedProjects
    });
  };

  const addProjectDescription = (projIndex) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects[projIndex].description.push("");
    setResumeData({
      ...resumeData,
      projects: updatedProjects
    });
  };

  const updateProjectDescription = (projIndex, descIndex, value) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects[projIndex].description[descIndex] = value;
    setResumeData({
      ...resumeData,
      projects: updatedProjects
    });
  };

  const removeProjectDescription = (projIndex, descIndex) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects[projIndex].description.splice(descIndex, 1);
    setResumeData({
      ...resumeData,
      projects: updatedProjects
    });
  };

  const removeProject = (index) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects.splice(index, 1);
    setResumeData({
      ...resumeData,
      projects: updatedProjects
    });
  };

  const addCertificate = () => {
    setResumeData({
      ...resumeData,
      certificates: [
        ...resumeData.certificates,
        { name: "", description: "" }
      ]
    });
  };

  const updateCertificate = (index, field, value) => {
    const updatedCertificates = [...resumeData.certificates];
    updatedCertificates[index][field] = value;
    setResumeData({
      ...resumeData,
      certificates: updatedCertificates
    });
  };

  const removeCertificate = (index) => {
    const updatedCertificates = [...resumeData.certificates];
    updatedCertificates.splice(index, 1);
    setResumeData({
      ...resumeData,
      certificates: updatedCertificates
    });
  };

  const addLanguage = () => {
    setResumeData({
      ...resumeData,
      languages: [
        ...resumeData.languages,
        { name: "", proficiency: "" }
      ]
    });
  };

  const updateLanguage = (index, field, value) => {
    const updatedLanguages = [...resumeData.languages];
    updatedLanguages[index][field] = value;
    setResumeData({
      ...resumeData,
      languages: updatedLanguages
    });
  };

  const removeLanguage = (index) => {
    const updatedLanguages = [...resumeData.languages];
    updatedLanguages.splice(index, 1);
    setResumeData({
      ...resumeData,
      languages: updatedLanguages
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Build Your Resume</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resumeData.personalInfo.name}
              onChange={(e) => updatePersonalInfo("name", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title/Role</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resumeData.personalInfo.title}
              onChange={(e) => updatePersonalInfo("title", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resumeData.personalInfo.email}
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resumeData.personalInfo.phone}
              onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo("location", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resumeData.personalInfo.linkedin}
              onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={resumeData.personalInfo.github}
              onChange={(e) => updatePersonalInfo("github", e.target.value)}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
          <textarea
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            value={resumeData.personalInfo.summary}
            onChange={(e) => updatePersonalInfo("summary", e.target.value)}
          ></textarea>
        </div>
      </div>

      {/* Education Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-semibold">Education</h2>
          <button 
            onClick={addEducation}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Add Education
          </button>
        </div>
        
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Education #{index + 1}</h3>
              {resumeData.education.length > 1 && (
                <button 
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree/Certificate</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YYYY - MM/YYYY"
                  value={edu.duration}
                  onChange={(e) => updateEducation(index, "duration", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={edu.location}
                  onChange={(e) => updateEducation(index, "location", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Work Experience Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-semibold">Work Experience</h2>
          <button 
            onClick={addExperience}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Add Experience
          </button>
        </div>
        
        {resumeData.experience.map((exp, expIndex) => (
          <div key={expIndex} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Experience #{expIndex + 1}</h3>
              {resumeData.experience.length > 1 && (
                <button 
                  onClick={() => removeExperience(expIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position/Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={exp.position}
                  onChange={(e) => updateExperience(expIndex, "position", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={exp.company}
                  onChange={(e) => updateExperience(expIndex, "company", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YYYY - Present"
                  value={exp.duration}
                  onChange={(e) => updateExperience(expIndex, "duration", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={exp.location}
                  onChange={(e) => updateExperience(expIndex, "location", e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Description (Optional)</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="2"
                value={exp.description}
                onChange={(e) => updateExperience(expIndex, "description", e.target.value)}
              ></textarea>
            </div>
            
            {/* Responsibilities */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                <button 
                  onClick={() => addResponsibility(expIndex)}
                  className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs"
                >
                  Add Item
                </button>
              </div>
              
              {exp.responsibilities.map((resp, respIndex) => (
                <div key={respIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={resp}
                    onChange={(e) => updateResponsibility(expIndex, respIndex, e.target.value)}
                    placeholder="Led a team of developers..."
                  />
                  {exp.responsibilities.length > 1 && (
                    <button 
                      onClick={() => removeResponsibility(expIndex, respIndex)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Achievements */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Key Achievements</label>
                <button 
                  onClick={() => addAchievement(expIndex)}
                  className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs"
                >
                  Add Item
                </button>
              </div>
              
              {exp.achievements.map((ach, achIndex) => (
                <div key={achIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={ach}
                    onChange={(e) => updateAchievement(expIndex, achIndex, e.target.value)}
                    placeholder="Increased user engagement by 40%..."
                  />
                  {exp.achievements.length > 1 && (
                    <button 
                      onClick={() => removeAchievement(expIndex, achIndex)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Frontend</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="HTML, CSS, JavaScript, etc."
              value={resumeData.skills.frontend.join(", ")}
              onChange={(e) => updateSkills("frontend", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Backend</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Node.js, Express, etc."
              value={resumeData.skills.backend.join(", ")}
              onChange={(e) => updateSkills("backend", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Databases</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="MongoDB, MySQL, etc."
              value={resumeData.skills.databases.join(", ")}
              onChange={(e) => updateSkills("databases", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tools & Platforms</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Git, GitHub, VS Code, etc."
              value={resumeData.skills.tools.join(", ")}
              onChange={(e) => updateSkills("tools", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Programming Languages</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Python, Java, C++, etc."
              value={resumeData.skills.languages.join(", ")}
              onChange={(e) => updateSkills("languages", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-semibold">Projects</h2>
          <button 
            onClick={addProject}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Add Project
          </button>
        </div>
        
        {resumeData.projects.map((project, projIndex) => (
          <div key={projIndex} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Project #{projIndex + 1}</h3>
              {resumeData.projects.length > 1 && (
                <button 
                  onClick={() => removeProject(projIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={project.name}
                onChange={(e) => updateProject(projIndex, "name", e.target.value)}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Project Description</label>
                <button 
                  onClick={() => addProjectDescription(projIndex)}
                  className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xs"
                >
                  Add Point
                </button>
              </div>
              
              {project.description.map((desc, descIndex) => (
                <div key={descIndex} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="flex-grow px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={desc}
                    onChange={(e) => updateProjectDescription(projIndex, descIndex, e.target.value)}
                    placeholder="Developed a web application that..."
                  />
                  {project.description.length > 1 && (
                    <button 
                      onClick={() => removeProjectDescription(projIndex, descIndex)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Certificates Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-semibold">Certificates</h2>
          <button 
            onClick={addCertificate}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Add Certificate
          </button>
        </div>
        
        {resumeData.certificates.map((cert, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Certificate #{index + 1}</h3>
              {resumeData.certificates.length > 1 && (
                <button 
                  onClick={() => removeCertificate(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Certificate Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cert.name}
                  onChange={(e) => updateCertificate(index, "name", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={cert.description}
                  onChange={(e) => updateCertificate(index, "description", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Languages Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className="text-xl font-semibold">Languages</h2>
          <button 
            onClick={addLanguage}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Add Language
          </button>
        </div>
        
        {resumeData.languages.map((lang, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Language #{index + 1}</h3>
              {resumeData.languages.length > 1 && (
                <button 
                  onClick={() => removeLanguage(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={lang.name}
                  onChange={(e) => updateLanguage(index, "name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={lang.proficiency}
                  onChange={(e) => updateLanguage(index, "proficiency", e.target.value)}
                >
                  <option value="">Select Level</option>
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onPreview}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Preview Resume
        </button>
      </div>
    </div>
  );
};

// Resume Preview Component
const ResumePreview = ({ resumeData, onBack, onDownload }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume Preview</h1>
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Edit
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div id="resume-preview" className="bg-white p-6 border rounded-lg max-w-4xl mx-auto">
        {/* Header/Contact Info */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-center text-blue-800">
            {resumeData.personalInfo.name || "Your Name"}
          </h1>
          <h2 className="text-xl text-center text-gray-600 mt-1">
            {resumeData.personalInfo.title || "Your Title"}
          </h2>
          
          <div className="flex flex-wrap justify-center mt-3 text-sm text-gray-700">
            {resumeData.personalInfo.email && (
              <div className="mx-2 flex items-center">
                <span className="font-medium">Email:</span>
                <span className="ml-1">{resumeData.personalInfo.email}</span>
              </div>
            )}
            
            {resumeData.personalInfo.phone && (
              <div className="mx-2 flex items-center">
                <span className="font-medium">Phone:</span>
                <span className="ml-1">{resumeData.personalInfo.phone}</span>
              </div>
            )}
            
            {resumeData.personalInfo.location && (
              <div className="mx-2 flex items-center">
                <span className="font-medium">Location:</span>
                <span className="ml-1">{resumeData.personalInfo.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center mt-2 text-sm text-blue-600">
            {resumeData.personalInfo.linkedin && (
              <a href={resumeData.personalInfo.linkedin} className="mx-2 hover:underline">
                LinkedIn
              </a>
            )}
            
            {resumeData.personalInfo.github && (
              <a href={resumeData.personalInfo.github} className="mx-2 hover:underline">
                GitHub
              </a>
            )}
          </div>
        </div>
        
        {/* Summary */}
        {resumeData.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-2 border-b pb-1">Summary</h2>
            <p className="text-gray-700">{resumeData.personalInfo.summary}</p>
          </div>
        )}
        
        {/* Experience */}
        {resumeData.experience.some(exp => exp.position || exp.company) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-3 border-b pb-1">Professional Experience</h2>
            
            {resumeData.experience.map((exp, index) => (
              (exp.position || exp.company) && (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{exp.position || "Position"}</h3>
                      <p className="text-gray-600">{exp.company || "Company"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">{exp.duration || "Duration"}</p>
                      <p className="text-gray-600 text-sm">{exp.location || "Location"}</p>
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-gray-700 text-sm mt-1 italic">{exp.description}</p>
                  )}
                  
                  {exp.responsibilities.some(r => r) && (
                    <div className="mt-2">
                      <p className="font-medium text-sm">Responsibilities:</p>
                      <ul className="list-disc pl-5 text-gray-700 text-sm">
                        {exp.responsibilities.map((resp, i) => (
                          resp && <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {exp.achievements.some(a => a) && (
                    <div className="mt-2">
                      <p className="font-medium text-sm">Key Achievements:</p>
                      <ul className="list-disc pl-5 text-gray-700 text-sm">
                        {exp.achievements.map((ach, i) => (
                          ach && <li key={i}>{ach}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        )}
        
        {/* Education */}
        {resumeData.education.some(edu => edu.degree || edu.institution) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-3 border-b pb-1">Education</h2>
            
            {resumeData.education.map((edu, index) => (
              (edu.degree || edu.institution) && (
                <div key={index} className="mb-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{edu.degree || "Degree"}</h3>
                      <p className="text-gray-600">{edu.institution || "Institution"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">{edu.duration || "Duration"}</p>
                      <p className="text-gray-600 text-sm">{edu.location || "Location"}</p>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
        
        {/* Skills */}
        {(resumeData.skills.frontend.length > 0 || 
          resumeData.skills.backend.length > 0 || 
          resumeData.skills.databases.length > 0 || 
          resumeData.skills.tools.length > 0 || 
          resumeData.skills.languages.length > 0) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-3 border-b pb-1">Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {resumeData.skills.frontend.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm">Frontend:</h3>
                  <p className="text-gray-700 text-sm">{resumeData.skills.frontend.join(", ")}</p>
                </div>
              )}
              
              {resumeData.skills.backend.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm">Backend:</h3>
                  <p className="text-gray-700 text-sm">{resumeData.skills.backend.join(", ")}</p>
                </div>
              )}
              
              {resumeData.skills.databases.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm">Databases:</h3>
                  <p className="text-gray-700 text-sm">{resumeData.skills.databases.join(", ")}</p>
                </div>
              )}
              
              {resumeData.skills.tools.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm">Tools & Platforms:</h3>
                  <p className="text-gray-700 text-sm">{resumeData.skills.tools.join(", ")}</p>
                </div>
              )}
              
              {resumeData.skills.languages.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm">Programming Languages:</h3>
                  <p className="text-gray-700 text-sm">{resumeData.skills.languages.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Projects */}
        {resumeData.projects.some(proj => proj.name) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-3 border-b pb-1">Projects</h2>
            
            {resumeData.projects.map((proj, index) => (
              proj.name && (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold">{proj.name}</h3>
                  {proj.description.some(d => d) && (
                    <ul className="list-disc pl-5 text-gray-700 text-sm">
                      {proj.description.map((desc, i) => (
                        desc && <li key={i}>{desc}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            ))}
          </div>
        )}
        
        {/* Certificates */}
        {resumeData.certificates.some(cert => cert.name) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-3 border-b pb-1">Certificates</h2>
            
            {resumeData.certificates.map((cert, index) => (
              cert.name && (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold">{cert.name}</h3>
                  {cert.description && (
                    <p className="text-gray-700 text-sm">{cert.description}</p>
                  )}
                </div>
              )
            ))}
          </div>
        )}
        
        {/* Languages */}
        {resumeData.languages.some(lang => lang.name) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-3 border-b pb-1">Languages</h2>
            
            <div className="flex flex-wrap">
              {resumeData.languages.map((lang, index) => (
                lang.name && (
                  <div key={index} className="mr-4 mb-2">
                    <span className="font-medium">{lang.name}:</span>
                    <span className="ml-1 text-gray-700">{lang.proficiency || "Proficient"}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;