export function toTitleCase(text: string) {
  return text?.toLowerCase().replace(/\b(\w)/g, m => m.toUpperCase()) ?? '';
}

export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Extracts inner text from html string
 * @param input "\<p>Hello\</p>"
 * @returns "Hello"
 */
export function textInHtml(input: string): string {
  return input.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Check if there is white spaces in string
 * @param input "text with white spaces"
 * @returns true
 */
export function hasWhiteSpace(string: string) {
  return /\s/.test(string);
}

/**
 * Split string to object
 * @param input "string "type=string;value=100"
 * @returns { type: "string", value: 100}
 */
export function parseStringToObject(string: string) {
  return string.split(';').reduce((result, pair) => {
    const [key, value] = pair.split('=');

    if (key && value) {
      result[key.trim()] = value.trim();
    }

    return result;
  }, {} as Record<string, string | number>);
}

/**
 * Decode a Base64 encoded string
 * @param base64String "base64String=eyJyYnMiOiAiZGVwbG95bWVudF9pZCIsICJnc2siOiAiZGVwbG95bWVuX2lkIn0K"
 * @returns "JSON "{\"property1\": \"value1\"}""
 */
export function parseBase64toString(base64String: string): string {
  return Buffer.from(base64String, 'base64').toString('utf-8');
}

/**
 * Base64 string to JSON
 * @param value "value=eyJyYnMiOiAiZGVwbG95bWVudF9pZCIsICJnc2siOiAiZGVwbG95bWVuX2lkIn0K"
 * @returns "Object {"property1": "value1"}"
 */
export function parseBase64toJSON(value: string) {
  try {
    const decodedString = parseBase64toString(value);
    return JSON.parse(decodedString);
  } catch (e) {
    return null;
  }
}

export function removeTrailingSlash(str: string) {
  return str.replace(/\/$/, '');
}

export function isJSON(value: string) {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
}

export function caseInsensitiveEquals(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return a.toUpperCase() === b.toUpperCase();
}

export function parseDelimitedList(
  value: string | undefined,
  delimiter = ';'
): string[] {
  if (!value) return [];
  return value
    .split(delimiter)
    .map(item => item.trim())
    .filter(Boolean);
}
