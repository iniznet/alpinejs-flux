export default function (transitions) {
 let attrs = {};

 for (const key in transitions) {
  const classes = transitions[key];

  attrs[`x-transition:${key}`] = classes;
 }

 return attrs;
}
