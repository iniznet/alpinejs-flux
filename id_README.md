# alpinejs-flux

[English](README.md) | Indonesia

[Codepen Demo](https://codepen.io/inizneti/pen/xxaaBmo?editors=1000)

Menyederhanakan proses penerapan kelas-kelas CSS dengan x-transition sebagai template yang dapat digunakan secara berulang kali dalam satu atribut.

Diperlukan alpinejs v3.11.0 atau lebih tinggi.

<img src="https://github.com/iniznet/alpinejs-flux/raw/master/.assets/id_demo.gif" alt="Demo">

## Perancangan

Catatan: Dokumentasi API ada di paling bawah.

Singkat apa itu API directive dan magic di alpinejs:
- Directive adalah sebuah API dalam bentuk atribut yang biasa digunakan untuk memanipulasi elemen HTML yang dituju.
- Magic adalah sebuah API properti atau method yang kapan saja dapat kita panggil hampir di semua tempat di dalam lingkungan alpinejs serta mereferensikan sumber elemen.

Sebuah plugin alpinejs akan terinisiasi secara otomatis apabila kamu menggunakan CDN atau jalur inline script. Jika kamu menggunakan package manager seperti yarn atau npm, maka kamu perlu menginisiasi plugin tersebut secara manual sebagaimana contoh dibawah nanti.

AlpineJS Flux, plugin ini merupakan sebuah pembungkus satu directive yang akan menerapkan semua directive `x-transition` secara otomatis. Apabila kamu tidak menggunakan kelas-kelas CSS atau hanya ingin menggunakan transisi opacity dan scale maka kamu tidak perlu menggunakan plugin ini karena secara bawaan `x-transition` sudah menyediakan mekanisme tersebut.

Dalam perancangan awal, saya hanya terpikirkan untuk membuat satu directive saja dengan array sebagai isinya:

```html
<div
    x-show="show"
    x-flux="[
        'transition duration-300', // transition untuk masuk dan keluar
        'opacity-0 scale-90', // transisi pangkal ketika masuk dan ujung ketika keluar
        'opacity-100 scale-100', // transisi ujung ketika masuk dan pangkal ketika keluar
        'ease-out', 'ease-in' // transisi ketika masuk, transisi ketika keluar (perhatikan koma)
    ]"
>Ekspresi Array</div>
```

Setelah pembuatan dan pengetesan, saya terpikirkan kalau ini apa bedanya dengan x-transition itu sendiri, masih sama saja menyalin dan tempel berulang kali dan terlebih lagi kalau ada elemen yang tipe transisi masuk/keluarnya berbeda misalnya ketika masuk elemennya berputar (rotate) dan ketika keluar perlahan menghilang (fade out), saya nantinya harus kembali menggunakan `x-transition` lagi yang ingin saya hindari. Jadi saya memutuskan untuk membuat sebuah konfigurasi global untuk menyimpan nilai-nilai transisi sebagai template yang dapat digunakan kembali di berbagai elemen hanya dengan mereferensikan nama template tersebut.

Kita bisa mendefinisikan sebuah template transisi ketika akan menginisialisasi plugin ini:

```js
import Alpine from 'alpinejs'
import Flux from 'alpinejs-flux'

Alpine.plugin(() => {
    Flux(Alpine, {
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

Dan terbitlah versi pertama plugin ini,

[Lihat kode v1.0.0](https://github.com/iniznet/alpinejs-flux/blob/0a72f5f04a9e669dfb5249e4007abeaf6b954fa7/src/index.js)

Sedikit beda dengan cara inisiasi plugin alpinejs lain pada umumnya, hal ini diperlukan ketika kita ingin meneruskan suatu argumen ke dalam plugin.

Nama template di konfigurasi menggunakan aturan kebab-case dan tipe data objek daripada map karena untuk penyimpanan skala kecil, map tidak akan memberikan keuntungan apapun.

Saya mendapat masukkan dari salah satu kontributor di alpinejs bahwasanya akan lebih praktis bila kita bisa menggunakan magic daripada directive `x-flux`. Saya setuju dengan masukannya dan menambahkan magic untuk menerapkan template yang sudah didefinisikan di konfigurasi. Magic didaftarkan secara dinamis dengan nama template yang terdefinisikan dengan aturan camelCase.

```html
<!-- Kamu bisa memanggil template yang sudah didefinisikan di konfigurasi -->
<div x-show="show" x-flux="'translate-y-2'">Array dari Konfigurasi</div>

<!-- Atau kamu bisa gunakan magic -->
<div x-show="show" x-init="$translateY2">Array dari Konfigurasi</div>
<div x-show="show" x-init="$flux('translate-y-2')">Array dari Konfigurasi</div>
```

[Lihat kode v1.1.0](https://github.com/iniznet/alpinejs-flux/tree/ee1d073d4236dc8136c05ec264708996bcfb96b3/src) | 
[Atau komparasi perubahan v1.0.0 > v1.1.0](https://github.com/iniznet/alpinejs-flux/compare/v1.0.0...v1.1.0)

Saya menyarankan untuk memakai `x-flux` apabila elemen yang di tuju sudah memiliki `x-init` demi kemudahan dalam membaca, dan juga saya rasa magic ini akan lebih cocok untuk digunakan pada elemen yang belum memiliki `x-init` atau terutama berada di dalam method init pada `Alpine.data()`.

```js
Alpine.data('tooltip', () => ({
    show: false,
    init() {
        this.$translateY2();
        this.$flux('translate-y-2');
    },
    // ...
}));
```

Lalu bagaimana cara kita memasukkan template baru apabila kita menggunakan CDN script daripada bundle module, cara sebelumnya tentunya tidak bisa di terapkan karena memang keterbatasan apabila kita menggunakan CDN script. Untuk itu saya menambahkan magic `$flux` yang dapat digunakan untuk menerapkan atau membuat template baru secara dinamis.

```html
<section
    x-data="{ template: [
        'transition duration-300',
        'opacity-0 scale-90',
        'opacity-100 scale-100',
        'ease-out', 'ease-in',
    ] }"
>
    <!-- Kamu bisa membuat template melalui magic flux, aturan nama template harus kebab-case -->
    <div x-show="show" x-init="$flux('opacity-scale', template)">Ekspresi Array</div>

    <!-- Secara bawaan template yang dibuat akan otomatis di terapkan pada elemen, kamu bisa menonaktifkan ini dengan memberikan nilai false pada parameter ketiga -->
    <div x-show="show" x-init="$flux('opacity-scale', template, false)">Ekspresi Array</div>

    <!-- Kamu juga bisa membuat template dengan cara mengirimkan array/objek langsung -->
    <div x-show="show" x-init="$flux('opacity-scale', [
        'transition duration-300',
        'opacity-0 scale-90',
        'opacity-100 scale-100',
        'ease-out', 'ease-in',
    ])">Ekspresi Array</div>
</section>
```

Saya baru kepikiran membuatkannya dengan patch v1.2.0 karena saya hampir tidak pernah menulis CDN/inline script.

[Lihat kode v1.2.0](https://github.com/iniznet/alpinejs-flux/commit/117ea12b02c7912149353dc9b5b18fb87ee1dd79) | 
[Atau komparasi perubahan v1.1.0 > v1.2.0](https://github.com/iniznet/alpinejs-flux/compare/v1.1.0...v1.2.0)

Lalu saya akhiri dengan perubahan terakhir v1.2.1 dan v1.2.2 untuk membuat variable assigments di dalam directive `x-flux` dan kode menjadi lebih rapi dan mudah dibaca.

[Cek komparasi perubahan v1.2.0 > v1.2.1](https://github.com/iniznet/alpinejs-flux/compare/v1.2.0...v1.2.1)
[Cek komparasi perubahan v1.2.1 > v1.2.2](https://github.com/iniznet/alpinejs-flux/compare/v1.2.0...master)

Apa selanjutnya? saya terpikirkan untuk menyederhanakan cara mendefinisikan template lewat objek karena penulisannya mirip dengan si `x-transition` itu sendiri, untuk sekarang seperti ini:
```js
{
    "enter": "transition-all ease-in-out transform duration-300",
    "enter-start": "opacity-0 scale-90",
    "enter-end": "opacity-100 scale-100 rotate-180",
    "leave": "transition-all ease-in-out transform duration-300",
    "leave-start": "opacity-100 scale-100",
    "leave-end": "opacity-0 scale-90"
}
```

Mungkin akan saya buat menjadi seperti ini:
```js
{
    "transition": "transition-all ease-in-out transform duration-300",
    "enter": [
        "opacity-0 scale-90",
        "opacity-100 scale-100 rotate-180"
    ],
    "leave": [
        "opacity-100 scale-100",
        "opacity-0 scale-90"
    ]
}
```

Itu masih berupa ide, saya masih belum pasti apakah akan saya terapkan atau tidak.

## Install

### Dengan CDN

```html
<script defer src="https://unpkg.com/alpinejs-flux@latest/dist/flux.min.js"></script>

<script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

### Dengan Package Manager

```shell
yarn add -D alpinejs-flux

npm install -D alpinejs-flux
```

```js
import Alpine from 'alpinejs'
import Flux from 'alpinejs-flux'

Alpine.plugin(() => {
    Flux(Alpine, {
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

## Penggunaan

Ada beberapa cara untuk menggunakan plugin ini.

```html
<section x-data="{ show: false, template: [
        'transition duration-300',
        'opacity-0 scale-90',
        'opacity-100 scale-100',
        'ease-out', 'ease-in',
    ] }">
    <button @click="show = !show">Toggle</button>

    <!-- Kamu bisa memanggil template yang sudah didefinisikan di konfigurasi -->
    <div x-show="show" x-flux="'translate-y-2'">Array dari Konfigurasi</div>
    <div x-show="show" x-flux="'rotate'">Objek dari Konfigurasi</div>

    <!-- Atau kamu bisa gunakan magic -->
    <div x-show="show" x-init="$translateY2">Array dari Konfigurasi</div>
    <div x-show="show" x-init="$rotate">Objek dari Konfigurasi</div>
    <div x-show="show" x-init="$flux('translate-y-2')">Array dari Konfigurasi</div>

    <!-- Kamu juga bisa membuat anonymous template secara inline di dalam directive x-flux -->
    <div x-show="show" x-flux="[
        'transition duration-300',
        'opacity-0 scale-90',
        'opacity-100 scale-100',
        'ease-out', 'ease-in',
    ]">Ekspresi Array</div>

    <!-- Kamu bisa membuat template melalui magic flux, aturan nama template harus kebab-case -->
    <div x-show="show" x-init="$flux('opacity-scale', template)">Ekspresi Array</div>

    <!-- Secara bawaan template yang dibuat akan otomatis di terapkan pada elemen, kamu bisa menonaktifkan ini dengan memberikan nilai false pada parameter ketiga -->
    <div x-show="show" x-init="$flux('opacity-scale', template, false)">Ekspresi Array</div>
</section>
```
## API Docs

### Directive `x-flux`

Directive ini digunakan untuk membuat template secara inline, atau memanggil template yang sudah didefinisikan di konfigurasi.
Inline dapat berupa array atau objek.

Parameter | Tipe | Deskripsi
--- | --- | ---
`inlineTemplateOrName` | (`Array` atau `Object`) atau `String` | Template secara inline atau nama template yang sudah didefinisikan di konfigurasi

```html
<div x-flux="[
    'transition duration-300',
    'opacity-0 scale-90',
    'opacity-100 scale-100',
    'ease-out', 'ease-in',
]">Ekspresi Array</div>

<div x-flux="{
    'enter': 'transition duration-300',
    'enter-start': 'opacity-0 scale-90',
    'enter-end': 'opacity-100 scale-100',
    'leave': 'transition duration-300',
    'leave-start': 'opacity-100 scale-100',
    'leave-end': 'opacity-0 scale-90',
}">Ekspresi Objek</div>

<div x-flux="'opacity-scale'">Panggil Template</div>
```

### Magic `$flux`

#### `$flux(templateName, newTemplate = null, applyToElement = true)`
Digunakan untuk membuat template baru, atau memanggil template yang sudah didefinisikan di konfigurasi.

Parameter | Tipe | Deskripsi
--- | --- | ---
`templateName` | `String` | Nama template, harus kebab-case
`newTemplate` | `Array` atau `Object` | Template baru yang akan dibuat
`applyToElement` | `Boolean` | Apakah template yang dibuat akan otomatis di terapkan pada elemen

```html
<div x-init="$flux('opacity-scale', [
    'transition duration-300',
    'opacity-0 scale-90',
    'opacity-100 scale-100',
    'ease-out', 'ease-in',
])">Ekspresi Array</div>

<div x-init="$flux('opacity-scale', {
    'enter': 'transition duration-300',
    'enter-start': 'opacity-0 scale-90',
    'enter-end': 'opacity-100 scale-100',
    'leave': 'transition duration-300',
    'leave-start': 'opacity-100 scale-100',
    'leave-end': 'opacity-0 scale-90',
})">Ekspresi Objek</div>

<div x-init="$flux('opacity-scale')">Panggil Template</div>
```

#### Magic dinamis
Magic yang dibuat secara otomatis berdasarkan nama template yang sudah didefinisikan di konfigurasi.
Digunakan untuk memanggil template yang sudah didefinisikan di konfigurasi.

Tidak ada parameter yang harus diberikan.

```html
<div x-init="$opacityScale">Panggil Template</div>
```

```js
Alpine.data('flux-demo', () => ({
    init() {
        this.$opacityScale();
    }
}));
```

## Stats

![](https://img.shields.io/bundlephobia/min/alpinejs-flux)
![](https://img.shields.io/npm/v/alpinejs-flux)
![](https://img.shields.io/npm/dt/alpinejs-flux)
![](https://img.shields.io/github/license/markmead/alpinejs-flux)