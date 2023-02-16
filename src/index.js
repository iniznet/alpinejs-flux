import parseArray from "./utils/parseArray";
import parseObject from "./utils/parseObject";

export default function (Alpine, Config) {
 Alpine.directive("flux", (el, { expression }, { evaluate }) => {
  const arrayOrString = evaluate(expression);
  let attrs = {};

  if (Array.isArray(arrayOrString)) {
   attrs = parseArray(arrayOrString);
  } else if (typeof arrayOrString === "string" && arrayOrString in Config) {
   const transitions = Config[arrayOrString];

   if (Array.isArray(transitions)) {
    attrs = parseArray(transitions);
   } else if (typeof transitions === "object") {
    attrs = parseObject(transitions);
   } else {
    throw new Error(`x-flux alias '${arrayOrString}' not found in config`);
   }
  } else {
   throw new Error("x-flux doesn't correctly defined");
  }

  Object.entries(attrs).forEach(([key, value]) => {
   el.setAttribute(key, value);
  });

  el.removeAttribute("x-flux");
 }).before("transition");
}
