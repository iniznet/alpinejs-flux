import parseArray from "../utils/parseArray";
import parseObject from "../utils/parseObject";

export default function ( templateName, template = null ) {
    if ( !template ) {
        throw new Error( `x-flux: Template ${templateName} does not exist.` );
    }

    try {
        return Array.isArray( template ) ? parseArray( template ) : parseObject( template );
    } catch ( error ) {
        throw new Error( "x-flux: Only accept array or object." );
    }
}