export default function ( transitions ) {
    const [transition, enterStart, enterEnd, timingsIn = "", timingsOut = ""] = transitions;

    const transitionEnter = `${transition} ${timingsIn}`.trim();
    const transitionLeave = `${transition} ${timingsOut}`.trim();

    const attrs = {
        "x-transition:enter": transitionEnter,
        "x-transition:enter-start": enterStart,
        "x-transition:enter-end": enterEnd,
        "x-transition:leave": transitionLeave,
        "x-transition:leave-start": enterEnd,
        "x-transition:leave-end": enterStart,
    };

    return attrs;
}
