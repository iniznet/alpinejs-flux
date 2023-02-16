import applyTransitions from "./core/applyTransitions";
import parseTransitions from "./core/parseTransitions";
import convertCamelCase from "./utils/convertCamelCase";

export default function ( Alpine, Config ) {
    const magicNames = ['flux', ...Object.keys( Config )];

    Alpine.directive( "flux", ( el, { expression }, { evaluate } ) => {
        const arrayOrTemplateName = evaluate( expression );
        const template =
            ( Array.isArray( arrayOrTemplateName ) ? arrayOrTemplateName : Config[arrayOrTemplateName] ) ||
            null;
        const transitions = parseTransitions( arrayOrTemplateName, template );

        applyTransitions( el, arrayOrTemplateName, transitions )
    } ).before( "transition" );

    for ( const templateName of magicNames ) {
        const validName = convertCamelCase( templateName );

        Alpine.magic( validName, ( el ) => () => {
            const template = Config[templateName] || null;
            const transitions = parseTransitions( templateName, template );

            applyTransitions( el, templateName, transitions )
        } );
    }
}
