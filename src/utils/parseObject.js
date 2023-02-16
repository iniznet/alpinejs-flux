export default function (transitions) {
 let attributes = {};

 for (const key in transitions) {
  const classes = transitions[key];

  attributes[`x-transition:${key}`] = classes;
 }

 return attributes;
}
