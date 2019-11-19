import React, {Component} from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOrderTareasEmpleado } from '../../../../redux/actions';
import ItemTarea from '../../../Clientes/Paneles/PanelTareas/Paneles/ItemTarea'
import EditTask from '../../../Clientes/Paneles/PanelTareas/Paneles/EditTask'
import moment from 'moment'
import firebase from '../../../../firebase/Firebase';
import * as functions from '../../../Global/functions'
const dbCloud = firebase.firestore();
const ITEMS = 50;
class Lista extends Component {

  constructor(props){
    super(props)
    this.state={
      tareas: {},
      tarea_seleccionada: this.props.tarea_seleccionada,
      tareasEmpleado: this.props.tareasEmpleado,
      tareasOrdenadas:[],
      tareasCompletadas: {},
      filtros: this.props.filtros,
      items: ITEMS,
      peticionCompletadas:false,

      sortBy:this.props.sortBy, 
      des:this.props.des,
      searchBy:this.props.searchBy,
      search:this.props.search,
    }
  }
  componentWillMount = () => {
    this.getTareas()
  }
  componentWillReceiveProps = (newProps) => {
    if (this.state.tarea_seleccionada !== newProps.tarea_seleccionada) { this.setState({ tarea_seleccionada: newProps.tarea_seleccionada }, () => this.getTareaDB()) }
    if(this.state.filtros!==newProps.filtros){
      this.setState({filtros:newProps.filtros}, () => {this.getTareas()})
    }

    if(this.state.tareasEmpleado!==newProps.tareasEmpleado){
      this.setState({tareasEmpleado: newProps.tareasEmpleado},()=>{
        this.getTareas()
      })
    }

    if(this.state.sortBy!==newProps.sortBy || this.props.des!==newProps.des){
      this.setState({sortBy:newProps.sortBy, des:newProps.des, items: ITEMS},()=>this.getTareas())
    }

  }
  getTareaDB = () => {

  }
  getTareas = () => {

    var filtros = this.state.filtros;
    var self = this
    
    if(!this.state.peticionCompletadas && filtros.status.items.completado.checked){

      var taskRef = dbCloud.collection('Servicios/Tareas/tareas');
      taskRef = taskRef.where(`empleados.${this.props.empleado.id_empleado}`, '==', true)
      taskRef = taskRef.where(`completado`, '==', true)
      
      taskRef.onSnapshot(snapshot => {
        var tareasCompletadas = {}
        snapshot.forEach(doc => {
          tareasCompletadas[doc.id] = doc.data()
          var a = moment();
          var b = moment(doc.data().fecha_limite)
          tareasCompletadas[doc.id].diferencia_dias = a.diff(b, 'days')  
        });
        merge(self, this.state.tareasEmpleado, tareasCompletadas, filtros, true)
      })

    }else{
      merge(self, this.state.tareasEmpleado, this.state.tareasCompletadas, filtros, this.state.peticionCompletadas)
    }
    
    function merge(self, tareasEmpleado, tareasCompletadas, filtros, peticionCompletadas){
      var tareas = {...tareasEmpleado, ...tareasCompletadas }
      var tareasOrdenadas = Object.entries(tareas)
      tareasOrdenadas = tareasOrdenadas.filter(([i,tarea])=>{
        var add = false
        if(filtros.status.items[tarea.estado].checked){
          add = true
        }
        return add
      })

      tareasOrdenadas.sort((a, b) =>{ a=a[1]; b=b[1]
        if(self.state.sortBy==='cliente'){
          if ( functions.cleanProtocolo(self.props.clientes[a.id_cliente].web.toLowerCase()) > functions.cleanProtocolo(self.props.clientes[b.id_cliente].web.toLowerCase()) ) { return 1; }
          if ( functions.cleanProtocolo(self.props.clientes[a.id_cliente].web.toLowerCase()) < functions.cleanProtocolo(self.props.clientes[b.id_cliente].web.toLowerCase()) ) { return -1; }
        }else if(self.state.sortBy==='fecha_limite' || self.state.sortBy==='prioridad'){
          if (a[self.state.sortBy] > b[self.state.sortBy]) { return 1; }
          if (a[self.state.sortBy] < b[self.state.sortBy]) { return -1; }
        }
        else{
          if (a[self.state.sortBy].toLowerCase() > b[self.state.sortBy].toLowerCase()) { return 1; }
          if (a[self.state.sortBy].toLowerCase() < b[self.state.sortBy].toLowerCase()) { return -1; }
        }
        return 0
      })
      if(self.state.des){  tareasOrdenadas.reverse(); }
      
      self.setState({tareasOrdenadas, tareasEmpleado, tareasCompletadas, peticionCompletadas, tareas})
    }

  
    
    

  }

  changeSort = (id) =>{

    if(id==='cliente' && Object.entries(this.props.clientes).length===0){
      return false
    }

    var des = false;
    if(this.state.sortBy===id){ des = !this.state.des;}
    //this.setState({sortBy:id,des}, ()=>this.getTareas())
    this.props.setOrderTareasEmpleado({item:'sortBy',value:id})
    this.props.setOrderTareasEmpleado({item:'des',value:des})
  }

  render(){
    console.log(this.state.tareas);
    
    return(
      <div id='container-clientes-task' className='container-table min-panel-medios-free pdd_0 overflow_v_hidden' ref={scroller => { this.scroller = scroller }} onScroll={this.handleScroll}>
        <div id='container-clientes-task-list'>

          <div>

            <table id='table-clientes-task'>
              <thead>
                <tr>

                  <th onClick={() => this.changeSort('estado')} className='tk-clientes-status' >
                    <span>Estado</span> {this.state.sortBy === 'estado' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.changeSort('title')} className='tk-clientes-title' >
                    <span>Titulo</span>
                    {this.state.sortBy === 'title' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.changeSort('cliente')} className='tk-clientes-cliente'>
                    <span>Cliente</span> {this.state.sortBy === 'cliente' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.changeSort('fecha_limite')} className='tk-clientes-due'>
                    <span>Fecha fin</span> {this.state.sortBy === 'fecha_limite' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th onClick={() => this.changeSort('prioridad')} className='tk-clientes-prioridad'>
                    <span>Prioridad</span> {this.state.sortBy === 'prioridad' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                  </th>

                  <th className='tk-clientes-more'></th>

                </tr>
              </thead>
              <tbody>

                {
                  this.state.tareasOrdenadas.reduce((result, item, i) => {
                    const k = item[0], tarea = item[1];
                    if (i < this.state.items) {
                      result.push(
                        <ItemTarea key={k} tarea={tarea} tarea_seleccionada={this.state.tarea_seleccionada} panel='empleado' clienteDominio={this.props.clientes[tarea.id_cliente]?this.props.clientes[tarea.id_cliente].web:''}/>
                      );
                    }
                    return result;
                  }, [])
                }
              </tbody>
            </table>
          </div>

        </div>

        {this.props.editTask && this.state.tareasEmpleado && this.state.tareas[this.state.tarea_seleccionada]  ?
          <EditTask mode='edit' tarea={this.state.tareas[this.state.tarea_seleccionada]} />: null
        }


      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    empleado: state.empleado,
    tareasEmpleado: state.panelEmpleado.tareasEmpleado,
    tarea_seleccionada: state.clients.task.tarea_seleccionada,
    editTask: state.clients.task.editTask,
    filtros: state.panelEmpleado.paneles.tareas.filtros,
    clientes:state.clientes,

    search:state.panelEmpleado.paneles.tareas.search,
    searchBy:state.panelEmpleado.paneles.tareas.searchBy,
    sortBy:state.panelEmpleado.paneles.tareas.sortBy,
    des:state.panelEmpleado.paneles.tareas.des,
  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setOrderTareasEmpleado }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Lista);