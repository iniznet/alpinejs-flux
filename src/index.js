import applyTransitions from "./core/applyTransitions";
import registerMagic from "./core/registerMagic";
import convertCamelCase from "./utils/convertCamelCase";

export default function ( Alpine, Config ) {

    Alpine.directive( "flux", ( el, { expression }, { evaluate } ) => {
        const arrayOrTemplateName = evaluate( expression );
        const templateName = Array.isArray( arrayOrTemplateName ) ? "" : arrayOrTemplateName;
        const template = templateName ? Config[templateName] : arrayOrTemplateName;

        applyTransitions( el, templateName, template );
    } ).before( "transition" );

    for ( const templateName of Object.keys( Config ) ) {
        const validName = convertCamelCase( templateName );
        const template = Config[templateName] || null;

        registerMagic( Alpine, validName, templateName, template );
    }

    Alpine.magic(
        "flux",
        ( el ) =>
            ( templateName = "", newTemplate = null, applyToElement = true ) => {
                if ( newTemplate ) {
                    const validName = convertCamelCase( templateName );

                    Config[templateName] = newTemplate;
                    registerMagic( Alpine, validName, templateName, newTemplate );
                }

                if ( !applyToElement ) {
                    return;
                }
                
                const template = Config[templateName] || null;
                
                applyTransitions( el, templateName, template );
            }
    );
}
