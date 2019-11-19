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
import Clients from './clientes/reducer-clientes'
/*--------------*/



import Global from './Global/reducer-global'
/*Panel linkbuilding*/
import Linbuilding from './linkbuilding/reducer-linkbuilding'
/*--------------*/
/*Panel linkbuilding*/
import Tracking from './tracking/reducer-tracking'
/*--------------*/
import PanelEmpleado from './empleado/reducer-empleado'

const allReducers = combineReducers({
  clientes: Clientes,
  clients: Clients,
  empleado: Empleado,
  empleados: Empleados,

  /*Panel clientes*/
  panel_clientes: PanelClientes,
  filtros_clientes_lista: FiltroClientesLista,
  items_clientes_lista: ItemsClientesLista,
  clientes_lista_edit: ClientesListaEdit,
  /*--------------*/

  /*Panel linkbuilding*/
  linkbuilding: Linbuilding,
  /*--------------*/
  /*Panel linkbuilding*/
  tracking: Tracking,
  /*--------------*/

  cliente_seleccionado: ClienteSeleccionado,

  items_clientes: ItemsClientes,
  panel_home: PanelHome,

  global: Global,
  panelEmpleado : PanelEmpleado

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
