// @ts-nocheck
"use client";
import React, { useState } from "react";
import Editor from '@monaco-editor/react';

const TASK = "Write a program that prints out every integer from 1 to 100 on a separate line";

const SyntaxErrorComponent = (props) => {
  const { message, lineNumber } = props;
  console.log(props);

  const style = {
    top: `${((lineNumber - 1) * 18)}px`
  }

  return (
    <div className="absolute right-0 translate-x-8 text-xs w-96 bg-slate-200 p-2 text-gray-800 font-mono rounded-md" style={style}> Line {lineNumber}: {message} </div>
  );
};

export default function Home() {
  const [value, setValue] = useState("# hello");
  const [hint, setHint] = useState("");
  const [analyzeCallback, setAnalyzeCallback] = useState(null);
  const [message, setMessage] = useState("");
  const [syntaxError, setSyntaxError] = useState(null);


  const onChange = (newValue, e) => {
    console.log('onChange', newValue, e);
    setValue(newValue);

    // Set a timer for 2 seconds. If onChange hasn't been called in 2 seconds,
    // then send a request to the server to analyze the code.
    if (analyzeCallback) {
      clearTimeout(analyzeCallback);
    }

    setAnalyzeCallback(setTimeout(() => {
      clearTimeout(analyzeCallback);
      setAnalyzeCallback(null);
      onValidate(newValue);
    }, 2000));
  };

  const onValidate = async (value) => {
    // Send post request to localhost:8000/analyzeCode
    const response = await fetch('http://localhost:8000/analyzeCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: value,
        language: "python",
        task: TASK
      })
    });

    // Parse body
    const body = await response.json();
    console.log(body);
    if (body.agent === "syntax") {
      setSyntaxError(JSON.parse(body.payload));
      return;
    }

    const payload = JSON.parse(body.payload);
    if (payload.message === "success") {
      setMessage("Success! You have completed the task.");
    } else {
      setMessage(payload.message);
    }
  };

  const onRequestHint = async () => {
    const response = await fetch('http://localhost:8000/requestHint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: value,
        language: "python",
        task: TASK
      })
    });

    // Parse body
    const body = await response.json();
    const payload = JSON.parse(body.payload);

    console.log(body);
    setHint(payload.message);
  };

  return (
    <main className="flex flex-col p-24">
      <div className="mb-4">
        Task: {TASK}
      </div>
      {hint ? (
        <div className="bg-gray-600 rounded-md p-2 text-sm mb-8 flex-row flex">
          <div> {hint} </div>
          <button onClick={() => setHint("")} className="ml-4 rotate-45"> + </button>
        </div>
      ) : null}
      <div className="flex flex-row">
        <button onClick={onRequestHint} className="bg-gray-700 ease-in-out hover:bg-gray-800 rounded-full text-sm font-medium p-2"> Get hint </button>
      </div>
      <br />
      <div className="flex-fill relative pr-96">
        <Editor
          height="50vh"
          onChange={onChange}
          options={{
            quickSuggestions: false
          }}
          defaultLanguage="python"
          defaultValue={value} />
          {syntaxError ? (
            <SyntaxErrorComponent {...syntaxError} />
          ) : null}
      </div>
      <div className="text-sm mt-2">
        {message}
      </div>
    </main>
  )
}
