import { SatoriOptions } from 'satori';
import { FormatEnum, Sharp } from 'sharp';
import { OgImage } from './src/OgImage.js';

type DirectoriesConfig = {
  input: string;
  includes: string;
  data: string;
  layouts?: string;
  output: string;
};

type SharpFormatOptions = Parameters<Sharp['toFormat']>[1];

type EleventyPluginOgImageOptions = {
  inputFileGlob?: string;
  hashLength?: number;
  outputFileExtension?: keyof FormatEnum;
  outputDir?: string;
  previewDir?: string;
  urlPath?: string;

  outputFileSlug?(this: OgImage): Promise<string>;
  shortcodeOutput?(this: OgImage): Promise<string>;

  OgImage?: typeof OgImage;

  satoriOptions?: Partial<SatoriOptions>;
  sharpOptions?: SharpFormatOptions;
};

type EleventyPluginOgImageMergedOptions = Omit<
  Required<EleventyPluginOgImageOptions>,
  'OgImage' | 'satoriOptions' | 'sharpOptions'
> &
  Pick<EleventyPluginOgImageOptions, 'sharpOptions'> & {
    satoriOptions: SatoriOptions & { width: number; height: number };
  };

export { EleventyPluginOgImageOptions, EleventyPluginOgImageMergedOptions, DirectoriesConfig };
