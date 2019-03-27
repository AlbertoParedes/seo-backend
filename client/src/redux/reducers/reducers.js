import { combineReducers } from 'redux';

import Clientes from './Global/reducer-clientes';
import Empleado from './Global/reducer-empleado';
import Empleados from './Global/reducer-empleados';
import ClienteSeleccionado from './Global/reducer-cliente-seleccionado'
import PanelHome from './Global/reducer-panel-home'
import ItemsClientes from './Global/reducer-items-clientes'

/*Panel clientes*/
import PanelClientes from './clientes/reducer-panel-clientes'
import FiltroClientesLista from './clientes/reducer-filtro-clientes-lista'
import ItemsClientesLista from './clientes/reducer-items-clientes-lista'
import ClientesListaEdit from './clientes/reducer-clientes-lista-edit'
/*--------------*/




/*Panel linkbuilding*/
import Linbuilding from './linkbuilding/reducer-linkbuilding'
/*--------------*/


//Tracking -------------------------------------------------
import ItemsTrackingKeywords from './tracking/reducer-items-tracking-keywords'
import FiltroTrackingLista from './tracking/reducer-filtro-tracking-lista'
import FiltroTrackingKeywords from './tracking/reducer-filtro-tracking-keywords'
import PanelTracking from './tracking/reducer-panel-tracking'
import KeywordTrackingSelected from './tracking/reducer-keyword-tracking-selected'
import TrackingKeywordEdit from './tracking/reducer-tracking-keyword-edit'
import TrackingClientesEdit from './tracking/reducer-tracking-clientes-edit'
/*--------------------------------------------------------*/

const allReducers = combineReducers({
  clientes : Clientes,
  empleado: Empleado,
  empleados: Empleados,

  /*Panel clientes*/
  panel_clientes: PanelClientes,
  filtros_clientes_lista: FiltroClientesLista,
  items_clientes_lista: ItemsClientesLista,
  clientes_lista_edit: ClientesListaEdit,
  /*--------------*/

  /*Panel linkbuilding*/
  linkbuilding:Linbuilding,
  /*--------------*/

  cliente_seleccionado:ClienteSeleccionado,

  items_clientes: ItemsClientes,
  panel_home:PanelHome,

  panel_tracking:PanelTracking,
  filtros_tracking_lista: FiltroTrackingLista,
  filtros_tracking_keywords: FiltroTrackingKeywords,
  keyword_tracking_selected: KeywordTrackingSelected,

  tracking_keywords_edit: TrackingKeywordEdit,
  tracking_clientes_edit: TrackingClientesEdit,
  items_tracking_keywords: ItemsTrackingKeywords,
});

export default allReducers;



/*

Esto hay que poner en el componente en el que se quiere asignar un valor global:

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setDataEjemplo } from '../../redux/actions/actions';

------------------------------------------------------------------------------------------------
this.props.setDataEjemplo(newData);
------------------------------------------------------------------------------------------------

function mapStateToProps(state){return{dataEjemplo : state.dataEjemplo,}}
function matchDispatchToProps(dispatch){return bindActionCreators({ setDataEjemplo }, dispatch)}
export default connect(mapStateToProps, matchDispatchToProps)(Nombre de la clase);

*/
