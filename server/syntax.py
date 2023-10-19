import ast, traceback

def validate_syntax(code: str) -> str | None:
    try:
        ast.parse(code)
    except SyntaxError as e:
        error_message = str(e)
        return error_message

    return None
