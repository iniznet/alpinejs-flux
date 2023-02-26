export default function ( transitions ) {
    let attributes = {};

    for ( const directiveValue in transitions ) {
        const classes = transitions[directiveValue];

        attributes[`x-transition:${directiveValue}`] = classes;
    }

    return attributes;
}
