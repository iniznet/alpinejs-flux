export default function ( element, templateName, transitions ) {
    if ( !transitions ) {
        throw new Error( "x-flux: No transitions found for " + templateName );
    }

    for ( const directive of Object.keys( transitions ) ) {
        element.setAttribute( directive, transitions[directive] );
    }

    element.removeAttribute( "x-flux" );
}
