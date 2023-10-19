// @ts-nocheck
"use client";
import React, { useState } from "react";
import Editor from '@monaco-editor/react';

export default function Home() {
  const [value, setValue] = useState("# hello");
  const [hint, setHint] = useState("");
  const [analyzeCallback, setAnalyzeCallback] = useState(null);
  const [message, setMessage] = useState("");


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
        task: "Print out the exact text 'Hello world' case sensitive"
      })
    });

    // Parse body
    const body = await response.json();
    console.log(body);
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
        task: "Print out hello world"
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
      <div className="flex-fill">
        <Editor
          height="50vh"
          onChange={onChange}
          options={{
            quickSuggestions: false
          }}
          defaultLanguage="python"
          defaultValue={value} />
      </div>
      <div className="text-sm mt-2">
        {message}
      </div>
    </main>
  )
}
