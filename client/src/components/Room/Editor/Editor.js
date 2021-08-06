import { useEffect } from "react";

import { Controlled as ControlledEditor } from "react-codemirror2";
import "codemirror/mode/python/python";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/clike/clike";
import "codemirror/lib/codemirror.css";

import "codemirror/theme/3024-day.css";
import "codemirror/theme/3024-night.css";
import "codemirror/theme/abbott.css";
import "codemirror/theme/abcdef.css";
import "codemirror/theme/ambiance-mobile.css";
import "codemirror/theme/ambiance.css";
import "codemirror/theme/ayu-dark.css";
import "codemirror/theme/ayu-mirage.css";
import "codemirror/theme/base16-dark.css";
import "codemirror/theme/base16-light.css";
import "codemirror/theme/bespin.css";
import "codemirror/theme/blackboard.css";
import "codemirror/theme/cobalt.css";
import "codemirror/theme/colorforth.css";
import "codemirror/theme/darcula.css";
import "codemirror/theme/dracula.css";
import "codemirror/theme/duotone-dark.css";
import "codemirror/theme/duotone-light.css";
import "codemirror/theme/eclipse.css";
import "codemirror/theme/elegant.css";
import "codemirror/theme/erlang-dark.css";
import "codemirror/theme/gruvbox-dark.css";
import "codemirror/theme/hopscotch.css";
import "codemirror/theme/icecoder.css";
import "codemirror/theme/idea.css";
import "codemirror/theme/isotope.css";
import "codemirror/theme/juejin.css";
import "codemirror/theme/lesser-dark.css";
import "codemirror/theme/liquibyte.css";
import "codemirror/theme/lucario.css";
import "codemirror/theme/material-darker.css";
import "codemirror/theme/material-ocean.css";
import "codemirror/theme/material-palenight.css";
import "codemirror/theme/material.css";
import "codemirror/theme/mbo.css";
import "codemirror/theme/mdn-like.css";
import "codemirror/theme/midnight.css";
import "codemirror/theme/monokai.css";
import "codemirror/theme/moxer.css";
import "codemirror/theme/neat.css";
import "codemirror/theme/neo.css";
import "codemirror/theme/night.css";
import "codemirror/theme/nord.css";
import "codemirror/theme/oceanic-next.css";
import "codemirror/theme/panda-syntax.css";
import "codemirror/theme/paraiso-dark.css";
import "codemirror/theme/paraiso-light.css";
import "codemirror/theme/pastel-on-dark.css";
import "codemirror/theme/railscasts.css";
import "codemirror/theme/rubyblue.css";
import "codemirror/theme/seti.css";
import "codemirror/theme/shadowfox.css";
import "codemirror/theme/solarized.css";
import "codemirror/theme/ssms.css";
import "codemirror/theme/the-matrix.css";
import "codemirror/theme/tomorrow-night-bright.css";
import "codemirror/theme/tomorrow-night-eighties.css";
import "codemirror/theme/ttcn.css";
import "codemirror/theme/twilight.css";
import "codemirror/theme/vibrant-ink.css";
import "codemirror/theme/xq-dark.css";
import "codemirror/theme/xq-light.css";
import "codemirror/theme/yeti.css";
import "codemirror/theme/yonce.css";
import "codemirror/theme/zenburn.css";

import "./editor.scss";

import { useContext } from "react";
import { Context } from "../../../context/Context";

const Editor = ({ roomID }) => {
  // We need the following from the Context: value, setCode, language, setLanguage, socket
  const { socket, code, setCode, language, theme } = useContext(Context);

  // Receive changes on the code from the server
  useEffect(() => {
    if (socket == null) return;

    socket.on("receive-changes-code", setCode);

    return () => {
      socket.off("receive-changes", setCode);
    };
  }, [socket]);

  // Get the document in the database once the page loads
  useEffect(() => {
    if (socket == null) return;

    socket.once("load-code-document", (code) => {
      setCode(code);
    });

    socket.emit("join-editor", roomID);
  }, [socket, roomID]);

  // Handlers
  const handleChange = (editor, data, code) => {
    setCode(code);
    socket.emit("send-changes-code", code);
  };

  const handleSave = (instance) => {
    socket.emit("save-code-document", code);
  };

  const modeChoice = (lang) => {
    switch (lang) {
      case "C":
      case "C++":
      case "C#":
      case "Java":
        return "clike";

      default:
        return lang.toLowerCase();
    }
  };

  return (
    // <div className="editor-container">
    <ControlledEditor
      className="code-mirror-wrapper"
      onBeforeChange={handleChange}
      value={code}
      options={{
        lineWrapping: true,
        lint: true,
        mode: modeChoice(language),
        theme,
        lineNumbers: true,
        extraKeys: {
          "Ctrl-S": handleSave,
        },
      }}
    />
    // </div>
  );
};

export default Editor;
