// @ts-nocheck
"use client";
import React, { useState } from "react";
import Editor from '@monaco-editor/react';

export default function Home() {
  const [value, setValue] = useState("# hello");
  const [hint, setHint] = useState("");

  const onChange = (newValue, e) => {
    console.log('onChange', newValue, e);
    setValue(newValue);
  };

  const onValidate = async () => {
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
      <div className="text-sm mb-8"> {hint} </div>
      <div className="flex flex-row">
        <button onClick={onValidate} className="bg-gray-800 rounded-full text-sm font-medium p-2"> Validate </button>
        <button onClick={onRequestHint} className="bg-gray-800 rounded-full text-sm font-medium p-2 ml-4"> Get hint </button>
      </div>
      <br />
      <div className="flex-fill">
        <Editor
          height="90vh"
          onChange={onChange}
          options={{
            quickSuggestions: false
          }}
          defaultLanguage="python"
          defaultValue={value} />;
      </div>
    </main>
  )
}
