import parseTransitions from "./parseTransitions";

export default function ( element, templateName, template ) {
    const transitions = parseTransitions( templateName, template );

    if ( !transitions ) {
        throw new Error( "x-flux: No transitions found for " + templateName );
    }

    for ( const directive of Object.keys( transitions ) ) {
        element.setAttribute( directive, transitions[directive] );
    }

    element.removeAttribute( "x-flux" );
}
