import React, { useEffect, useRef, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-okaidia.css";
import Actions from "../Actions";

const CodeEditor = ({ socketRef, roomId , onCodeChange }) => {
  const [code, setCode] = useState("// Start coding...\n");
  // const codeRef = useRef();
  const handleChange = (newCode) => {
    setCode(newCode);
    onCodeChange(newCode);
    if (!socketRef.current) return;
    socketRef.current.emit(Actions.CODE_CHANGE, { roomId, code: newCode });
  };

  // Listen for code changes from other clients
  useEffect(() => {
    if (!socketRef.current) return;
    const handleRemoteCode = ({ code: newCode }) => {
      setCode(newCode);
    };
    socketRef.current.on(Actions.CODE_CHANGE, handleRemoteCode);
    return () => {
      socketRef.current.off(Actions.CODE_CHANGE, handleRemoteCode);
    };
  }, [socketRef.current, code]);

  return (
<Editor
  // ref={codeRef}
  value={code}
  onValueChange={handleChange}
  highlight={(code) => Prism.highlight(code, Prism.languages.javascript, "javascript")}
  // highlight={(code) => Prism.highlight(code, Prism.languages.jsx, "jsx")}
  padding={10}
  style={{
    fontFamily: '"Fira Code", monospace',
    fontSize: 16,
    minHeight: "100vh",
  }}
/>

  );
};

export default CodeEditor;
