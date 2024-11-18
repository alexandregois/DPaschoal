import { portals } from './portals';

export const environment = {
  appTitle: 'KDP',
  portal: portals.kdp,
  production: false,
  apiUrl: 'https://apim-connect-prd-southcentralus.azure-api.net',
  apiProdutos: 'https://apim-connect-prd-southcentralus.azure-api.net',
  gtm: 'GTM-TNS77HV',
  hotjar: '', // utiliza somente em PRD
  beOn: 'b404699f-3119-4231-9dba-9af011c1b05f',
  superkImageUrlPrefix: 'https://cdn-kmaxx.azureedge.net/img/',
  ocpApimsubscriptionkey: '275d7ab4911f4f37b75c9ba472aaaa80',
  links: {
    QUEM_SOMOS: 'https://institucional.portalkdp.com.br/',
  },
  footer: {
    logo: {
      text: 'A KDP é a distribuidora digital de peças e pneus da DPaschoal disponível 24h para abastecer os centros automotivos do Brasil com pneus GoodYear.',
    },
    redesSociais: [
      {
        text: 'facebook',
        url: 'https://www.facebook.com/kdp.dpaschoal.3',
      },
      {
        text: 'instagram',
        url: 'https://www.instagram.com/kdp_distribuidora_dpa/?hl=pt',
      },
    ],
    sac: [
      {
        text: '0800 012 02 32',
        url: 'https://api.whatsapp.com/send?phone=551937288440&text=Ol%C3%A1,%20preciso%20de%20ajuda!',
        icon: 'phone',
      },
      {
        text: 'contatokdp@dpaschoal.com.br',
        url: '',
        icon: 'mail',
      },
    ],
    links: [
      {
        text: 'Institucional',
        url: 'https://institucional.portalkdp.com.br',
        external: true,
      },
      {
        text: 'Fornecedores',
        url: 'https://institucional.portalkdp.com.br/fornecedores',
        external: true,
      },
      {
        text: 'Rede TOP Service',
        url: 'http://www.topservice.dpaschoal.com.br/',
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
