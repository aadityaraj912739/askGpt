# VS Code-like Code Preview (Monaco)

This is a small standalone preview that uses the Monaco editor (the core editor that powers VS Code) to render code with identical syntax coloring and themes.

Files added:
- `code_preview_monaco.html` — open this file in a browser to see code rendered like VS Code. It's read-only by default and uses the `vs-dark` theme.
 - `code_preview_monaco.html` — open this file in a browser to see code rendered like VS Code. It's read-only by default and uses the `vs-dark` theme.

Prism integration in the React app:
- The project already uses Prism for client-side syntax highlighting. I updated `client/src/components/MessageBubble.jsx` to:
	- detect more flexible fenced code blocks (e.g. ```ts, ```py, ```c++)
	- normalize common language aliases (ts → typescript, py → python)
	- import Prism's Python language component so Python highlights correctly

Where code appears:
- The `MessageBubble` component (used by the Chat page) will render fenced code blocks as VS Code-styled code blocks using the styles in `client/src/index.css`.

If you want me to further integrate a full-screen Monaco view on click (open code in an editor), I can add a modal that mounts the Monaco editor for an editable, full-featured experience.

How to use:
1. Open `code_preview_monaco.html` in your browser (double-click or open via a local server).
2. Use the "Toggle Theme" button to switch between `vs-dark` and `vs` (light) themes.
3. Use the "Copy" button to copy the displayed code to the clipboard.

Notes and alternatives:
- This uses the Monaco CDN (cdnjs) for convenience. For production or offline use, install `monaco-editor` locally and bundle it with your app.
- If you want static HTML/CSS coloring only, consider Prism.js or Highlight.js with a VS Code-like theme.
- To embed Monaco inside your React app (client/), you can use the `@monaco-editor/react` package. I can implement that into your `client` app if you'd like — tell me where you'd prefer it shown (Chat page, a new preview route, etc.).

Next steps I can take for you:
- Embed Monaco into the React frontend (`client/src`) and replace the current message rendering when "AskGPT is writing code".
- Add a lightweight CSS-only renderer using Prism with a VS Code theme for faster load times.
- Bundle Monaco locally and preload themes for offline usage.

Tell me which option you'd like and I'll implement it into the project directly.

Monaco integration notes:

- The React app dynamically imports `@monaco-editor/react` when available. If the package is not installed, the app gracefully falls back to the Prism-based renderer.
- To enable the full VS Code-like in-app preview, install the package in the `client` folder:

```powershell
cd client
npm install @monaco-editor/react monaco-editor
```

After installing, restart the dev server and code messages will render using the Monaco editor with `vs-dark` theme and read-only mode by default.