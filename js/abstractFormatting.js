/*  Copyright (C) 2014  Moritz Beller

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>. */


// General formatting method calling sub-check functions.
var formatText = function(inputText) {
    inputText = removeCommentedOutLines(inputText);
    checkMultipleParagraphs(inputText);
    inputText = removeWhitespaces(inputText);

    inputText = checkAbstractStart(inputText);
    var length = checkLength(inputText);
    checkParagraphEndsCorrectly(inputText, length);
    checkReferences(inputText);

    inputText = checkTeXSyntax(inputText);

    return inputText;
};

// Removes lines commented out using % in latex
var removeCommentedOutLines = function(inputText) {
    return inputText.replace(/^%.*$/mg, '');
};

// checks whether abstract contains multiple paragraphs. If so, gives a warning that they'll be flattened.
var checkMultipleParagraphs = function(inputText) {
    var divId = 'multipleParagraphs';
    if (containsMultipleParagraphs(inputText)) {
        addInfoMessage(divId, 'alert alert-info', 'It appears to me, your abstract contains multiple paragraphs. I flattened them.');
    } else {
        removeInfoMessage(divId);
    }
};

// Returns true if abstract has multiple paragraphs, false otherwise.
var containsMultipleParagraphs = function(inputText) {
    inputText = inputText.replace(/[\f\t\v\u00A0\u2028\u2029]/gi, '');
    if (inputText.match(/\s{2,}\S+/g) != null) {
        return true;
    }
    return false;
};

// Removes all whitespaces in the abstract.
var removeWhitespaces = function(inputText) {
    // White-space replacements
    inputText = inputText.replace(/\s/gi, ' ');
    inputText = inputText.replace(/\s+/g, ' ');
    inputText = inputText.replace(/(\w+)- (\w+)/g, '$1$2'); // deals with hyphenation: hy- phen -> hyphen
    inputText = inputText.replace(/\s+$/, ''); // remove trailing white spaces
    return inputText;
};

// Checks the start of the abstract and removes abstract from its beginning.
var checkAbstractStart = function(inputText) {
    if (startsWithAbstract(inputText)) {
        inputText = inputText.replace(/^abstract(\W)*/i, '');
    }
    return inputText;
};

// Returns whether the abstract starts with abstract. If so, adds a warning and returns true (false otherwise).
var startsWithAbstract = function(inputText) {
    var divId = 'abstractInfo';
    if (inputText.match(/^abstract(\W)*/i) != null) {
        addInfoMessage(divId, 'alert alert-warning', 'Your abstract begins with the words abstract. I removed them for you.');
        return true;
    } else {
        removeInfoMessage(divId);
        return false;
    }
};

// Checks and returns the number of words in the abstract.
var checkLength = function(inputText) {
    var divId = 'lengthWarning';
    var wordsInAbstract = inputText.match(/\b/g);
    var numberOfWords = 0;
    if (wordsInAbstract != null) {
        numberOfWords = inputText.match(/\b/g).length / 2;
    }

    removeInfoMessage(divId);
    if (numberOfWords > 200 && numberOfWords <= 250) {
        addInfoMessage(divId, 'alert alert-warning', 'Your abstract exceeds 200 words: ' + numberOfWords + ' words is often considered rather long.');
    } else if (numberOfWords > 250 && numberOfWords <= 500) {
        addInfoMessage(divId, 'alert alert-danger', 'Your text exceeds 250 words: ' + numberOfWords + ' words is often considered too long for an article.');
    } else if (numberOfWords > 500) {
        addInfoMessage(divId, 'alert alert-danger', 'Your text exceeds 500 words: ' + numberOfWords + ' words is <strong>generally considered too long.</strong>');
    } else {
        removeInfoMessage(divId);
    }

    return numberOfWords;
};

// Checks whether the abstract ends correctly, with a fullstop, question or exclamation mark.
var checkParagraphEndsCorrectly = function(inputText, length) {
    var divId = 'paragraphEnd';
    if (inputText.match(/[.?!]$/) === null && length > 3) {
        addInfoMessage(divId, 'alert alert-danger', 'Your last sentence does not end in a fullstop, question or exclamation mark!');
    } else {
        removeInfoMessage(divId);
    }
};

// checks whether abstract contains references. If so, gives a warning.
var checkReferences = function(inputText) {
    var divId = 'checkReferences';
    if (containsReferences(inputText)) {
        addInfoMessage(divId, 'alert alert-warning', 'Your abstract contains references. It should not do that.');
    } else {
        removeInfoMessage(divId);
    }
};

// Returns true if the abstract contains references such as [5]
var containsReferences = function(inputText) {
    if (inputText.match(/\[(.*)?\d(.*)?\]/g) != null) {
        return true;
    }
};

// Performs some basic TeX replacements
var checkTeXSyntax = function(inputText) {
    inputText = inputText.replace(/\\\S+{(.*?)}/gi, '$1'); // replaces TeX commands like \it{Text}
    inputText = inputText.replace(/{\\\S+(.*?)}/gi, '$1'); // replaces TeX commands like {\em Text}
    inputText = inputText.replace(/\\/gi, '');
    inputText = inputText.replace(/---/g, '&mdash;');
    inputText = inputText.replace(/--/g, '&ndash;');

    return inputText;
};




