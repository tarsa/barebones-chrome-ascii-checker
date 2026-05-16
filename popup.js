function formatCodePoint(codePoint) {
  return "U+" + codePoint.toString(16).toUpperCase().padStart(4, "0");
}

function isAllowedCharacter(codePoint) {
  return (
      codePoint === 0x09 ||
      codePoint === 0x0A ||
      codePoint === 0x0D ||
      (codePoint >= 0x20 && codePoint <= 0x7E)
  );
}

function findFirstDisallowedCharacter(text) {
  let index = 0;

  for (const character of text) {
    const codePoint = character.codePointAt(0);

    if (!isAllowedCharacter(codePoint)) {
      return {
        index,
        codePoint
      };
    }

    index += 1;
  }

  return null;
}

function checkText() {
  const textArea = document.getElementById("inputText");
  const result = document.getElementById("result");
  const problem = findFirstDisallowedCharacter(textArea.value);

  result.classList.remove("ok", "bad");

  if (problem === null) {
    result.textContent = "OK: all characters are allowed.";
    result.classList.add("ok");
    return;
  }

  result.textContent =
    "Not allowed: first disallowed code point is " +
    formatCodePoint(problem.codePoint) +
    " at character position " +
    (problem.index + 1) +
    ".";
  result.classList.add("bad");
}

const textArea = document.getElementById("inputText");

textArea.addEventListener("input", checkText);
checkText();
