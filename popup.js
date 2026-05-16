function formatCodePoint(codePoint) {
  return "U+" + codePoint.toString(16).toUpperCase().padStart(4, "0");
}

function findFirstNonAscii(text) {
  let index = 0;

  for (const character of text) {
    const codePoint = character.codePointAt(0);

    if (codePoint > 0x7F) {
      return {
        index,
        codePoint
      };
    }

    index += 1;
  }

  return null;
}

function checkAscii() {
  const textArea = document.getElementById("inputText");
  const result = document.getElementById("result");
  const problem = findFirstNonAscii(textArea.value);

  result.classList.remove("ok", "bad");

  if (problem === null) {
    result.textContent = "OK: all characters are 7-bit ASCII.";
    result.classList.add("ok");
    return;
  }

  result.textContent =
    "Not ASCII: first non-ASCII code point is " +
    formatCodePoint(problem.codePoint) +
    " at character position " +
    (problem.index + 1) +
    ".";
  result.classList.add("bad");
}

const textArea = document.getElementById("inputText");

textArea.addEventListener("input", checkAscii);
checkAscii();
