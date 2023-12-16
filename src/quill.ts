import Quill from "quill";
import "quill/dist/quill.snow.css";
import { socket } from "./socket";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="editor-wrapper">
    <h1>Zapiski</h1>
    <div id="editor"></div>
  </div>
`;

const quill = new Quill("#editor", {
  theme: "snow",
});

const storedContent = localStorage.getItem("note");
if (storedContent) {
  quill.clipboard.dangerouslyPasteHTML(storedContent, "silent");
}

quill.on("text-change", (_delta, _oldDelta, source) => {
  if (source === "user") {
    const content = quill.root.innerHTML;
    socket.emit("editor-changes", content);
  }
});

socket.on("editor-changes", (content) => {
  console.log("Received editor changes:", content);

  localStorage.setItem("note", content);

  quill.clipboard.dangerouslyPasteHTML(content, "silent");
});
