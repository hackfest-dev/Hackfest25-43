import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const skillsCategories = {
  "Technical Skills": ["Deep Learning", "Python", "Java", "JavaScript", "TensorFlow", "Machine Learning", "UI/UX", "Network Security", "AutoCAD", "Illustrator", "Photoshop"],
  "Soft Skills": ["Public Speaking", "Negotiation", "Team Management", "Communication", "Conflict Resolution", "Motivation"],
  "Marketing & Writing": ["Content Writing", "SEO", "Copywriting", "Google Analytics", "Branding", "Sales Strategy", "Keyword Research"],
  "Finance & Business": ["Budgeting", "Financial Modeling", "Project Management", "Risk Management", "Payroll Management", "Case Analysis"],
  "Medical & Health": ["Medical Knowledge", "Patient Consultation", "First Aid", "Nutrition", "Exercise Science", "Mental Health Support", "Therapy"],
};

// Variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const Step2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const previousState = location.state || {};

  const [selectedSkills, setSelectedSkills] = useState(previousState.skills || []);
  const isEditing = previousState.fromReview || false;

  useEffect(() => {
    if (previousState.skills) {
      setSelectedSkills(previousState.skills);
    }
  }, [previousState.skills]);

  const handleSelection = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((item) => item !== skill) : [...prev, skill]
    );
  };

  const handleClear = () => setSelectedSkills([]);

  const handleNext = () => {
    navigate(isEditing ? "/get-started/step6" : "/get-started/step3", {
      state: {
        ...previousState,
        skills: selectedSkills,
        fromReview: isEditing,
      },
    });
  };

  // Decorative elements component - matches Landing page
  const DecorativeElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Bubbles matching Landing page style */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="absolute bg-gradient-to-r from-purple-600 to-blue-500 opacity-20 rounded-full"
          style={{ 
            width: `${Math.floor(Math.random() * 8) + 3}rem`,
            height: `${Math.floor(Math.random() * 8) + 3}rem`,
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%` 
          }}
          initial={{ opacity: 0.2 }}
          animate={{
            y: [0, Math.random() * 10 - 5],
            x: [0, Math.random() * 10 - 5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
      
      {/* Lines with animation */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-0.5 bg-gradient-to-r from-purple-600 to-blue-500 opacity-30"
          style={{ 
            width: `${Math.random() * 10 + 5}rem`,
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            transform: `rotate(${Math.random() * 360}deg)` 
          }}
          initial={{ opacity: 0.3 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-blue-50 px-6 py-12">
      {/* Background decorative elements */}
      <DecorativeElements />
      
      {/* Main Content */}
      <motion.div 
        className="w-full max-w-2xl bg-white rounded-xl shadow-xl relative z-10 overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header with gradient similar to Landing */}
        <motion.div 
          className="bg-gradient-to-r from-purple-600 to-blue-500 py-6 px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isEditing ? "Edit Skills" : "Step 2: Select Your Skills"}
          </motion.h2>
          <motion.p
            className="text-blue-100 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Help us match you with the right opportunities
          </motion.p>
        </motion.div>

        <div className="p-8">
          {/* Previous disabilities display */}
          {previousState.disabilities && previousState.disabilities.length > 0 && (
            <motion.div 
              className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Selected Disabilities:</h3>
              <div className="flex flex-wrap gap-2">
                {previousState.disabilities.map(disability => (
                  <motion.span 
                    key={disability}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {disability}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Selected skills display */}
          {selectedSkills.length > 0 && (
            <motion.div 
              className="mb-6 bg-purple-50 border border-purple-200 p-4 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-purple-700 mb-2">Selected Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map(skill => (
                  <motion.span 
                    key={skill}
                    className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-sm rounded-full flex items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {skill}
                    <button 
                      onClick={() => handleSelection(skill)} 
                      className="ml-2 w-4 h-4 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50"
                    >
                      <span className="text-xs">×</span>
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Skills categories */}
          <motion.div 
            className="max-h-96 overflow-auto pr-2 mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Object.entries(skillsCategories).map(([category, skills], index) => (
              <motion.div 
                key={category} 
                className="mb-6"
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center mb-3">
                  <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-800">{category}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skills.map((skill) => (
                    <motion.label 
                      key={skill} 
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedSkills.includes(skill)
                          ? "bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300"
                          : "bg-gray-100 hover:bg-gray-200 border-2 border-transparent"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="checkbox"
                        value={skill}
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSelection(skill)}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 mr-3"
                      />
                      <span className="text-gray-800">{skill}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Buttons */}
          <motion.div 
            className="flex justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.button
              onClick={handleClear}
              disabled={!selectedSkills.length}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedSkills.length 
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              whileHover={selectedSkills.length ? { scale: 1.05 } : {}}
              whileTap={selectedSkills.length ? { scale: 0.95 } : {}}
            >
              Clear Selection
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={!selectedSkills.length}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                selectedSkills.length 
                  ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md hover:shadow-lg" 
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              whileHover={selectedSkills.length ? { scale: 1.05, y: -2 } : {}}
              whileTap={selectedSkills.length ? { scale: 0.97 } : {}}
            >
              {isEditing ? "Save Changes" : "Continue →"}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Step2;