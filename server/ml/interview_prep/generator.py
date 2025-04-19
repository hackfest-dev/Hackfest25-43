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

# Function to generate interview question
def generate_question(skills, job_role, category):
    try:
        response = openai.ChatCompletion.create(
            model="openai/gpt-3.5-turbo",  # Make sure to use model names supported by OpenRouter
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Generate a {category} interview question for the role of {job_role} that tests the skills of {skills}."}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"An error occurred: {e}"

# Sample input
scenario = {
    "skills": "Python, Machine Learning, Data Structures",
    "job_role": "Data Scientist",
    "category": "technical"
}

# Run it
print(generate_question(
    skills=scenario["skills"],
    job_role=scenario["job_role"],
    category=scenario["category"]
))
