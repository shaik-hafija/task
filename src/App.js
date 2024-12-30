import './App.css';

import React, { useState, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";

function App() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    const savedData = localStorage.getItem("editorContent");
    if (savedData) {
      const contentState = convertFromRaw(JSON.parse(savedData));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContent));
    alert("Content saved!");
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleBeforeInput = (chars) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const block = currentContent.getBlockForKey(selection.getStartKey());
    const blockText = block.getText();

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

  const styleMap = {
    RED: { color: "red" },
    UNDERLINE: { textDecoration: "underline" },
  };

  return (
    <div className="editor-container">
      <header className="header">
        <h2 className="title">Demo Editor by Hafija</h2>
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </header>
      <div className="editor-wrapper">
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
