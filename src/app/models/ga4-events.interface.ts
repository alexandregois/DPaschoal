export interface GA4Data {
  coupon?: string;
  currency?: 'BRL';
  payment_type?: string;
  value?: number;
  shipping_tier?: string;
  transaction_id?: string;
  shipping?: number;
  tax?: number;
  item_list_name?: string;
  item_list_id?: string;
  items: GA4Item[];
}

export interface GA4Item {
  /*
    exemplo: SKU_12345
    "Código do item. *É preciso especificar item_id ou item_name."
  */
  item_id: string;

  /*
    exemplo: Camiseta Stan and Friends
    "Nome do item.
    *É preciso especificar item_id ou item_name."
  */
  item_name: string;

  /*
    exemplo: Google Store
    "Uma afiliação de produto para indicar uma empresa fornecedora ou loja física.
    Os parâmetros affiliation no nível do evento e do item são independentes."
  */
  affiliation?: string;

  /*
    exemplo: SUMMER_FUN
    "Nome/código do cupom associado ao item.
    Os parâmetros coupon no nível do evento e do item são independentes."
  */
  coupon?: string;

  /*
    exemplo: USD
    "Moeda no formato ISO 4217 de três letras.
    Se definido, o parâmetro currency no nível do evento será ignorado.
    Não é possível usar várias moedas por evento. Todos os itens precisam ter a mesma moeda."
  */
  currency?: string;

  /*
    exemplo: summer_banner2
    "Nome do criativo promocional.
    Se definido, o parâmetro creative_name no nível do evento será ignorado.
    Se não definido, será usado o parâmetro creative_name no nível do evento (quando presente)."
  */
  creative_name?: string;

  /*
    exemplo: featured_app_1
    "Nome do slot do criativo promocional associado ao item.
    Se definido, o parâmetro creative_slot no nível do evento será ignorado.
    Se não definido, será usado o parâmetro creative_slot no nível do evento (quando presente)."
  */
  creative_slot?: string;

  /*
    exemplo: 2,22
    Valor do desconto monetário associado ao item.
  */
  discount?: number;

  /*
    exemplo: 5
    Índice/posição do item em uma lista.
  */
  index?: number;

  /*
    exemplo: Google
    Marca do item.
  */
  item_brand?: string;

  /*
    exemplo: Vestuário
    Categoria do item. Se usada como parte de uma hierarquia de categorias ou taxonomia, será a primeira categoria.
  */
  item_category?: string;

  /*
    exemplo: Adulto
    Hierarquia da segunda categoria ou taxonomia adicional do item.
  */
  item_category2?: string;

  /*
    exemplo: Camisas
    Hierarquia da terceira categoria ou taxonomia adicional do item.
  */
  item_category3?: string;

  /*
    exemplo: Equipe
    Hierarquia da quarta categoria ou taxonomia adicional do item.
  */
  item_category4?: string;

  /*
    exemplo: Manga curta
    Hierarquia da quinta categoria ou taxonomia adicional do item.
  */
  item_category5?: string;

  /*
    exemplo: related_products
    "ID da lista em que o item foi apresentado ao usuário.
    Se definido, o parâmetro item_list_id no nível do evento será ignorado.
    Se não definido, será usado o parâmetro item_list_id no nível do evento (quando presente)."
  */
  item_list_id?: string;

  /*
    exemplo: Produtos relacionados
    "Nome da lista em que o item foi apresentado ao usuário.
    Se definido, o parâmetro item_list_name no nível do evento será ignorado.
    Se não definido, será usado o parâmetro item_list_name no nível do evento (quando presente)."
  */
  item_list_name?: string;

  /*
    exemplo: verde
    Variante, código exclusivo ou descrição do item para detalhes/opções adicionais.
  */
  item_variant?: string;

  /*
    exemplo: L_12345
    "Local associado ao item. É recomendável usar o ID do lugar do Google que corresponde ao item associado. Também é possível utilizar um código de local personalizado.
    Se definido, o parâmetro location_id no nível do evento será ignorado.
    Se não definido, será usado o parâmetro location_id no nível do evento (quando presente)."
  */
  location_id?: string;

  /*
    exemplo: 9,99
    Valor monetário do item em unidades do parâmetro de moeda especificado.
  */
  price?: number;

  /*
    exemplo: P_12345
    "Código da promoção associada ao item.
    Se definido, o parâmetro promotion_id no nível do evento será ignorado.
    Se não definido, será usado o parâmetro promotion_id no nível do evento (quando presente)."
  */
  promotion_id?: string;

  /*
    exemplo: Promoção de verão
    "Nome da promoção associada ao item.
    Se definido, o parâmetro promotion_name no nível do evento será ignorado.
    Se não definido, será usado o parâmetro promotion_name no nível do evento (quando presente)."
  */
  promotion_name?: string;

  /*
    exemplo: 1
    Quantidade do item.
  */
  quantity?: number;
}
