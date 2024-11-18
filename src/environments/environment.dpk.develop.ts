import { portals } from './portals';

export const environment = {
  appTitle: 'DPK',
  portal: portals.dpk,
  production: false,
  apiUrl: 'https://apim-portalkd-dev.azure-api.net',
  apiProdutos: 'https://apim-portalkd-dev.azure-api.net/dpk-product',
  gtm: 'GTM-TVZCT3W',
  hotjar: '3392886', // utiliza somente em PRD
  beOn: '62b98b5e-b171-410b-ac6b-c6e8ed767b34',
  superkImageUrlPrefix: 'https://cdn-kmaxx.azureedge.net/img/',
  ocpApimsubscriptionkey: '2719488213aa49aba23a8c50fe8fce63',
  links: {
    QUEM_SOMOS: 'https://www.dpk.com.br/sobre-nos/',
  },
  footer: {
    logo: {
      text: 'DPK é a distribuidora automotiva do Grupo DPaschoal. Atuante desde 1987, está presente em 13 estados brasileiros e conta com um avançado sistema de distribuição de produtos.',
    },
    redesSociais: [
      {
        text: 'facebook',
        url: 'https://pt-br.facebook.com/DPKDistribuidoraAutomotiva/',
      },
      {
        text: 'instagram',
        url: 'https://www.instagram.com/dpk_distribuidora/',
      },
      { text: 'youtube', url: 'https://www.youtube.com/user/DPKDistribuidora' },
      {
        text: 'linkedin',
        url: 'https://www.linkedin.com/company/dpk?originalSubdomain=br',
      },
    ],
    sac: [
      {
        text: '19 3728 8440',
        url: 'https://api.whatsapp.com/send?phone=551937288440&text=Ol%C3%A1,%20preciso%20de%20ajuda!',
        icon: 'phone',
      },
      {
        text: 'sac@dpk.com.br',
        url: '',
        icon: 'mail',
      },
    ],
    links: [
      {
        text: 'Institucional',
        url: 'https://www.dpk.com.br/',
        external: true,
      },
      {
        text: 'Filiais',
        url: 'https://www.dpk.com.br/',
        external: true,
      },
      {
        text: 'Fornecedores',
        url: 'https://www.dpk.com.br/fornecedores-linha-leve/',
        external: true,
      },
      {
        text: 'Rede Maxxiservice',
        url: 'http://maxxiservice.com.br/',
        external: true,
      },
      {
        text: 'Fale conosco',
        url: 'https://www.dpk.com.br/fale-conosco/',
        external: true,
      },
      // { text: 'Compre Agora', url: '/', external: false },
      {
        text: 'LGPD',
        url: 'https://www.grupodpaschoal.com.br/conteudo-lgpd/',
        external: true,
      },
      {
        text: 'Política de Privacidade',
        url: 'https://www.grupodpaschoal.com.br/politicas-e-protecao-de-dados/',
        external: true,
      },
      {
        text: 'Trabalhe conosco',
        url: 'https://ciadpaschoal.gupy.io/',
        external: true,
      },
    ],
  },
};
