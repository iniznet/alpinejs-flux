import applyTransitions from "./core/applyTransitions";
import registerMagic from "./core/registerMagic";
import convertCamelCase from "./utils/convertCamelCase";

export default function ( Alpine, Config ) {
    Alpine.directive( "flux", ( element, { expression }, { evaluate } ) => {
        const inlineTemplateOrName = evaluate( expression );
        const templateName = Array.isArray( inlineTemplateOrName ) ? "" : inlineTemplateOrName;
        const template = templateName ? Config[templateName] : inlineTemplateOrName;

        applyTransitions( element, templateName, template );
    } ).before( "transition" );

    for ( const templateName in Config ) {
        const validName = convertCamelCase( templateName );
        const template = Config[templateName] || null;

        registerMagic( Alpine, validName, templateName, template );
    }

    Alpine.magic(
        "flux",
        ( element ) =>
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

                applyTransitions( element, templateName, template );
            }
    );
}
