import { SatoriOptions } from 'satori';
import { FormatEnum, Sharp } from 'sharp';
import TemplateConfig from '@11ty/eleventy/src/TemplateConfig';

export interface OgImage {
  inputPath: string;

  data: Record<string, any>;

  options: EleventyPluginOgImageMergedOptions;

  templateConfig: typeof TemplateConfig;

  results: {
    html?: string;
    svg?: string;
    pngBuffer?: Buffer;
  };

  html(): Promise<string>;

  svg(): Promise<string>;

  pngBuffer(): Promise<Buffer>;

  render(): Promise<Sharp>;

  hash(): Promise<string>;

  outputFileSlug(): Promise<string>;

  outputFileName(): Promise<string>;

  outputFilePath(): Promise<string>;

  outputUrl(): Promise<string>;

  cacheFilePath(): Promise<string>;

  shortcodeOutput(): Promise<string>;

  previewFilePath(): string;

  previewHtml(): Promise<string>;
}

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

  outputFileSlug?(ogImage: OgImage): Promise<string>;
  shortcodeOutput?(ogImage: OgImage): Promise<string>;

  OgImage?: OgImage;

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
