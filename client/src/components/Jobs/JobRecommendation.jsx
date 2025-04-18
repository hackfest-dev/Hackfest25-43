import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate
import { useJob } from "../../context/JobContext";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

// Constants moved outside component to reduce clutter
const jobImages = {
  "Software Engineer": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "Data Scientist": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "Marketing Manager": "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "Graphic Designer": "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "Project Manager": "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "Financial Analyst": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  "HR Specialist": "https://images.unsplash.com/photo-1565688534245-05d6b5be184a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  default: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
};

const categoryInfo = {
  "highly_matched": {
    title: "Perfect Matches For You",
    icon: "🎯",
    color: "from-indigo-600 to-cyan-500"
  },
  "jobs_after_courses": {
    title: "Jobs After Recommended Courses",
    icon: "🎓",
    color: "from-purple-600 to-blue-500"
  },
  "suggested_jobs": {
    title: "Other Suggested Opportunities",
    icon: "💡",
    color: "from-amber-500 to-orange-600"
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const JobRecommendation = () => {
  const { state } = useLocation();
  const navigate = useNavigate(); // Added navigate hook
  const { userData: locationUserData, recommendations: locationRecommendations } = state || {};
  const { currentUser } = useAuth();
  const { 
    jobRecommendations, setJobRecommendations, 
    jobsLoaded, setJobsLoaded,
    jobLoadingError, setJobLoadingError
  } = useJob();
  
  const [loading, setLoading] = useState(false);
  const [fetchingUserData, setFetchingUserData] = useState(false);
  const [userDataToUse, setUserDataToUse] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);
  const initialDataFetchedRef = useRef(false);

  // Fetch user data either from location state or Firestore
  useEffect(() => {
    const fetchUserDataFromFirestore = async () => {
      if (userDataToUse !== null) return;
      
      // Use location data if available
      if (locationUserData && Object.keys(locationUserData).length > 0) {
        setUserDataToUse(locationUserData);
        if (locationRecommendations) {
          const structuredRecommendations = {
            highly_matched: locationRecommendations.highly_matched || [],
            jobs_after_courses: locationRecommendations.jobs_after_courses || [],
            suggested_jobs: locationRecommendations.suggested_jobs || []
          };
          setJobRecommendations(structuredRecommendations);
          setJobsLoaded(true);
          initialDataFetchedRef.current = true;
        }
        return;
      }

      // Otherwise fetch from Firestore
      if (!currentUser) {
        setJobLoadingError("You must be logged in to view job recommendations");
        return;
      }

      setFetchingUserData(true);
      try {
        const userDocSnap = await getDoc(doc(db, "users", currentUser.uid));
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData && Object.keys(userData).length > 0) {
            setUserDataToUse(userData);
          } else {
            setJobLoadingError("Please complete your profile to get job recommendations");
          }
        } else {
          setJobLoadingError("User profile not found. Please complete your profile");
        }
      } catch (error) {
        setJobLoadingError("Failed to load your profile data. Please try again");
      } finally {
        setFetchingUserData(false);
      }
    };

    fetchUserDataFromFirestore();
  }, [currentUser, locationUserData, locationRecommendations, setJobRecommendations, setJobsLoaded, setJobLoadingError, userDataToUse]);

  // Fetching job recommendations
  const fetchJobRecommendations = useCallback(async () => {
    if (!userDataToUse || Object.keys(userDataToUse).length === 0) return;
    if (page === 1 && jobsLoaded && jobRecommendations.highly_matched.length > 0) return;
    if (page === 1 && initialDataFetchedRef.current) return;

    page === 1 ? setLoading(true) : setLoadingMore(true);
    setJobLoadingError(null);

    try {
      const response = await axios.post("http://127.0.0.1:5001/api/recommend_jobs", {
        ...userDataToUse,
        page,
        per_page: 6
      });

      if (response.data) {
        const newRecommendations = {
          highly_matched: page === 1
            ? response.data.highly_matched || []
            : [...jobRecommendations.highly_matched, ...(response.data.highly_matched || [])],
          jobs_after_courses: page === 1
            ? response.data.jobs_after_courses || []
            : [...jobRecommendations.jobs_after_courses, ...(response.data.jobs_after_courses || [])],
          suggested_jobs: page === 1
            ? response.data.suggested_jobs || []
            : [...jobRecommendations.suggested_jobs, ...(response.data.suggested_jobs || [])]
        };

        setJobRecommendations(newRecommendations);
        setHasMore(response.data.has_more === true);
        if (page === 1) {
          setJobsLoaded(true);
          initialDataFetchedRef.current = true;
        }
      }
    } catch (error) {
      setJobLoadingError(`Failed to fetch job recommendations: ${error.message}`);
    } finally {
      page === 1 ? setLoading(false) : setLoadingMore(false);
    }
  }, [userDataToUse, page, jobsLoaded, jobRecommendations, setJobRecommendations, setJobsLoaded, setJobLoadingError]);

  // Trigger job fetch when conditions are met
  useEffect(() => {
    if (userDataToUse && Object.keys(userDataToUse).length > 0) {
      if ((page === 1 && !jobsLoaded) || page > 1) {
        fetchJobRecommendations();
      }
    }
  }, [fetchJobRecommendations, userDataToUse, page, jobsLoaded]);

  // Infinite scrolling observer
  useEffect(() => {
    const currentObserverRef = loadMoreRef.current;
    
    if (!currentObserverRef || !hasMore || loading || loadingMore || !jobsLoaded) {
      return;
    }
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 } 
    );

    observer.observe(currentObserverRef);
    return () => currentObserverRef && observer.unobserve(currentObserverRef);
  }, [hasMore, loading, loadingMore, jobsLoaded]);

  // Handle job details button click
  const handleViewDetails = (job) => {
    // Navigate to job details page with job data
    navigate('/job-details', {
      state: {
        job,
        userData: userDataToUse
      }
    });
  };

  // Component for loading indicator
  const LoadingIndicator = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  // Component for decorative elements
  const DecorativeElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          animate={{ y: [0, Math.random() * 10 - 5], x: [0, Math.random() * 10 - 5] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
      
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
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4 + Math.random() * 3, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

export default JobRecommendation;