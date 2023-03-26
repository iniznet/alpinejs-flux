export default function ( transitions ) {
    return Object.entries(transitions).reduce((directives, [directiveValue, classes]) => {
        directives[`x-transition:${directiveValue}`] = classes;

        return directives;
    }, {});
}
