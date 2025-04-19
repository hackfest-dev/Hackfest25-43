import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def evaluate_answer(question, answer):
    prompt = f"""
Evaluate the following answer to an interview question.

Question: {question}

Answer: {answer}

Provide:
1. A score out of 10
2. Feedback: strengths and areas to improve.
"""

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a strict but fair interview evaluator."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.6,
        max_tokens=250
    )

    return response.choices[0].message.content.strip()

# Demo usage
if __name__ == "__main__":
    q = "Explain how you handled a team conflict."
    a = "I once had a disagreement with a team member, so I..."
    print(evaluate_answer(q, a))
