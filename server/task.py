import llm


def analyze_task_alignment(task, code):
    prompt = f"""
    # Objective
    Given the task below and the code attached, return a JSON object with the following fields:
    - status: "false" or "true"
    - message: "success" or the reason why the task was not accomplished
    - hint: a hint on what to chat about the code so that it accomplishes the task

    # Task: {task}
    # Code:
    {code}
    """
    response = llm.complete(prompt)

    print("Analyze task alignment response: ", response)

    return response

def analyze_syntax_error(task, code, syntax):
    prompt = f"""
    # Objective
    Given the task below and the code attached and  the syntax error attached, return a JSON object with the
    following fields:
    - message: an explanation for the syntax error and how to fix it
    - lineNumber: the line number where the syntax error is located
    - columnNumber: the column number where the syntax error is located

    # Task: {task}
    # Code:
    {code}

    # Syntax error:
    {syntax}
    """
    response = llm.complete(prompt)
    print("Analyze syntax error response: ", response)

    return response


def request_hint(task, code):
    prompt = f"""
    # Objective
    Given the task below and the code attached,
    help the user accomplish the task mentioned below. You will return a JSON
    payload with the following fields:

    - message: a hint that uses beginner friendly language to help the user
      accomplish the task

    # Task: {task}
    # Code:
    {code}

    Do NOT give away the answer. The user should have to think critically from
    the hint given to accomplish the task.

    Make sure the hint provided actually helps the user accomplish the task.
    """
    print(prompt)
    response = llm.complete(prompt)
    print("Request hint response: ", response)

    return response
