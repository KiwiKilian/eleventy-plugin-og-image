# [4.0.0-beta.9](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v4.0.0-beta.8...v4.0.0-beta.9) (2024-10-05)


### Features

* update dependencies ([75aae59](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/75aae59f5c76a1089656927956d902f4c48be3a8))
* upgrade eleventy depency to stable v3 ([6e96800](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/6e9680084208eb2e853a2240820af1f8f03ee1f0))

# [4.0.0-beta.8](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v4.0.0-beta.7...v4.0.0-beta.8) (2024-07-31)


### Bug Fixes

* RenderPlugin.File import ([#267](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/267)) ([4906d64](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/4906d6420d964df728fe656a7db01449ab8fe907))

# [4.0.0-beta.7](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v4.0.0-beta.6...v4.0.0-beta.7) (2024-06-06)


### Features

* pass instance as parameter ([b04eaf6](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/b04eaf6016038632136879ee33460611bab5c61a)), closes [#252](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/252)


### BREAKING CHANGES

* outputFileSlug and shortcodeOutput options get OgImage instance as parameter instead of this

# [4.0.0-beta.6](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v4.0.0-beta.5...v4.0.0-beta.6) (2024-04-29)


### Bug Fixes

* release ([8d74d25](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/8d74d252673d2592f58062799721647ef7fd392c))

# [4.0.0-beta.5](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v4.0.0-beta.4...v4.0.0-beta.5) (2024-04-28)


### Features

* add previewHtml ([7406914](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/740691462418edc6e45dd6edb7dc6bb0ea708a6f))
* rename generateHTML to shortcodeOutput ([a5cd8fd](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/a5cd8fd76ac0014e5ba2240875592d2159c554d3))
* rename getOutputFileSlug to outputFileSlug ([3923a5c](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/3923a5c47da83f8486b54d02f37b5dd4ef48ac2f))


### BREAKING CHANGES

* rename getOutputFileSlug to outputFileSlug
* rename generateHTML to shortcodeOutput

# [4.0.0-beta.4](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v4.0.0-beta.3...v4.0.0-beta.4) (2024-04-15)


### Bug Fixes

* update docs about arrow functions ([e6639e5](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/e6639e5012df1cc0cc3d8c65ef7a990fa38b0e82)), closes [#239](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/239) [#241](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/241)

# [4.0.0-beta.3](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v4.0.0-beta.2...v4.0.0-beta.3) (2024-04-08)


### Bug Fixes

* generateHTML and outputURL capitalization ([5e911b0](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/5e911b0e785c7ec1fd8cbb140acd6664bc82318a))

# [4.0.0-beta.2](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v4.0.0-beta.1...v4.0.0-beta.2) (2024-04-07)


### Features

* use fs promises ([0953dec](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/0953decd79b591f18a8b0344c43dd821c0898fef))

# [4.0.0-beta.1](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v3.2.0-beta.5...v4.0.0-beta.1) (2024-04-07)


### Bug Fixes

* allow empty options for mergeOptions ([380a3c3](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/380a3c31b80d5100b36e47b5e712fb9a2dc5cf01))
* generateHTML type ([f86acd4](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/f86acd4ba4cc25a1f8003c0c9f7ac7a00cf4a6d0))
* join directories with output and preview dir ([155c7d8](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/155c7d866d77b4c127ae709eb06388ddc2a0316a))


### Features

* add cache file path ([9b3a1d6](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/9b3a1d60f7e24c7c95283de2b748b32383413575))
* add caching ([17b46f3](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/17b46f399c43dbabeedcf843b8bec4e6b87e93d7))
* add exports ([263499b](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/263499b065f81291c8716bd147917f456816e5e9))
* allow OgImage custom class ([d31d320](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/d31d32036556f84fbfbf146e0aaa5f3dbcd63eb8))
* improve preview path handling ([4462d10](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/4462d107d5c008b6ef2e650277c3a60c15976467))
* improve types of this for function parameters ([5b0b269](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/5b0b269814e40cbea00ffcebbc9aaccda35e4cb5))
* reduce recalculations ([6a69780](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/6a697800d98af9d4e5b67de86aa4fed04d96cf3c))
* set previewDir based on outputDir ([93906ec](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/93906eca0ea989b6e78c6d8c7a2919dcce0d181e))
* urlPath default to outputDir ([fe9d54f](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/fe9d54fe7b18860d53cacc221d41055ae6b0804f))


### BREAKING CHANGES

* Plugin structure changed to OgImage class
* Options changed, consult docs before upgrading

# [3.2.0-beta.5](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v3.2.0-beta.4...v3.2.0-beta.5) (2024-03-23)


### Bug Fixes

* hashes without special chars with hex digest ([47fb387](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/47fb387e9515c188a8710878c80e57a0de3a6cca))
* outputUrl on windows with forward slash ([e1bff34](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/e1bff342a878876f6bc840e94edfa39b1ca7fa72)), closes [#234](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/234)

# [3.2.0-beta.4](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v3.2.0-beta.3...v3.2.0-beta.4) (2024-01-14)


### Features

* add eleventyPluginOgImage data to rendering ([b63cc55](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/b63cc55ea57e7aef096181f4edeae6dcbcb4918f)), closes [#215](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/215)

# [3.2.0-beta.3](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v3.2.0-beta.2...v3.2.0-beta.3) (2024-01-07)


### Bug Fixes

* align logging paths ([5491207](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/5491207214f961647249f5f83f7bd307b494a840))


### Features

* pass shortcode scoped data to OG templates ([a240aee](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/a240aee5ca49015605c307dc58d64e5ca64373d8)), closes [#211](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/211)

# [3.2.0-beta.2](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v3.2.0-beta.1...v3.2.0-beta.2) (2023-12-23)


### Bug Fixes

* type imports ([24aa37b](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/24aa37b8f86c16eb1ec947a5b331de60534c90ac))
* use released alpha version ([bb8519c](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/bb8519c7c1e57629804a3937bb1c4f0049c4309c))

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

## [2.1.3](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v2.1.2...v2.1.3) (2024-03-23)


### Bug Fixes

* hashes without special chars with hex digest ([47fb387](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/47fb387e9515c188a8710878c80e57a0de3a6cca))

## [2.1.2](https://github.com/KiwiKilian/eleventy-plugin-og-image/compare/v2.1.1...v2.1.2) (2024-03-23)


### Bug Fixes

* outputUrl on windows with forward slash ([e1bff34](https://github.com/KiwiKilian/eleventy-plugin-og-image/commit/e1bff342a878876f6bc840e94edfa39b1ca7fa72)), closes [#234](https://github.com/KiwiKilian/eleventy-plugin-og-image/issues/234)

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
