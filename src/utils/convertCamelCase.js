export default function (templateName) {
    const words = templateName.split('-');

    if (words.length === 1) {
        return templateName;
    }

    const camelCasedWords = words.slice(1).map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return words[0] + camelCasedWords.join('');
}