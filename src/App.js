import './App.css';

import React, { useState, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";

function App() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  // Load saved content from localStorage on page load
  useEffect(() => {
    const savedData = localStorage.getItem("editorContent");
    if (savedData) {
      const contentState = convertFromRaw(JSON.parse(savedData));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  // Save content to localStorage
  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    alert("Content saved!");
  };

  // Handle custom key commands for formatting
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  // Handle custom logic for '#' and '*'
  const handleBeforeInput = (chars) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = currentContent.getBlockForKey(selection.getStartKey());
    const blockText = block.getText();

    // Logic for formatting
    if (blockText === "#" && chars === " ") {
      setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
      return "handled";
    }
    if (blockText === "*" && chars === " ") {
      setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
      return "handled";
    }
    if (blockText === "**" && chars === " ") {
      setEditorState(RichUtils.toggleInlineStyle(editorState, "RED"));
      return "handled";
    }
    if (blockText === "***" && chars === " ") {
      setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
      return "handled";
    }
    return "not-handled";
  };

  // Map custom inline styles
  const styleMap = {
    RED: { color: "red" },
    UNDERLINE: { textDecoration: "underline" },
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2 style={{textAlign:"center"}}>Demo Editor by YourName</h2>
      <button onClick={handleSave} style={{ marginBottom: "10px" }}>
        Save
      </button>
      <div style={{ border: "1px solid #ccc", minHeight: "300px", padding: "10px" }}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          handleBeforeInput={handleBeforeInput}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
}

export default App;
