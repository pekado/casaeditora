import {words} from './stop-words.js';

function filterTokens(tokens, stopwords) {
  return tokens.filter(function (value) {
    return stopwords.indexOf(value.toLowerCase()) === -1;
  });
}

 const removeStopwords = function (tokens, stopwords) {
  let stopwordsList = words;

  if (typeof tokens !== 'object' || typeof stopwordsList != 'object') {
    throw new Error('expected Arrays try: removeStopwords(Array[, Array])');
  }

  // If users specifies all it goes through all the languages and filters out any stopwords
  if (stopwords === 'all') {
    var wordsToKeep = tokens;

    stopwordsList.map(function (value) {
      var wordsToMaybeKeep = filterTokens(wordsToKeep, value);

      wordsToKeep =
        wordsToMaybeKeep.length < wordsToKeep.length
          ? wordsToMaybeKeep
          : wordsToKeep;
    });
    return wordsToKeep;
  }
  return filterTokens(tokens, stopwordsList);
};

export default removeStopwords
