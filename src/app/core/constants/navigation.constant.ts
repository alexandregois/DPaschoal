import { NavigationItem } from '@core/interface/navigation-item.interface';
import { environment } from '@env';

export const CARRINHO: NavigationItem = {
  icon: 'shopping-cart',
  title: 'Carrinho',
  path: '/carrinho',
  isActive: false,
};
export const CONTATO: NavigationItem = {
  icon: 'forum',
  title: 'Contato',
  path: '/contato',
  isActive: false,
};
export const CREDITO: NavigationItem = {
  icon: 'assessment',
  title: 'Limite de crédito',
  path: '/credito',
  isActive: false,
};
export const FAVORITOS: NavigationItem = {
  icon: 'favorite_border',
  title: 'Favoritos',
  path: '/favoritos',
  external: false,
  isActive: false,
};
export const FINANCEIRO: NavigationItem = {
  icon: 'paid',
  title: 'Financeiro',
  path: '/financeiro',
  external: false,
  isActive: false,
};
export const GARANTIA: NavigationItem = {
  icon: 'shield',
  title: 'Garantia',
  path: '/garantia',
  external: false,
  isActive: false,
};
export const HOME: NavigationItem = {
  icon: 'home',
  title: 'Início',
  path: '/',
  external: false,
  isActive: false,
};
export const KITS: NavigationItem = {
  icon: 'inventory_2',
  title: 'Kits',
  path: '/categorias/kits',
  isActive: false,
};
export const MINHA_CONTA: NavigationItem = {
  icon: 'person',
  title: 'Minha conta',
  path: '/minha-conta',
  isActive: false,
};
export const OFERTAS: NavigationItem = {
  icon: 'discount',
  title: 'Ofertas',
  path: '/pagina/ofertas',
  isActive: false,
};
export const PEDIDOS: NavigationItem = {
  icon: 'shopping_bag',
  title: 'Meus pedidos',
  path: '/pedidos',
  external: false,
  isActive: false,
};
export const PERGUNTAS_FREQUENTES: NavigationItem = {
  icon: 'help-outline',
  title: 'Perguntas frequentes',
  path: '/perguntas-frequentes',
  isActive: false,
};
export const QUEM_SOMOS: NavigationItem = {
  icon: 'store',
  title: 'Quem somos',
  path: environment.links.QUEM_SOMOS,
  external: true,
  isActive: false,
};
export const WHATSAPP: NavigationItem = {
  svgIcon: '/assets/svg/whatsapp.svg',
  title: 'Whatsapp',
  path: 'https://api.whatsapp.com/send?phone=5508007704410&text=Ol%C3%A1,%20preciso%20de%20ajuda!',
  external: true,
  isActive: false,
};
export const CADASTRO: NavigationItem = {
  icon: 'person_add',
  title: 'Cadastro',
  path: '/login',
  isActive: false,
};
export const LOGIN: NavigationItem = {
  icon: 'login',
  title: 'Login',
  path: '/login',
  isActive: false,
};
export const RECUPERAR_SENHA: NavigationItem = {
  icon: 'lock_reset',
  title: 'Recuperar senha',
  path: '/recuperar-senha',
  isActive: false,
};
export const PRODUTOS: NavigationItem = {
  icon: 'inventory_2',
  title: 'Produtos',
  path: '/produtos',
  isActive: false,
};
export const CATEGORIAS: NavigationItem = {
  icon: 'inventory_2',
  title: 'Categorias',
  path: '/categorias',
  isActive: false,
};
export const BUSCA: NavigationItem = {
  icon: 'search',
  title: 'Busca',
  path: '/busca',
  isActive: false,
};
export const PAGINA: NavigationItem = {
  icon: 'search',
  title: 'Página',
  path: '/pagina',
  isActive: false,
};
