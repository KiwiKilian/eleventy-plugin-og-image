# [3.2.0-beta.1](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v3.1.0...v3.2.0-beta.1) (2023-12-05)


### Features

* upgrade sharp ([0fa8b23](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/0fa8b23975a752522606eea6abbb2ce2d20220ba))

# [3.1.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v3.0.0...v3.1.0) (2023-11-11)


### Bug Fixes

* align outputFilePath format ([7567630](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/75676308ef0ee8d3c909e10740d183f593b6388a))
* resolve pathes relativ to input ([02647a8](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/02647a843c71d3994b8e7f61cf2f00d3325ca559))
* upgrade eleventy peerDependency and compatibility ([34223f0](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/34223f0dcf26906ea161da253bfa5e7240a40113))


### Features

* improve example font loading ([7261b66](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/7261b660896aed85d57f0e4fb5953090ec362fa3))

# [3.0.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v2.1.1...v3.0.0) (2023-10-29)


### Features

* drop node 16 support ([83b88da](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/83b88da1570730d3c4547afd943e62f8ac788c41))
* switch to ESM module ([21219b6](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/21219b6520660b250e5cd784c178f631957572ff))


### BREAKING CHANGES

* This package is now ESM-only to drop postinstall build steps
* node >= 18 required

## [2.1.1](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v2.1.0...v2.1.1) (2023-09-02)


### Bug Fixes

* @11ty/eleventy >= 2.x.x is required ([#164](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/164)) ([f2d6aa8](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/f2d6aa83da8b4c0eb9faf726236fdb227d0785c7))
* omit output for permalink false ([#163](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/163)) ([432edd0](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/432edd0ad35de86998569ebdabc57a763cfc3eea))

# [2.1.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v2.0.1...v2.1.0) (2023-08-30)


### Features

* add getOutputFileSlug ([#160](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/160)) ([f55cbdc](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/f55cbdcfd561bae388207589ed595a3aa2d99865))

## [2.0.1](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v2.0.0...v2.0.1) (2023-06-13)


### Bug Fixes

* unify logging ([#131](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/131)) ([de6ca1d](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/de6ca1d0a1a694016e0292b502a9680534d4abc9))

# [2.0.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.6.2...v2.0.0) (2023-06-01)


### Features

* add development mode ([#123](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/123)) ([8711954](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/8711954c7e5dc58b507b972252a32389dc0fbef7))


### BREAKING CHANGES

* switch `renderOgImage` parameters to object style

## [1.6.2](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.6.1...v1.6.2) (2023-05-24)


### Bug Fixes

* exports of types ([#120](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/120)) ([e679ebb](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/e679ebb1a7f822ccd518b1af4c17d0629303581f))

## [1.6.1](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.6.0...v1.6.1) (2023-03-03)


### Bug Fixes

* use export to resolve yoga.wasm ([#78](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/78)) ([fdb4d20](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/fdb4d20fd369baac62be428efd3930c040e0c1cb))

# [1.6.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.5.0...v1.6.0) (2023-02-23)


### Features

* clear outputDir on eleventy.build event ([#74](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/74)) ([3e60531](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/3e60531e01f333c637cd9f330ff1e63bdd2d2945))

# [1.5.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.4.2...v1.5.0) (2023-02-20)


### Features

* use yoga-wasm-web ([#72](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/72)) ([d189d35](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/d189d351325f1b1b7f550273638977d849b4c37c))

## [1.4.2](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.4.1...v1.4.2) (2023-01-25)


### Bug Fixes

* @11ty/eleventy as peerDependency ([#57](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/57)) ([48b2353](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/48b2353c22ffea76240b9d208ab3da579e690862))

## [1.4.1](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.4.0...v1.4.1) (2023-01-16)


### Bug Fixes

* align node minimum version with eleventy ([#50](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/50)) ([1a55b78](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/1a55b78767fcd42e0f21def605e8b884231fa172))

# [1.4.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.3.0...v1.4.0) (2023-01-11)


### Bug Fixes

* satori with yoga-layout-prebuilt ([5a91800](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/5a918009bc2e224a368e6aa1384deebb6010b753))


### Features

* inputFileGlob now ignores in subDirectories ([#48](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/48)) ([aef85eb](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/aef85eb5238162d5d2c6a287dc45178ba2930da2))

# [1.3.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.2.0...v1.3.0) (2023-01-04)


### Features

* render og image with templateConfig ([#40](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/40)) ([6884b90](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/6884b90c1e2423527a9b3c864480fee576727e1c))

# [1.2.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.1.1...v1.2.0) (2022-12-30)


### Features

* add generateHTML option ([#34](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/34)) ([aec8082](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/aec808227bc69866acdf2db11fbc9c7ef94fb113))

## [1.1.1](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.1.0...v1.1.1) (2022-12-12)


### Bug Fixes

* remove ultrahtml override ([#26](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/26)) ([220a965](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/220a965ce319852fd75a913bed4dd0133c7ce698))

# [1.1.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.0.1...v1.1.0) (2022-11-05)


### Features

* improve output behavior ([fc272c5](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/fc272c50b27bba75d0e2e075bb11b40ad2b76504)), closes [#6](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/6)

## [1.0.1](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v1.0.0...v1.0.1) (2022-11-03)


### Bug Fixes

* Enable CSS inlining ([592dec0](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/592dec0f86f5e5aa2970c1b929251a11d10af057))

# [1.0.0](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v0.1.1...v1.0.0) (2022-10-30)


### Features

* Add shortcode ([ce4df37](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/ce4df37c0b73b6e6dc0f1e1cc5b4f08ede194b3e))


### BREAKING CHANGES

* Use shortcode instead of template functionality
