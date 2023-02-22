const fs = require('fs');
const fetch = require('node-fetch');
const sharp = require('sharp');
const { TemplatePath } = require('@11ty/eleventy-utils');
const { mergeOptions } = require('./src/mergeOptions');
const { getOutputParameters } = require('./src/getOutputParameters');
const { renderOgImage } = require('./src/renderOgImage');

function rmDir(dirPath, removeSelf) {
  let files;
  try { files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (let i = 0; i < files.length; i++) {
      const filePath = `${dirPath}/${files[i]}`;
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath, true);
    }
  if (removeSelf)
    fs.rmdirSync(dirPath);
};

globalThis.fetch = fetch;

/**
 * @param { import('@11ty/eleventy/src/UserConfig') } eleventyConfig
 * @param { import('eleventy-plugin-og-image').EleventyPluginOgImageOptions } pluginOptions
 * */
module.exports = (eleventyConfig, pluginOptions) => {
  let directoriesConfig;
  eleventyConfig.on('eleventy.directories', (dir) => {
    directoriesConfig = dir;
  });

  let templateConfig;
  eleventyConfig.on('eleventy.config', (config) => {
    templateConfig = config;
  });
  
  if (pluginOptions.emptyOutputOnRebuild) {
    eleventyConfig.on('eleventy.before', () => {
      const options = mergeOptions(directoriesConfig, pluginOptions);
      rmDir(options.outputDir);
    });
  }

  eleventyConfig.ignores.add(mergeOptions(undefined, pluginOptions).inputFileGlob);

  eleventyConfig.addAsyncShortcode('ogImage', async (inputPath, data) => {
    const { satoriOptions, sharpOptions, ...options } = mergeOptions(directoriesConfig, pluginOptions);

    if (!fs.existsSync(TemplatePath.normalizeOperatingSystemFilePath(inputPath))) {
      throw new Error(`Could not find file for the \`ogImage\` shortcode, looking for: ${inputPath}`);
    }

    const { svg, pngBuffer } = await renderOgImage(inputPath, data, satoriOptions, templateConfig);

    const image = await sharp(pngBuffer).toFormat(options.outputFileExtension, sharpOptions);

    const { outputFilePath, outputUrl } = getOutputParameters(svg, options);

    if (!fs.existsSync(options.outputDir)) {
      fs.mkdirSync(options.outputDir, { recursive: true });
    }

    await image.toFile(outputFilePath);

    eleventyConfig.logger.log(`Writing OG Image ${outputFilePath} from ${inputPath}`);

    return options.generateHTML(outputUrl);
  });
};
