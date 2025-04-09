/**
 * share.js - Handles share functionality for the canvas sketcher app
 */

// Share functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Share.js loaded');
    // Get share buttons
    const shareEditableBtn = document.getElementById('share-editable');
    const shareViewOnlyBtn = document.getElementById('share-view-only');
    const shareBtn = document.getElementById('share-btn');
    
    console.log('Share buttons found:', !!shareEditableBtn, !!shareViewOnlyBtn, !!shareBtn);

    // Add event listeners
    if (shareEditableBtn) {
        shareEditableBtn.addEventListener('click', function() {
            console.log('Share editable clicked');
            shareDrawing(false);
        });
    }

    if (shareViewOnlyBtn) {
        shareViewOnlyBtn.addEventListener('click', function() {
            console.log('Share view-only clicked');
            shareDrawing(true);
        });
    }
});

/**
 * Shares the drawing by downloading an HTML file with the current drawing state
 * @param {boolean} viewOnly - Whether to make the shared version view-only
 */
function shareDrawing(viewOnly) {
    console.log('Sharing drawing, view-only:', viewOnly);
    
    // Get current shapes from the global shapes array with better fallback
    let currentShapes = [];
    
    // Try multiple ways to access the shapes to ensure we get them
    if (window.shapes && window.shapes.length > 0) {
        console.log('Using window.shapes with length:', window.shapes.length);
        currentShapes = window.shapes;
    } else if (typeof shapes !== 'undefined' && shapes.length > 0) {
        console.log('Using global shapes variable with length:', shapes.length);
        currentShapes = shapes;
    } else {
        console.warn('No shapes found in global scope, attempting to retrieve from IndexedDB');
        
        // Try to get shapes from IndexedDB directly if available
        if (window.db) {
            const getShapesPromise = new Promise((resolve) => {
                const transaction = window.db.transaction("shapes", "readonly");
                const store = transaction.objectStore("shapes");
                const request = store.getAll();
                
                request.onsuccess = function(event) {
                    const dbShapes = event.target.result || [];
                    console.log('Retrieved shapes from IndexedDB:', dbShapes.length);
                    resolve(dbShapes);
                };
                
                request.onerror = function() {
                    console.error('Error retrieving shapes from IndexedDB');
                    resolve([]);
                };
                
                // Add a timeout in case the DB request hangs
                setTimeout(() => resolve([]), 1000);
            });
            
            // Get HTML content and wait for shapes from IndexedDB
            return Promise.all([
                fetch(window.location.href),
                getShapesPromise
            ]).then(([response, dbShapes]) => {
                return response.text().then(htmlContent => {
                    console.log('Processing with shapes from IndexedDB, count:', dbShapes.length);
                    return { htmlContent, shapes: dbShapes };
                });
            }).then(({ htmlContent, shapes }) => {
                // Get current editor content
                const editorContent = window.editor ? window.editor.getValue() : '';
                
                // Create modified HTML content
                let modifiedHtml = createModifiedHtml(
                    htmlContent, 
                    shapes, 
                    editorContent, 
                    viewOnly
                );
                
                // Download the modified HTML file
                downloadHtmlFile(modifiedHtml, viewOnly);
            }).catch(error => {
                console.error("Error sharing drawing:", error);
                alert("Error creating shareable version. Please try again.");
            });
        }
    }
    
    console.log('Final shapes for export:', currentShapes.length, currentShapes);
    
    // Get current HTML content with the standard flow
    fetch(window.location.href)
        .then(response => response.text())
        .then(htmlContent => {
            // Get current editor content
            const editorContent = window.editor ? window.editor.getValue() : '';
            
            // Create modified HTML content
            let modifiedHtml = createModifiedHtml(
                htmlContent, 
                currentShapes, 
                editorContent, 
                viewOnly
            );
            
            // Download the modified HTML file
            downloadHtmlFile(modifiedHtml, viewOnly);
        })
        .catch(error => {
            console.error("Error fetching HTML:", error);
            alert("Error creating shareable version. Please try again.");
        });
}

/**
 * Creates a modified HTML file with the current drawing embedded
 * @param {string} htmlContent - Original HTML content
 * @param {Array} shapes - Array of shape objects
 * @param {string} editorContent - CodeMirror editor content
 * @param {boolean} viewOnly - Whether to make the shared version view-only
 * @returns {string} Modified HTML content
 */
function createModifiedHtml(htmlContent, shapes, editorContent, viewOnly) {
    console.log('Creating modified HTML with', shapes.length, 'shapes');
    
    // Early validation - if no shapes, add debug info to console
    if (!shapes || shapes.length === 0) {
        console.warn('Warning: No shapes to export!');
        console.trace('Call stack for empty shapes');
    }
    
    // Create a deep copy of shapes without ids
    const shapesForExport = JSON.parse(JSON.stringify(shapes)).map(shape => {
        delete shape.id;
        return shape;
    });
    
    // Format the shapes array content as JSON string with explicit indentation
    const shapesArrayString = JSON.stringify(shapesForExport, null, 2);
    console.log('Formatted shapes array string length:', shapesArrayString.length);
    
    let newHtml = htmlContent;
    let shapesInserted = false;
    
    // Try with several patterns to find the premadeSketch array
    // Pattern 1: Standard declaration with any content
    const standardPattern = /(const\s+premadeSketch\s*=\s*)\[[\s\S]*?\];/;
    // Pattern 2: More permissive with comments
    const permissivePattern = /(const\s+premadeSketch\s*=\s*)\[(\s|\/\/[^\n]*\n)*\];/;
    
    // Try the first pattern
    if (standardPattern.test(htmlContent)) {
        console.log('Found standard premadeSketch array declaration');
        newHtml = htmlContent.replace(standardPattern, `$1${shapesArrayString};`);
        shapesInserted = true;
    } 
    // Try the second pattern if first didn't match
    else if (permissivePattern.test(htmlContent)) {
        console.log('Found permissive premadeSketch array declaration');
        newHtml = htmlContent.replace(permissivePattern, `$1${shapesArrayString};`);
        shapesInserted = true;
    }
    // If neither pattern matched, try to insert at specific locations
    else {
        console.log('No existing premadeSketch array found, trying to insert one');
        
        // Try to find the script section that declares the openDB function
        const openDBPattern = /openDB\(\)\.then\(/;
        if (openDBPattern.test(htmlContent)) {
            console.log('Found openDB function, inserting before it');
            newHtml = htmlContent.replace(
                openDBPattern, 
                `// Inserted premadeSketch for shared version\nconst premadeSketch = ${shapesArrayString};\n\n    openDB().then(`
            );
            shapesInserted = true;
        }
        
        // If still not inserted, try to add before the closing script tag
        if (!shapesInserted) {
            const scriptEndPattern = /\s*<\/script>\s*\s*<script src="js\/share\.js"><\/script>/;
            if (scriptEndPattern.test(htmlContent)) {
                console.log('Found main script end, inserting before it');
                newHtml = htmlContent.replace(
                    scriptEndPattern,
                    `\n  // Inserted premadeSketch for shared version\n  const premadeSketch = ${shapesArrayString};\n  <\/script>\n  <script src="js/share.js"><\/script>`
                );
                shapesInserted = true;
            }
        }
        
        // Last resort - insert just before body end
        if (!shapesInserted) {
            console.log('Using fallback insertion before </body>');
            newHtml = htmlContent.replace(
                '</body>',
                `<script>\n  // Inserted premadeSketch for shared version\n  const premadeSketch = ${shapesArrayString};\n<\/script>\n</body>`
            );
            shapesInserted = true;
        }
    }
    
    if (!shapesInserted) {
        console.error('Failed to insert premadeSketch array into the HTML');
        alert('Warning: Could not properly integrate shapes into the shared file. The drawing may not appear correctly.');
    } else {
        console.log('Successfully inserted shapes into premadeSketch array');
    }
    
    // Set the CodeMirror initial content
    if (editorContent) {
        const editorContentEscaped = editorContent
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        
        newHtml = newHtml.replace(
            /<textarea id="code"[^>]*>[\s\S]*?<\/textarea>/,
            `<textarea id="code" name="code">${editorContentEscaped}</textarea>`
        );
    }
    
    // If view-only mode, add modifications to disable editing
    if (viewOnly) {
        // Simplified view-only mode: just hide toolbar and make editor read-only
        const viewOnlyStyles = `
    <!-- View-only mode styles -->
    <style>
      /* Hide toolbar completely */
      #toolbar {
        display: none !important;
      }
      
      /* Make editor read-only appearance */
      .CodeMirror {
        cursor: default !important;
      }
      
      .CodeMirror-cursor {
        display: none !important;
      }
      
      /* View-only indicator */
      .view-only-indicator {
        position: fixed;
        top: 5px;
        right: 10px;
        background: rgba(0,0,0,0.5);
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 12px;
        z-index: 1000;
      }
    </style>`;
        
        // Insert view-only styles before </head>
        newHtml = newHtml.replace('</head>', `${viewOnlyStyles}\n</head>`);
        
        // Add script to disable editing
        const viewOnlyScript = `
    <script>
      // Disable editing in view-only mode
      document.addEventListener('DOMContentLoaded', function() {
        // Make CodeMirror read-only
        if (window.editor) {
          window.editor.setOption('readOnly', true);
        }
        
        // Force canvas pointer-events to none to prevent drawing
        const canvas = document.getElementById('overlayCanvas');
        if (canvas) {
          canvas.style.pointerEvents = 'none';
        }
        
        // Add a view-only indicator
        const viewOnlyIndicator = document.createElement('div');
        viewOnlyIndicator.className = 'view-only-indicator';
        viewOnlyIndicator.textContent = 'View Only Mode';
        document.body.appendChild(viewOnlyIndicator);
        
        // Adjust editor container to go to top since toolbar is hidden
        const editorContainer = document.getElementById('editor-container');
        if (editorContainer) {
          editorContainer.style.top = '0';
        }
      });
    <\/script>`;
        
        // Insert view-only script before </body>
        newHtml = newHtml.replace('</body>', `${viewOnlyScript}\n</body>`);
    }
    
    return newHtml;
}

/**
 * Downloads the HTML content as a file
 * @param {string} htmlContent - HTML content to download
 * @param {boolean} viewOnly - Whether this is a view-only version
 */
function downloadHtmlFile(htmlContent, viewOnly) {
    console.log('Downloading HTML file');
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = viewOnly ? 'sketch-view-only.html' : 'sketch-editable.html';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
} 