import removeStopwords from './remove-words.js'

const frequency = (text, options) => {
  options = options || {};
  options.caseSensitive = options.caseSensitive || false;
  var frequencies = {},
    textParts = [],
    cleanText = [],
    part = null;
  /* Only get frequency if input is string with content */
  if ((typeof text === 'string') && (text.length > 0)) {
    /* Returns text with HTML, tabs, new lines, punctuation, and extra spaces removed */
    function stripText(text) {
      return text.replace(/<[^>]+>|[!.?,;:'"-]/g, ' ').replace(/\r?\n|\r|\s+|\t/g, ' ').trim()
    }
    /* Get words in text */
    text = (options.caseSensitive ? text : text.toLowerCase());
    textParts = stripText(text).split(' ');
    cleanText = removeStopwords(textParts)
    for (part in cleanText) {
      part = cleanText[part];
      if (typeof frequencies[part] === 'undefined') {
        frequencies[part] = 1;
      } else {
        frequencies[part] += 1;
      }
    }
  } else if(Array.isArray(text)) {
    for (part in text) { 
      part = text[part];
      if (typeof frequencies[part] === 'undefined') {
        frequencies[part] = 1;
      } else {
        frequencies[part] += 1;
      }
    }
  }
  const sortable = Object.fromEntries(
    Object.entries(frequencies).sort(([, a], [, b]) => b - a).splice(0, 20)
  );
  return sortable;
}

export default frequency;