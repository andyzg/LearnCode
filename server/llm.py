import openai
import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
temperature = 0.5
max_tokens = 100
max_openai_calls_retries = 3
openai_calls_retried = 0

def complete(prompt):
    global openai_calls_retried
    messages=[{"role": "user", "content": prompt}]
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            n=1,
            stop=None,
        )
        openai_calls_retried = 0
        return response.choices[0].message.content.strip()
    except Exception as e:
        # try again
        if openai_calls_retried < max_openai_calls_retries:
            openai_calls_retried += 1
            print(f"Error calling OpenAI. Retrying {openai_calls_retried} of {max_openai_calls_retries}...")
            return complete(prompt)
