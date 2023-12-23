# Eleventy Plugin OG Image [![npm](https://img.shields.io/npm/v/eleventy-plugin-og-image?color=blue)](https://www.npmjs.com/package/eleventy-plugin-og-image)

This plugin helps to create Open Graph images in [Eleventy](https://www.11ty.dev/) using a template language of your choice[^1] and CSS[^2] via [satori](https://github.com/vercel/satori). No headless browser will be harmed 😉.

## Usage

> [!IMPORTANT]  
> This is an [ESM package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). Your eleventy project needs to use ESM from `eleventy-plugin-og-image@3.0.0` onwards, which also requires `@11ty/eleventy3.0.0` or greater. 

Install the package:

```shell
npm install eleventy-plugin-og-image --save-dev
```

Add the plugin to your `.eleventy.js`:

```js
import EleventyPluginOgImage from 'eleventy-plugin-og-image';

/** @param { import('@11ty/eleventy/src/UserConfig').default } eleventyConfig */
const config = (eleventyConfig) => {
  eleventyConfig.addPlugin(EleventyPluginOgImage, {
    satoriOptions: {
      fonts: [
        {
          name: 'Inter',
          data: fs.readFileSync('../path/to/font-file/inter.woff'),
          weight: 700,
          style: 'normal',
        },
      ],
    },
  });
};

export default config;
```

Create an OG-image-template, using the supported HTML elements[^1] and CSS properties[^2]. CSS in `<style>` tags will be inlined, remote images fetched. This is an example `og-image.og.njk`:

```njk
<style>
    .root {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        background: linear-gradient(135deg, #ef629f, #eecda3);
    }

    .title {
        color: white;
        font-size: 80px;
        margin: auto 0;
    }
</style>

<div class="root">
    <h1 class="title">{{ title }}</h1>
</div>
```

Call the `ogImage` shortcode inside the `<head>` in a template. The first argument is the filePath of the OG-image-template (required), second argument is for data (optional). Usage example in Nunjucks, e.g. `example-page.njk`:

```njk
{% ogImage "./og-image.og.njk", { title: "Hello World!" } %}
```

### Result

Generated OG image `_site/og-images/s0m3h4sh.png`:

![Generated OG image](./assets/og-image.png)

HTML output generated by the shortcode in `_site/example-page/index.html` (can be modified via the `generateHTML` option):

```html
<meta property="og:image" content="/og-images/s0m3h4sh.png" />
```

For applied usage see the [example](./example).

> [!TIP]
> The template language of the page and OG-image-template can be mixed and matched.

## Configuration

The following options can be passed when adding the plugin:

| Property              | Type                                                                                                       | Default                                   |                                                                                             |
|-----------------------|------------------------------------------------------------------------------------------------------------|-------------------------------------------|---------------------------------------------------------------------------------------------|
| `inputFileGlob`       | `glob`                                                                                                     | `**/*.og.*`                               | This must match the OG-image-templates to prevent HTML compilation.                         |
| `getOutputFileSlug`   | `function`                                                                                                 | [See source](src/mergeOptions.js)         | Generation of the output file slug. Return must be url safe and exclude the file extension. |
| `outputFileExtension` | [sharp output file formats](https://sharp.pixelplumbing.com/api-output#toformat)                           | `png`                                     |                                                                                             |
| `outputDir`           | `string`                                                                                                   | `_site/og-images/`                        | Directory into which OG images will be emitted. Change `urlPath` accordingly.               |
| `urlPath`             | `string`                                                                                                   | `/og-images/`                             | URL-prefix which will be used in returned meta-tags. Change `outputDir` accordingly.        |
| `generateHTML`        | `function`                                                                                                 | [See source](src/mergeOptions.js)         | Change the rendered HTML in pages.                                                          |
| `satoriOptions`       | [satori options](https://github.com/search?q=repo:vercel/satori+%22export+type+SatoriOptions%22&type=code) | `{ width: 1200, height: 630, fonts: [] }` | If an OG-image-template contains text, it's required to load a font ([example](#usage)).    |
| `sharpOptions`        | [sharp output options](https://sharp.pixelplumbing.com/api-output#toformat)                                | `undefined`                               | Options must be corresponding to chosen `outputFileExtension`.                              |

## Development Mode

During development the OG image file name is the url slug of the page it's generated from. In production builds, a hash of the content will be used. You'll have to handle this yourself, if you pass a custom `getOutputFileSlug`.

## Advanced Usage

### Custom Shortcode

If you would like to build your own shortcode, you can directly use the `renderOgImage` function.

```js
import { renderOgImage } from 'eleventy-plugin-og-image/render';

const { html, svg, pngBuffer } = await renderOgImage({ inputPath, data, satoriOptions, templateConfig });
```

### Capture Output URL

If you don't want to directly generate HTML with the shortcode, you can modify the `generateHTML` option to directly return the `outputUrl`:

```js
eleventyConfig.addPlugin(EleventyPluginOgImage, {
  generateHTML: (outputUrl) => outputUrl,
});
```

Now you can capture the `outputUrl` in your page, e.g. in Nunjucks:

```njk
{% setAsync "ogOutputUrl" -%}
    {% ogImage "./og-image.og.njk", { title: "Hello World!" } %}
{%- endsetAsync %}
```

And use it anywhere below with `{{ ogOutputUrl }}`.

## Acknowledgements & Attributions

This plugin is deeply inspired by [@vercel/og](https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation).

Furthermore, it would not be possible without:

- [satori](https://github.com/vercel/satori)
- [resvg](https://github.com/RazrFalcon/resvg/)/[resvg-js](https://github.com/yisibl/resvg-js)
- [sharp](https://github.com/lovell/sharp)

[^1]: Only a subset of HTML elements is [supported by satori](https://github.com/vercel/satori#html-elements).
[^2]: Only a subset of CSS properties are supported by [yoga-layout](https://github.com/facebook/yoga), which is [used by satori](https://github.com/vercel/satori#css).
