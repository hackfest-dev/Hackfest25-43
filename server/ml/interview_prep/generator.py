import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Use your OpenRouter token and custom base URL
api_key = os.getenv("API_KEY")
if api_key is None:
    print("Error: API_KEY not found in the .env file.")
    exit()

print("API_KEY successfully loaded.")

# Configure OpenRouter
openai.api_key = api_key
openai.api_base = "https://openrouter.ai/api/v1"

# Function to generate interview question for different categories
def generate_question(skills, job_role, category, disability_type, location, salary):
    try:
        # Craft the system message based on inputs
        system_message = f"""
        You are a helpful assistant for AI-based interview preparation. 
        The user has the following details:
        - Job Role: {job_role}
        - Skills: {skills}
        - Disability Type: {disability_type}
        - Location: {location}
        - Expected Salary: {salary}
        """

        # Prepare the user message based on the category
        user_message = f"Generate a {category} interview question for the role of {job_role} that tests the skills of {skills}."
        
        if category == "technical":
            user_message += " The question should also be relevant to the job role and test the candidate's technical expertise."
        elif category == "behavioral":
            user_message += " The question should assess the candidate's problem-solving ability, leadership, and interpersonal skills."
        elif category == "general":
            user_message += " The question should test general knowledge or problem-solving ability."

        # Make the API call to OpenRouter
        response = openai.ChatCompletion.create(
            model="openai/gpt-3.5-turbo",  # Ensure you're using a valid model name for OpenRouter
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7
        )
        return response.choices[0].message['content']
    
    except Exception as e:
        return f"An error occurred: {e}"

# Example inputs (in a real-world scenario, these would come from the frontend)
scenario = {
    "skills": "Python, Machine Learning, Data Structures",
    "job_role": "Data Scientist",
    "category": "technical",  # This could be 'behavioral', 'general', or 'technical'
    "disability_type": "None",  # Example: 'None', 'Visual Impairment', etc.
    "location": "New York",
    "salary": "100000"
}

# Generate and print the interview question for the specified category
print(generate_question(
    skills=scenario["skills"],
    job_role=scenario["job_role"],
    category=scenario["category"],
    disability_type=scenario["disability_type"],
    location=scenario["location"],
    salary=scenario["salary"]
))
