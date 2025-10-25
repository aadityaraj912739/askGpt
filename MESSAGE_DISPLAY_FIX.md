# Message Display Fix - Special Characters Issue

## Problem
The askgpt responses were showing unreadable text with special characters like:
- `&lt;` instead of `<`
- `&gt;` instead of `>`
- `&#39;` instead of `'`
- `\n` displayed as literal text instead of newlines
- `\\` displayed as escaped backslashes

## Root Cause
The MessageBubble component was attempting to decode HTML entities and escaped sequences, but:
1. It was using `require()` in an ES module environment (causing import errors)
2. The fallback decoding logic wasn't comprehensive enough
3. Code blocks were being double-decoded incorrectly

## Solution Applied

### 1. Fixed MessageBubble.jsx
- **Added proper ES module import**: Changed from `require()` to `import { formatMessageText } from '../utils/format'`
- **Simplified text processing**: Removed try-catch blocks with `require()` calls
- **Single decode pass**: Text is decoded once using `formatMessageText()` at the beginning
- **Cleaner code flow**: Removed redundant decoding inside code block processing

### 2. Enhanced format.js Utility
- **Better HTML entity decoding**: Added manual fallback with more entity types
  - `&lt;`, `&gt;`, `&amp;`, `&#39;`, `&quot;`
  - `&#x27;`, `&#x2F;`, `&nbsp;`
- **Improved escape sequence handling**: 
  - `\\n` → actual newline
  - `\\t` → actual tab
  - `\\r` → carriage return
  - `\\\\` → single backslash (processed last to avoid conflicts)
- **Better documentation**: Added JSDoc comments for clarity

## How It Works

1. **When a message arrives** from the Gemini API, it may contain:
   - HTML entities (e.g., `&lt;div&gt;`)
   - Escaped sequences (e.g., `line1\\nline2`)

2. **formatMessageText()** processes the text in two stages:
   - First: `decodeHtmlEntities()` converts `&lt;` to `<`, etc.
   - Second: `unescapeSequences()` converts `\\n` to actual newlines

3. **MessageBubble** displays the formatted text:
   - Plain text is shown with proper formatting
   - Code blocks are syntax-highlighted with Prism.js
   - All special characters render correctly

## Testing
To verify the fix works:
1. Send a message with HTML-like content: `<div>Hello</div>`
2. Send a message with newlines: `Line 1\\nLine 2`
3. Send code: ` ```js\nconst x = 'test'\n``` `
4. All should display as readable, properly formatted text

## Files Modified
- ✅ `client/src/components/MessageBubble.jsx` - Fixed imports and text processing
- ✅ `client/src/utils/format.js` - Enhanced decoding logic with fallbacks
