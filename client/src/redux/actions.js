
export const setClientes = (clientes) => {
  return {
    type: "CLIENTES",
    clientes
  }
}

export const setEmpleados = (empleados) => {
  return {
    type: "EMPLEADOS",
    empleados
  }
}
export const setEmpleado = (empleado) => {
  return {
    type: "EMPLEADO",
    empleado
  }
}

export const setFiltrosTrackingLista = (filtros_tracking_lista) => {
  return {
    type: "FILTROS_TRACKING_LISTA",
    filtros_tracking_lista
  }
}
export const setFiltrosTrackingKeywords = (filtros_tracking_keywords) => {
  return {
    type: "FILTROS_TRACKING_KEYWORDS",
    filtros_tracking_keywords
  }
}

export const setClienteSeleccionado = (cliente_seleccionado) => {
  return {
    type: "CLIENTE_SELECCIONADO",
    cliente_seleccionado
  }
}

export const setPanelTracking = (panel_tracking) => {
  return {
    type: "PANEL_TRACKING",
    panel_tracking
  }
}

export const setItemsClientes = (items_clientes) => {
  return {
    type: "ITEMS_CLIENTES",
    items_clientes
  }
}
export const setItemsTrackingKeywords = (items_tracking_keywords) => {
  return {
    type: "ITEMS_TRACKING_KEYWORDS",
    items_tracking_keywords
  }
}

export const setPanelHome = (panel_home) => {
  return {
    type: "PANEL_HOME",
    panel_home
  }
}

export const setKeywordTrackingSelected = (keyword_tracking_selected) => {
  return {
    type: "KEYWORD_TRACKING_SELECTED",
    keyword_tracking_selected
  }
}

export const setEditKeywordsTracking = (tracking_keywords_edit) => {
  return {
    type: "TRACKING_KEYWORDS_EDIT",
    tracking_keywords_edit
  }
}
export const setEditClientesTracking = (tracking_clientes_edit) => {
  return {
    type: "TRACKING_CLIENTES_EDIT",
    tracking_clientes_edit
  }
}






/*Panel clientes*/
export const setPanelClientes = panel_clientes =>{
  return { type: 'PANEL_CLIENTES', panel_clientes }
}
export const setFiltrosClientesLista = (filtros_clientes_lista) => {
  return { type: "FILTROS_CLIENTES_LISTA", filtros_clientes_lista }
}
export const setItemsClientesLista = (items_clientes_lista) => {
  return { type: "ITEMS_CLIENTES_LISTA", items_clientes_lista }
}
export const setEditClientesLista = (clientes_lista_edit) => {
  return { type: "CLIENTES_LISTA_EDIT", clientes_lista_edit }
}
/*--------------*/





/*Panel Linkbuilding*/
export const setVistaLinkBuilding = vistas =>{
  return { type: 'LB_VISTAS', vistas }
}
export const setPanelClientesLinkbuilding = panel =>{
  return { type: 'LB_PANEL_CLIENTES', panel }
}
export const setPanelEnlacesLinkbuilding = panel =>{
  return { type: 'LB_PANEL_ENLACES', panel }
}


export const setFiltrosClientesFreeListaLinkbuilding = filtros =>{
  return { type: 'LB_FILTROS_CLIENTES_FREE_LISTA', filtros }
}

export const setFiltrosClientesPaidListaLinkbuilding = filtros =>{
  return { type: 'LB_FILTROS_CLIENTES_PAID_LISTA', filtros }
}


export const setFiltrosMediosFreeListaLinkbuilding = filtros =>{
  return { type: 'LB_FILTROS_MEDIOS_FREE_LISTA', filtros }
}
export const setPanelMediosFreeLinkbuilding = panel =>{
  return { type: 'LB_PANEL_MEDIOS_FREE', panel }
}
export const selectCategoriaMediosGratuitos = categoria_seleccionada =>{
  return { type: 'LB_CATEGORIA_MEDIOS_FREE', categoria_seleccionada }
}
export const selectMedioMediosGratuitos = medio_seleccionado =>{
  return { type: 'LB_MEDIO_MEDIOS_FREE', medio_seleccionado }
}
export const setItemsClientesMedioFreeLB = items_info =>{
  return { type: 'LB_PANEL_MEDIOS_FREE_ITEMS_INFO', items_info }
}






export const setSortTableClientesFreeLB = data =>{
  return { type: 'LB_SORTBY_DES_CLIENTES_LISTA', data }
}
export const setSearchTableClientesFreeLB = text =>{
  return { type: 'LB_SEARCH_DES_CLIENTES_LISTA', text }
}
export const setSearchByTableClientesFreeLB = text =>{
  return { type: 'LB_SEARCHBY_DES_CLIENTES_LISTA', text }
}
export const setItemsLoadTableClientesFreeLB = items =>{
  return { type: 'LB_ITEMS_LOADED_DES_CLIENTES_LISTA', items }
}
export const setInfoTableClientesFreeLB = items_info =>{
  return { type: 'LB_INFO_CLIENTES_FREE', items_info }
}

export const setSortTableClientesPaidLB = data =>{
  return { type: 'LB_SORTBY_DES_CLIENTES_LISTA_PAID', data }
}
export const setSearchTableClientesPaidLB = text =>{
  return { type: 'LB_SEARCH_DES_CLIENTES_LISTA_PAID', text }
}
export const setSearchByTableClientesPaidLB = text =>{
  return { type: 'LB_SEARCHBY_DES_CLIENTES_LISTA_PAID', text }
}
export const setItemsLoadTableClientesPaidLB = items =>{
  return { type: 'LB_ITEMS_LOADED_DES_CLIENTES_LISTA_PAID', items }
}
export const setInfoTableClientesPaidLB = items_info =>{
  return { type: 'LB_INFO_CLIENTES_PAID', items_info }
}




export const setMediosFree = medios =>{
  return { type: 'LB_MEDIOS_FREE', medios }
}




export const setMediosPaid = medios =>{
  return { type: 'LB_MEDIOS_PAID', medios }
}

export const setMedioSeleccionadoPaid = medio =>{
  return { type: 'LB_MEDIO_MEDIOS_PAID', medio }
}

export const setFiltrosMediosPaidListaLinkbuilding = filtros =>{
  return { type: 'LB_FILTROS_MEDIOS_PAID_LISTA', filtros }
}
export const setPanelMediosPaidLinkbuilding = panel =>{
  return { type: 'LB_PANEL_MEDIOS_PAID', panel }
}
export const setSortTableMediosPaidLB = data =>{
  return { type: 'LB_SORTBY_DES_MEDIOS_LISTA_PAID', data }
}
export const setSearchTableMediosPaidLB = text =>{
  return { type: 'LB_SEARCH_DES_MEDIOS_LISTA_PAID', text }
}
export const setSearchByTableMediosPaidLB = text =>{
  return { type: 'LB_SEARCHBY_DES_MEDIOS_LISTA_PAID', text }
}
export const setItemsLoadTableMediosPaidLB = items =>{
  return { type: 'LB_ITEMS_LOADED_DES_MEDIOS_LISTA_PAID', items }
}
export const setInfoTableMediosPaidLB = items_info =>{
  return { type: 'LB_INFO_MEDIOS_PAID', items_info }
}







export const setFiltrosEnlacesFreeListaLinkbuilding = filtros =>{
  return { type: 'LB_FILTROS_ENLACES_FREE_LISTA', filtros }
}
export const setPanelEnlacesFreeLinkbuilding = panel =>{
  return { type: 'LB_PANEL_ENLACES_FREE', panel }
}
export const setSortTableEnlacesFreeLB = data =>{
  return { type: 'LB_SORTBY_DES_ENLACES_LISTA_FREE', data }
}
export const setSearchTableEnlacesFreeLB = text =>{
  return { type: 'LB_SEARCH_DES_ENLACES_LISTA_FREE', text }
}
export const setSearchByTableEnlacesFreeLB = text =>{
  return { type: 'LB_SEARCHBY_DES_ENLACES_LISTA_FREE', text }
}
export const setItemsLoadTableEnlacesFreeLB = items =>{
  return { type: 'LB_ITEMS_LOADED_DES_ENLACES_LISTA_FREE', items }
}
export const setInfoTableEnlacesFreeLB = items_info =>{
  return { type: 'LB_INFO_ENLACES_FREE', items_info }
}




export const setFiltrosFreePaid = newType =>{
  return { type: 'FILTROS-FREE-PAID', newType }
}
export const setPanelClientesFreeLinkbuilding = panel =>{
  return { type: 'LB_PANEL_CLIENTES_FREE', panel }
}
export const setPanelClientesPaidLinkbuilding = panel =>{
  return {type:'LB_PANEL_CLIENTES_PAID', panel}
}


export const setFechaEnlaces = fecha =>{
  return {type:'SET_FECHA_ENLACES', fecha}
}
export const setEnlacesFree = enlaces =>{
  return {type:'SET_ENLACES_FREE', enlaces}
}



/*--------------*/
