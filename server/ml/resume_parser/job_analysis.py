
# from dotenv import load_dotenv
# import os
# import openai

# load_dotenv()
# openai.api_key = os.getenv("OPENAI_API_KEY")

# def extract_job_requirements(job_description: str) -> list:
#     if not openai.api_key:
#         raise EnvironmentError("❌ OPENAI_API_KEY not found in .env")

#     prompt = f"""
#     Extract the key skills, qualifications, and experience from the following job description.
#     Return them clearly as a bullet point list:\n\n{job_description}
#     """

#     try:
#         response = openai.ChatCompletion.create(
#             model="gpt-4-turbo",
#             messages=[
#                 {"role": "system", "content": "You extract clean, clear job requirements from descriptions."},
#                 {"role": "user", "content": prompt}
#             ],
#             temperature=0.5,
#         )

#         print("✅ OpenAI API response received.")

#         content = response['choices'][0]['message']['content']
#         print("🔎 Raw OpenAI response:\n", content)

#         # Parse bullet points into a Python list
#         lines = content.split('\n')
#         requirements = [line.lstrip("-• ").strip() for line in lines if line.strip()]

#         return requirements

#     except Exception as e:
#         print("❌ OpenAI API call failed:", str(e))

#         # Optional: fallback return for development
#         return [
#             "Leadership in maritime operations",
#             "Experience commanding crews",
#             "Recovery of naval assets",
#             "Skilled in diplomacy with pirates and sea entities",
#             "Familiarity with mythical sea creatures"
#         ]

#         # Or re-raise if you want the frontend to catch the error
#         # raise RuntimeError("OpenAI API error: " + str(e))


from dotenv import load_dotenv
import os
import openai

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def extract_job_requirements(job_description: str) -> list:
    if not openai.api_key:
        raise EnvironmentError("❌ OPENAI_API_KEY not found in .env")

    prompt = f"""
    Extract the key skills, qualifications, and experience from the following job description.
    Return them clearly as a bullet point list:\n\n{job_description}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo",
            messages=[
                {"role": "system", "content": "You extract clean, clear job requirements from descriptions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
        )

        content = response['choices'][0]['message']['content']
        lines = content.split('\n')
        requirements = [line.lstrip("-• ").strip() for line in lines if line.strip()]

        return requirements

    except Exception as e:
        print("❌ OpenAI API call failed:", str(e))
        # Return fallback list for dev
        return [
            "Leadership experience",
            "Team management",
            "Experience with software development",
            "Strong communication skills"
        ]
