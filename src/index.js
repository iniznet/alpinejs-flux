import parseArray from "./utils/parseArray";
import parseObject from "./utils/parseObject";

export default function (Alpine, Config) {
 Alpine.directive("flux", (el, { expression }, { evaluate }) => {
  const arrayOrString = evaluate(expression);
  const transitions =
   (Array.isArray(arrayOrString) ? arrayOrString : Config[arrayOrString]) ||
   null;

  let attributes = {};

  if (!transitions) {
   throw new Error("x-flux: No transitions found for " + expression);
  }

  if (Object.prototype.toString.call(transitions) === "[object Object]") {
   attributes = parseObject(transitions);
  } else {
   attributes = parseArray(transitions);
  }

  Object.entries(attributes).forEach(([key, value]) => {
   el.setAttribute(key, value);
  });

  el.removeAttribute("x-flux");
 }).before("transition");
}
