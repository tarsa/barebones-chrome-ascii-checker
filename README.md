# barebones-chrome-ascii-checker
Google Chrome ASCII checker (suspicious characters finder) extension
with very short and simple source code for easy and quick auditing.

![icon128.png](icons/icon128.png "application icon")

The extension allows only:
- tabs
- newlines
- spaces
- printable ASCII characters, U+0021 through U+007E

Other control characters and non-ASCII characters are reported as suspicious.

The popup also has a checkbox for disallowing uppercase ASCII letters,
U+0041 through U+005A. This option is unchecked by default.

When a suspicious character is found, the popup shows:
- the code point
- the line number
- the character index in that line
- the overall character position
- a short context box with the suspicious character highlighted
