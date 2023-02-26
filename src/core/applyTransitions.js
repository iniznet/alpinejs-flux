import parseTransitions from "./parseTransitions";

export default function ( element, templateName, template ) {
    const transitions = parseTransitions( templateName, template );

    if ( !transitions ) {
        throw new Error( "x-flux: No transitions found for " + templateName );
    }

    for ( const directive in transitions ) {
        const classes = transitions[directive];

        element.setAttribute( directive, classes );
    }

    element.removeAttribute( "x-flux" );
}
