from fastapi import FastAPI
from pydantic import BaseModel
import syntax as Syntax
import task as Task
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Code(BaseModel):
    code: str
    language: str
    task: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/requestHint")
async def request_hint(payload: Code):
    hint = Task.request_hint(payload.task, payload.code)
    return {
        "payload": hint,
        "agent": "hint"
    }

@app.post("/analyzeCode")
async def analyze_code(code: Code):
    error = Syntax.validate_syntax(code.code)
    if error:
        message = Task.analyze_syntax_error(code.task, code.code, error)
        return {
            "payload": message,
            "agent": "syntax"
        }

    # Check for alignment
    message = Task.analyze_task_alignment(code.task, code.code)

    return {
        "payload": message,
        "agent": "alignment"
    }
