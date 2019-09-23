import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NewTask from './NewTask'
import EditTask from './EditTask'
import ItemTarea from './ItemTarea'
import { setSortTableClientesFreeLB, setItemsLoadTableClientesFreeLB, setInfoTableClientesFreeLB } from '../../../../../redux/actions';
import firebase from '../../../../../firebase/Firebase';
import moment from 'moment'
const db = firebase.firestore();
class PanelLista extends Component {

  constructor(props) {
    super(props);
    this.state = {

      sortBy: this.props.sortBy,
      des: this.props.des,
      search: this.props.search,
      searchBy: this.props.searchBy,

      items: this.props.items,
      filtros: this.props.filtros,

      tareas: {},
      tareas_ordenadas: []

    };
  }

  componentWillReceiveProps = newProps => {
    if (this.state.tarea_seleccionada !== newProps.tarea_seleccionada) { this.setState({ tarea_seleccionada: newProps.tarea_seleccionada }, () => this.getTareaDB()) }
  }

  componentWillMount = () => {

    this.getData()
  }

  getTareaDB = () => {
    db.collection(`Servicios/Tareas/tareas/${this.state.tarea_seleccionada}/logs`).onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.data());
      });
    })
  }

  getData = () => {

    console.log(this.props.cliente_seleccionado);


    var taskRef = db.collection('Servicios/Tareas/tareas');
    taskRef = taskRef.where(`id_cliente`, '==', this.props.cliente_seleccionado.id_cliente)
    //taskRef = taskRef.where(`eliminado`, '==', true)

    taskRef.onSnapshot(snapshot => {
      var tareas = {}
      snapshot.forEach(doc => {
        tareas[doc.id] = doc.data()

        var a = moment();
        var b = moment(doc.data().fecha_limite)
        tareas[doc.id].diferencia_dias = a.diff(b, 'days')

      });
      this.setState({ tareas }, () => this.ordenarTareas())
    })
  }

  ordenarTareas = () => {
    var tareas_ordenadas = Object.entries(this.state.tareas)

    if (this.state.search.trim() !== '') {
      /*tareas_ordenadas = tareas_ordenadas.filter(item=>{
        return item[1][this.state.searchBy] && functions.limpiarString(item[1][this.state.searchBy]).includes(functions.limpiarString(this.state.search))
      })
      */
    }


    //filtramos por los filtros seleccionados

    /*const filtros = this.state.filtros;
    clientes_ordenados = clientes_ordenados.filter( (item)=>{
      item=item[1];
      var empleado = false;
      try {
        if(item.empleados && item.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados){
          empleado = Object.entries(item.servicios.linkbuilding.free.home.mensualidades[this.state.fecha].empleados).some(([k,e])=>{
            return filtros.empleados.items[k].checked
          })
        }
      } catch (e) {   }

      if(
          ( (filtros.empleados.todos && filtros.empleados.todos.checked) || empleado ) &&
          ( (filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.servicios.linkbuilding.free.activo && !item.eliminado) || (filtros.status.items.pausados.checked && !item.servicios.linkbuilding.free.activo && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)       ) &&
          ( (filtros.tipo_cliente.todos && filtros.tipo_cliente.todos.checked) || (item.tipo!=='pause' && filtros.tipo_cliente.items[item.tipo].checked   )     )

        ){
        return true
      }
      return false;
    })

    */
    console.log(this.state.sortBy);

    tareas_ordenadas.sort((a, b) => {
      a = a[1]; b = b[1]



      if (a[this.state.sortBy] > b[this.state.sortBy]) { return 1; }
      if (a[this.state.sortBy] < b[this.state.sortBy]) { return -1; }

      return 0;
    });

    if (this.state.des) { tareas_ordenadas.reverse(); }


    this.setState({ tareas_ordenadas }, () => { })
  }

  render() {

    return (
      <div id='container-clientes-task' className='container-table min-panel-medios-free pdd_0 overflow_v_hidden' ref={scroller => { this.scroller = scroller }} onScroll={this.handleScroll}>
        <div id='container-clientes-task-list'>

          <div>

            <table id='table-clientes-task'>
              <thead>
                <tr>

                  {/*this.props.tracking_clientes_edit.activo?
                      <th className='lb-clientes-checkbox' > <span></span> </th> :null
                    */}

                  <th onClick={() => this.changeSort('status')} className='tk-clientes-status' >
                    <span>Estado</span> {this.state.sortBy === 'status' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th className='tk-clientes-title' >
                    <span>Titulo</span>
                  </th>

                  

                  

                  {/* 
                  <th onClick={() => this.changeSort('diasRestantes')} className='tk-clientes-diasRestantes'>
                    <span>Dias restantes</span> {this.state.sortBy === 'diasRestantes' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>
                  */}

                  <th onClick={() => this.changeSort('empleados')} className='tk-clientes-empleados'>
                    <span>Empleados</span> {this.state.sortBy === 'empleados' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.changeSort('due')} className='tk-clientes-due'>
                    <span>Fecha fin</span> {this.state.sortBy === 'due' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.changeSort('prioridad')} className='tk-clientes-prioridad'>
                    <span>Prioridad</span> {this.state.sortBy === 'prioridad' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th className='tk-clientes-more'></th>

                </tr>
              </thead>
              <tbody>

                {
                  this.state.tareas_ordenadas.reduce((result, item, i) => {
                    const k = item[0], tarea = item[1];
                    if (i < this.state.items) {
                      result.push(
                        <ItemTarea key={k} tarea={tarea} tarea_seleccionada={this.state.tarea_seleccionada} />
                      );
                    }
                    return result;
                  }, [])
                }
              </tbody>
            </table>
          </div>



        </div>

        {this.props.addTask && !this.props.editTask ?

          <NewTask />

          : null}

        {this.props.editTask && this.state.tareas && this.state.tareas[this.state.tarea_seleccionada] && this.state.tarea_seleccionada ?

          <EditTask mode='edit' tarea={this.state.tareas[this.state.tarea_seleccionada]} />

          : null}

      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    filtros: state.clients.task.lista.filtros,
    addTask: state.clients.task.addTask,
    editTask: state.clients.task.editTask,
    tarea_seleccionada: state.clients.task.tarea_seleccionada,

    search: state.clients.task.lista.search,
    searchBy: state.clients.task.lista.searchBy,
    sortBy: state.clients.task.lista.sortBy,
    des: state.clients.task.lista.des,
    items: state.clients.task.lista.items_loaded,

    empleado: state.empleado,
    cliente_seleccionado: state.cliente_seleccionado
  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setSortTableClientesFreeLB, setItemsLoadTableClientesFreeLB, setInfoTableClientesFreeLB }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
