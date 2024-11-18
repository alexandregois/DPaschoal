export {};

declare global {
  interface Window {
    beon: Function | undefined;
    bn_search_config: Object | undefined;
    dataLayer: any[];
    loadSearchComponent: Function | undefined;
    loadSearchInputComponent: Function | undefined;
    loadSearchComponentCustom: Function | undefined;
  }
}
