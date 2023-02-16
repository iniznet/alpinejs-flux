# alpinejs-flux

Simplifies x-transition when applying CSS classes.

It requires alpinejs v3.11.0 or higher.

## Install

### With a CDN

```html
<script defer src="https://unpkg.com/alpinejs-flux@latest/dist/flux.min.js"></script>

<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### With a Package Manager

```shell
yarn add -D alpinejs-flux

npm install -D alpinejs-flux
```

```js
import Alpine from 'alpinejs'
import flux from 'alpinejs-flux'

Alpine.plugin(() => {
    flux(Alpine, {
        "translate-y-2": [
            "transition duration-300", // transition
            "opacity-0 scale-90 translate-y-2", // enter-start | leave-end
            "opacity-100 scale-100 translate-y-0", // enter-end | leave-start
            "ease-out", "ease-in" // enter, leave
        ],
        rotate: {
            "enter": "transition-all ease-in-out transform duration-300",
            "enter-start": "opacity-0 scale-90",
            "enter-end": "opacity-100 scale-100 rotate-180",
            "leave": "transition-all ease-in-out transform duration-300",
            "leave-start": "opacity-100 scale-100",
            "leave-end": "opacity-0 scale-90"
        }
    });
});

Alpine.start()
```

## Example

There's three ways to use this plugin.

```html
<section x-data="{ show: false }">
    <button @click="show = !show">Toggle</button>

    <!-- You can call the defined template by calling the name of the config -->
    <div x-show="show" x-flux="'translate-y-2'">Array from Config</div>
    <div x-show="show" x-flux="'rotate'">Object from Config</div>

    <!-- Or you can use the magic -->
    <div x-show="show" x-init="$translateY2">Array from Config</div>
    <div x-show="show" x-init="$rotate">Object from Config</div>

    <!-- Or you can define it inline -->
    <div x-show="show" x-flux="[
        'transition duration-300',
        'opacity-0 scale-90',
        'opacity-100 scale-100',
        'ease-out', 'ease-in',
    ]">Array Expression</div>
</section>
```

## Stats

![](https://img.shields.io/bundlephobia/min/alpinejs-flux)
![](https://img.shields.io/npm/v/alpinejs-flux)
![](https://img.shields.io/npm/dt/alpinejs-flux)
![](https://img.shields.io/github/license/markmead/alpinejs-flux)

## Credits

Thanks to [markmead](https://github.com/markmead/alpinejs-plugin-template) for the template.
