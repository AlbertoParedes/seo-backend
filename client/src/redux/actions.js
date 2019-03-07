
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
