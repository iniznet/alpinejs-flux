import applyTransitions from "./applyTransitions";

export default function (Alpine, validName, templateName, template = null) {
    Alpine.magic( validName, ( el ) => () => {
        applyTransitions( el, templateName, template );
    } );
}