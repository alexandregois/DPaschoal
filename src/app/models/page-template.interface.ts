export enum PageTemplates {
  'FULLSCREEN' = 'FULLSCREEN',
  'NO_WRAPPER' = 'NO_WRAPPER',
  'NO_CONTAINER' = 'NO_CONTAINER',
  'DEFAULT' = 'DEFAULT',
}

export type PageTemplate = keyof typeof PageTemplates;
