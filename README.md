# Scratchpad - Code & Canvas Editor

## Description

Scratchpad is a versatile web-based application that combines a powerful text editor (powered by CodeMirror) with a feature-rich canvas drawing tool. It allows users to seamlessly switch between writing code or notes and creating visual diagrams, sketches, or annotations directly over the text editor. Drawings and text content are persisted locally in the browser, and users can save, load, and share their creations.

## Features

*   **Dual Mode Interface:**
    *   **Write Mode:** A fully functional CodeMirror editor with syntax highlighting (Markdown default), line numbers, and local storage persistence.
    *   **Drawing Modes:** Overlay canvas for drawing various shapes and freehand sketches on top of the editor content.
*   **Drawing Tools:**
    *   Freehand Drawing (✐)
    *   Square (▢)
    *   Circle (◯)
    *   Line (—)
    *   Arrow (➜)
*   **Shape Manipulation:**
    *   Select/Move/Resize (⬚): Select single or multiple shapes, move them around.
    *   Add Text to Shapes: Double-click any shape to add/edit associated text. Text wraps within the shape boundaries.
    *   Delete Selected Shapes (⌫ or Delete/Backspace key).
*   **Eraser Tool (⌫):** Erase parts of shapes or entire shapes.
*   **Persistence:**
    *   **Text:** Automatically saved to browser's LocalStorage.
    *   **Shapes:** Automatically saved to browser's IndexedDB for the current session.
*   **Saving & History:**
    *   **Save Current Drawing (⊞):** Save the current combination of shapes and text content to a persistent history within IndexedDB.
    *   **View Saved Drawings (☰):** Browse, load, or delete previously saved drawings from a modal gallery.
*   **Export & Sharing:**
    *   **Download as Image (↧):** Capture the current view (editor content + canvas drawings) as a PNG image.
    *   **Share Menu (↗):**
        *   **Download Editable:** Download an HTML file with your drawing embedded that can be edited.
        *   **Share View Only Link:** Generate a URL that opens your drawing in view-only mode.
        *   **Share Editable Link:** Generate a URL that opens your drawing in editable mode.
*   **Data Management:**
    *   **View/Edit Drawing Data ({ }):** View and edit the raw JSON data (shapes and editor content) for the current drawing in a modal.
    *   **Delete All (✖):** Clear the canvas, editor content, and the current session's saved state (prompts for confirmation).
*   **Undo/Redo:** Standard Ctrl+Z / Ctrl+Shift+Z (or Cmd+Z / Cmd+Shift+Z) for drawing actions.
*   **Tooltips:** Enhanced tooltips (via Tippy.js) for toolbar buttons provide immediate feedback.
*   **Preloading:** Option to define a `premadeSketch` in the code to automatically load specific shapes when the application starts with an empty canvas.
*   **AI Generation (✰):** Generate shapes using AI models via OpenRouter API. Configure your own model, API key, and prompts.

## Setup

No installation is required. Simply open the `index.html` file in a modern web browser that supports IndexedDB, Canvas, and ES6 features.

## Usage

1.  **Toolbar:** Use the toolbar buttons at the top to switch between modes:
    *   **T (Write):** Edit text in the CodeMirror editor.
    *   **Drawing Tools (✐, ▢, ◯, —, ➜):** Select a tool and click-drag on the canvas area to draw.
    *   **⬚ (Select):** Click on shape borders to select them, or click-drag on empty space to create a selection rectangle for multiple shapes. Click and drag selected shapes to move them. Double-click a shape to add/edit text.
    *   **⌫ (Erase):** Click-drag over shapes to erase them.
    *   **↧ (Download Image):** Download the current view as a PNG.
    *   **⊞ (Save Drawing):** Save the current state (shapes + text) to the history.
    *   **☰ (History):** Open the saved drawings gallery.
    *   **{ } (Code View):** View/edit the underlying JSON data.
    *   **✖ (Delete All):** Clear everything.
    *   **↗ (Share):** Access download and sharing options.
    *   **✰ (AI Generate):** Open the AI generation modal to create shapes using AI.
2.  **Canvas:** The drawing area overlays the text editor. Drawing actions are only active when a drawing tool, select, or erase mode is selected.
3.  **Editor:** Active when 'T' mode is selected. Text is automatically saved.

## Sharing Your Drawings

Scratchpad offers multiple ways to share your creations:

1. **Share Editable Link:** Click on the Share (↗) button and select "Share Editable Link" to generate a URL that contains your entire drawing (shapes and text) compressed into a URL parameter. When someone opens this link:
   * The drawing will automatically load in their browser
   * All shapes, positions, and text will be preserved exactly as you created them
   * They can continue editing from where you left off
   * No server or account is required - everything is embedded in the URL

2. **Share View Only Link:** Click on the Share (↗) button and select "Share View Only Link" to generate a URL that opens your drawing in view-only mode:
   * The drawing will load with all shapes and text preserved
   * The toolbar will be hidden except for the share button
   * The editor will be read-only
   * The canvas will be non-interactive
   * Perfect for sharing with others who should only view, not edit

3. **Download Options:** The Share menu also contains options for downloading your drawing as an HTML file that can be opened locally.

4. **Image Export:** For a visual representation that can be shared anywhere, use the Download as Image (↧) button to create a PNG of your drawing.

## AI Generation

Scratchpad includes an AI generation feature that can create shapes based on your description:

1. **Access AI Generation:** Click the ✰ button in the toolbar to open the AI generation modal.

2. **Configure Settings:**
   * **Model:** Select an AI model from OpenRouter (default: google/gemini-2.5-pro-exp-03-25:free)
   * **API Key:** Enter your OpenRouter API key
   * **Save Settings:** Check this to save your settings in localStorage

3. **Customize Prompts:**
   * **System Prompt:** The default prompt instructs the AI to generate shape data structures
   * **User Request:** Describe what you want to create (e.g., "a diagram showing how AI works")

4. **Generate and Apply:**
   * Click "Send Request" to generate shapes based on your description
   * Review the generated JSON in the response editor
   * Click "Apply Generated Shapes" to add the shapes to your canvas

## Programmatic Drawing Manipulation

The Code View modal ({ }) provides a powerful way to inspect, modify, or programmatically create drawings:

1. **Access the Code View:** Click the { } button in the toolbar to open the modal.

2. **Structure of the Data:**
   ```json
   {
     "shapes": [
       {
         "type": "square",
         "x": 100,
         "y": 100,
         "width": 200,
         "height": 150,
         "text": "Example Square"
       },
       {
         "type": "circle",
         "x": 350,
         "y": 200,
         "radius": 75,
         "text": "Example Circle"
       },
       {
         "type": "arrow",
         "startX": 200,
         "startY": 300,
         "endX": 400,
         "endY": 300,
         "text": "Connection"
       },
       {
         "type": "line",
         "startX": 100,
         "startY": 400,
         "endX": 300,
         "endY": 400
       },
       {
         "type": "draw",
         "points": [
           {"x": 500, "y": 100},
           {"x": 550, "y": 150},
           {"x": 600, "y": 100}
         ],
         "text": "Freehand"
       }
     ],
     "editorContent": "Text content from the editor"
   }
   ```

3. **Programmatic Updates:**
   * Edit any property to adjust shapes (positions, sizes, text)
   * Add new shapes by following the object structure
   * Completely replace the drawing by pasting in new JSON data
   * Script the generation of complex diagrams by building the JSON programmatically
   * Share drawing templates as JSON snippets

4. **Apply Changes:** After editing, click "Apply Changes" to update the drawing with your modifications.

This provides a powerful interface for developers to create, modify or script drawings without manual drawing.

## Persistence Explained

*   **Live Text:** The content within the CodeMirror editor is saved to `LocalStorage` on every change. It will be reloaded automatically when you reopen the page in the same browser.
*   **Live Shapes:** The shapes currently on the canvas are saved to `IndexedDB` ("ScratchpadDB" -> "shapes" store) whenever a shape is added, modified, or deleted. This ensures your current drawing isn't lost on refresh.
*   **Saved Drawings:** When you click the "Save Current Drawing" button (⊞) and provide a name, a snapshot of the current shapes *and* the current editor text is saved as a separate entry in `IndexedDB` ("ScratchpadDB" -> "savedDrawings" store). These are persistent until explicitly deleted via the History modal.

## Customization

You can preload the canvas with specific shapes by modifying the `premadeSketch` array within the `<script>` tag in `index.html`. This is useful for creating default templates or examples that appear when a user first opens the application. 


-------------

# Show HN: Scratchpad - HTML Canvas Drawing and AI Generation

I've built a web-based application that combines a code editor with a canvas drawing tool, allowing you to seamlessly switch between writing code/notes and creating visual diagrams. It's all client-side with no server required.

**Key features:**
- Dual-mode interface: Write in the editor or draw on the canvas
- Drawing tools: Freehand, squares, circles, lines, arrows
- Shape manipulation: Select, move, resize, add text
- Local persistence: Everything saves automatically to your browser
- Share functionality: Generate URLs that embed your entire drawing
- AI generation: Create shapes using AI models via OpenRouter API
- No installation: Just open the HTML file in a browser

**Technical highlights:**
- Built with vanilla JavaScript (no frameworks)
- Uses CodeMirror for the editor and Canvas API for drawing
- IndexedDB for shape storage and LocalStorage for text
- Compressed URL sharing with base64 encoding
- AI integration with customizable prompts

The app is perfect for creating diagrams with explanatory text, sketching UI ideas, or taking visual notes while coding.

Try it out: [GitHub Repository](https://github.com/yourusername/scratchpad)

Would love feedback on the UI/UX and any feature suggestions!
