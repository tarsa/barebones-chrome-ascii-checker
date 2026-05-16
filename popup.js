const CONTEXT_RADIUS = 30;

const inputText = document.getElementById("inputText");
const disallowUppercase = document.getElementById("disallowUppercase");
const result = document.getElementById("result");
const context = document.getElementById("context");

function formatCodePoint(codePoint) {
  return "U+" + codePoint.toString(16).toUpperCase().padStart(4, "0");
}

function isUppercaseAsciiLetter(codePoint) {
  return codePoint >= 0x41 && codePoint <= 0x5A;
}

function isAllowedBaseCharacter(codePoint) {
  return (
      codePoint === 0x09 ||
      codePoint === 0x0A ||
      codePoint === 0x0D ||
      codePoint === 0x20 ||
      (codePoint >= 0x21 && codePoint <= 0x7E)
  );
}

function getSuspiciousReason(codePoint, options) {
  if (!isAllowedBaseCharacter(codePoint)) {
    return "only tabs, newlines, spaces, and printable ASCII characters are allowed";
  }

  if (options.disallowUppercase && isUppercaseAsciiLetter(codePoint)) {
    return "uppercase letters A-Z are disallowed";
  }

  return null;
}

function findFirstSuspiciousCharacter(text, options) {
  let index = 0;
  let line = 1;
  let column = 1;
  let previousWasCarriageReturn = false;

  for (const character of text) {
    const codePoint = character.codePointAt(0);
    const reason = getSuspiciousReason(codePoint, options);

    if (reason !== null) {
      return {
        index,
        line,
        column,
        character,
        codePoint,
        reason
      };
    }

    if (codePoint === 0x0D) {
      line += 1;
      column = 1;
      previousWasCarriageReturn = true;
    } else if (codePoint === 0x0A) {
      if (!previousWasCarriageReturn) {
        line += 1;
      }
      column = 1;
      previousWasCarriageReturn = false;
    } else {
      column += 1;
      previousWasCarriageReturn = false;
    }

    index += 1;
  }

  return null;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function displayCharacter(character) {
  const codePoint = character.codePointAt(0);

  if (codePoint === 0x09) {
    return "\t";
  }

  if (codePoint === 0x0A || codePoint === 0x0D) {
    return "\n";
  }

  if (codePoint < 0x20 || codePoint === 0x7F) {
    return "[" + formatCodePoint(codePoint) + "]";
  }

  return character;
}

function appendContextCharacter(parent, character, className) {
  const text = displayCharacter(character);

  if (className === undefined) {
    parent.appendChild(document.createTextNode(text));
    return;
  }

  const span = document.createElement("span");
  span.className = className;
  span.textContent = text;
  parent.appendChild(span);
}

function renderContext(text, problem) {
  const characters = Array.from(text);
  const start = Math.max(0, problem.index - CONTEXT_RADIUS);
  const end = Math.min(characters.length, problem.index + CONTEXT_RADIUS + 1);

  clearElement(context);

  if (start > 0) {
    context.appendChild(document.createTextNode("..."));
  }

  for (let index = start; index < end; index += 1) {
    appendContextCharacter(
        context,
        characters[index],
        index === problem.index ? "suspicious" : undefined
    );
  }

  if (end < characters.length) {
    context.appendChild(document.createTextNode("..."));
  }

  context.hidden = false;
}

function checkText() {
  const options = {
    disallowUppercase: disallowUppercase.checked
  };

  const problem = findFirstSuspiciousCharacter(inputText.value, options);

  result.classList.remove("ok", "bad");

  if (problem === null) {
    result.textContent = "OK: all characters are allowed.";
    result.classList.add("ok");
    context.hidden = true;
    clearElement(context);
    return;
  }

  result.textContent =
      "First suspicious character: " +
      formatCodePoint(problem.codePoint) +
      " at line " +
      problem.line +
      ", column " +
      problem.column +
      " (overall position " +
      (problem.index + 1) +
      "). Reason: " +
      problem.reason +
      ".";

  result.classList.add("bad");
  renderContext(inputText.value, problem);
}

inputText.addEventListener("input", checkText);
disallowUppercase.addEventListener("change", checkText);
checkText();
