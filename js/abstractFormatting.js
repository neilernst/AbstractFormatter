
// General formatting method calling sub-check functions.
var formatText = function (inputText) {
    checkMultipleParagraphs(inputText);
    inputText = removeWhitespaces(inputText);

    inputText = checkAbstractStart(inputText);
    var length = checkLength(inputText);
    checkParagraphEndsCorrectly(inputText, length);

    inputText = checkTeXSyntax(inputText);

    return inputText;
}

// checks whether abstract contains multiple paragraphs. If so, gives a warning that they'll be flattened.
var checkMultipleParagraphs = function (inputText) {
    var divId = 'multipleParagraphs';
    if (containsMultipleParagraphs(inputText)) {
	addInfoMessage(divId, 'alert alert-info', "It appears to me, your abstract contains multiple paragraphs. I flattened them.");
    } 
    else {
	removeInfoMessage(divId);
    }
}

// Returns true if abstract has multiple paragraphs, false otherwise.
var containsMultipleParagraphs = function (inputText) {
    inputText = inputText.replace(/[\f\t\v\u00A0\u2028\u2029]/gi, '');
    if (inputText.match(/\s{2,}\S+/g) != null) {
        return true;
    }
    return false;
}

// Removes all whitespaces in the abstract.
var removeWhitespaces = function (inputText) {
    // White-space replacements
    inputText = inputText.replace(/\s/gi, ' ');
    inputText = inputText.replace(/\s+/g, ' ');
    inputText = inputText.replace(/(\w+)- (\w+)/g, '$1$2'); // deals with hyphenation: hy- phen -> hyphen
    inputText = inputText.replace(/\s+$/, ''); // remove trailing white spaces
    return inputText;
}

// Checks the start of the abstract and removes abstract from its beginning.
var checkAbstractStart = function (inputText) {
    if(startsWithAbstract(inputText)) {
	inputText = inputText.replace(/^abstract(\W)*/i, '');
    }
    return inputText;
}

// Returns whether the abstract starts with abstract. If so, adds a warning and returns true (false otherwise).
var startsWithAbstract = function (inputText) {
    var divId = 'abstractInfo';
    if(inputText.match(/^abstract(\W)*/i) != null) {
	addInfoMessage(divId, 'alert alert-warning', "Your abstract begins with the words abstract. I removed them for you.");
	return true;
    }
    else {
	removeInfoMessage(divId);
	return false;
    }
}

// Checks and returns the number of words in the abstract.
var checkLength = function (inputText) {
    var divId = 'lengthWarning';
    var wordsInAbstract = inputText.match(/\b/g);
    var numberOfWords = 0;
    if (wordsInAbstract != null) {
        numberOfWords = inputText.match(/\b/g).length / 2;
    }

    if (numberOfWords > 200 && numberOfWords <= 250) {
	addInfoMessage(divId, 'alert alert-warning', "Your abstract exceeds 200 words. This is often considered rather long.");
    } else if (numberOfWords > 250 && numberOfWords <= 500) {
	addInfoMessage(divId, 'alert alert-danger', "Your text exceeds 250 words. This is often considered too long for an article.");
    } else if (numberOfWords > 500) {
	addInfoMessage(divId, 'alert alert-danger', "Your text exceeds 500 words. This is <strong>generally considered too long.</strong>");
    } else {
	removeInfoMessage(divId);
    }

    return numberOfWords;
}

// Checks whether the abstract ends correctly, with a fullstop, question or exclamation mark.
var checkParagraphEndsCorrectly = function (inputText, length) {
    var divId = 'paragraphEnd';
    if (inputText.match(/[.?!]$/) === null && length > 3) {
	addInfoMessage(divId, 'alert alert-danger', "Your last sentence does not end in a fullstop, question or exlclemation mark!");
    }
    else {
	removeInfoMessage(divId);
    }
}

// Performs some basic TeX replacements
var checkTeXSyntax = function(inputText) {
    inputText = inputText.replace(/\\\S+{(.*?)}/gi, '$1'); // replaces TeX commands like \it{Text}
    inputText = inputText.replace(/{\\\S+(.*?)}/gi, '$1'); // replaces TeX commands like {\em Text}
    inputText = inputText.replace(/\\/gi, '');
    inputText = inputText.replace(/---/g, "&mdash;");
    inputText = inputText.replace(/--/g, "&ndash;");

    return inputText;
}




