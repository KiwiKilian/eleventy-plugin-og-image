import { SatoriOptions } from 'satori';
import { FormatEnum, Sharp } from 'sharp';

declare type EleventyConfig = {
  dir: {
    input: string;
    includes: string;
    data: string;
    output: string;
  };
};

declare type EleventyPluginOgImageOptions = {
  inputFileGlob?: string;
  outputFileExtension?: keyof FormatEnum;
  outputDir?: string;
  urlPath?: string;
  hashLength?: number;
  generateHTML: (outputUrl: string) => string,

  satoriOptions?: Partial<SatoriOptions>;
  sharpOptions?: Parameters<Sharp['toFormat']>[1];
};

export { EleventyPluginOgImageOptions };
