export default function ( transitions ) {
    const [transition, enterStart, enterEnd, timingsIn = "", timingsOut = ""] = transitions;

    return {
        "x-transition:enter": `${transition} ${timingsIn}`.trim(),
        "x-transition:enter-start": enterStart,
        "x-transition:enter-end": enterEnd,
        "x-transition:leave": `${transition} ${timingsOut}`.trim(),
        "x-transition:leave-start": enterEnd,
        "x-transition:leave-end": enterStart,
    }
}
