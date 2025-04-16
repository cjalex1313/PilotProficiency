export function replaceTokens(templateString, data) {
  // Basic input validation
  if (typeof templateString !== 'string') {
    console.error("Error: templateString must be a string.");
    return templateString; // Return original input or throw an error
  }
  if (typeof data !== 'object' || data === null) {
    console.error("Error: data must be a non-null object.");
    return templateString; // Return original input or throw an error
  }

  // Regular expression to find tokens like {tokenName}
  // - \{ and \} match the literal curly braces.
  // - (\w+) matches one or more "word" characters (letters, numbers, underscore)
  //   and captures this group (the token name).
  // - g flag ensures all occurrences are replaced, not just the first.
  const tokenRegex = /\{(\w+)\}/g;

  // Use the replace method with a replacer function
  const result = templateString.replace(tokenRegex, (match, tokenName) => {
    // match: The full matched string, e.g., "{email}"
    // tokenName: The captured group (the part inside the braces), e.g., "email"

    // Check if the tokenName exists as a property in the data object
    // Using Object.prototype.hasOwnProperty.call is safer than data.hasOwnProperty
    if (Object.prototype.hasOwnProperty.call(data, tokenName)) {
      // If the key exists, return its corresponding value from the data object
      return data[tokenName];
    } else {
      // If the key does not exist in the data object,
      // return the original match (e.g., "{email}") so it remains unchanged.
      // You could also return an empty string (''), undefined, or throw an error here
      // depending on the desired behavior for missing tokens.
      console.warn(`Token "${tokenName}" not found in data object.`); // Optional warning
      return match;
    }
  });

  return result;
}