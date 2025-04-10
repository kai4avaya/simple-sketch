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
        *   **Download Editable:** (Functionality TBD - currently placeholder)
        *   **Download View Only:** (Functionality TBD - currently placeholder)
        *   **Share Link:** Generate a unique URL containing the compressed drawing data (shapes + text). Opening this URL in another browser will load the shared drawing.
*   **Data Management:**
    *   **View/Edit Drawing Data ({ }):** View and edit the raw JSON data (shapes and editor content) for the current drawing in a modal.
    *   **Delete All (✖):** Clear the canvas, editor content, and the current session's saved state (prompts for confirmation).
*   **Undo/Redo:** Standard Ctrl+Z / Ctrl+Shift+Z (or Cmd+Z / Cmd+Shift+Z) for drawing actions.
*   **Tooltips:** Enhanced tooltips (via Tippy.js) for toolbar buttons provide immediate feedback.
*   **Preloading:** Option to define a `premadeSketch` in the code to automatically load specific shapes when the application starts with an empty canvas.

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
2.  **Canvas:** The drawing area overlays the text editor. Drawing actions are only active when a drawing tool, select, or erase mode is selected.
3.  **Editor:** Active when 'T' mode is selected. Text is automatically saved.

## Sharing Your Drawings

Scratchpad offers multiple ways to share your creations:

1. **Share Link:** Click on the Share (↗) button and select "Share Link" to generate a URL that contains your entire drawing (shapes and text) compressed into a URL parameter. When someone opens this link:
   * The drawing will automatically load in their browser
   * All shapes, positions, and text will be preserved exactly as you created them
   * They can continue editing from where you left off
   * No server or account is required - everything is embedded in the URL

2. **Image Export:** For a visual representation that can be shared anywhere, use the Download as Image (↧) button to create a PNG of your drawing.

3. **Download Options:** (Coming soon) The Share menu also contains options for downloading your drawing in various formats.

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