import React, { Component } from 'react'
import ListaVistas from '../../../../../Filtros/ListaVistas'
import ItemsFiltro from '../../../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../../../Filtros/ListaFiltros'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setOpenNewTask, setFiltrosClientesTask, setEditTask, setTareaSeleccionada } from '../../../../../../redux/actions';
import firebase from '../../../../../../firebase/Firebase';
import moment from 'moment'
const db = firebase.firestore();
class Filtros extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show_filtros: false,
      show_vistas: false,
      blockPanel:false
    }
  }

  changeFiltros = (filtros) => {
    this.props.setFiltrosClientesTask(filtros)
  }

  openNewTask = () => {

    var batch = db.batch();
    var id_tarea = db.collection(`Servicios`).doc('Tareas').collection('tareas').doc().id
    var newTask = db.collection(`Servicios`).doc('Tareas').collection('tareas').doc(id_tarea)

    batch.set(newTask,
      {
        id_tarea,
        estado: 'no_completado',//No completado, en proceso, completado
        completado:false,
        eliminado: false,
        title: '',
        descripcion: '',
        fecha_limite: moment().format("YYYY-MM-DD"),
        prioridad: 2,
        en_proceso:{
          type:"simple"
        },
        tags: [],
        empleados: {},
        id_cliente: this.props.cliente_seleccionado.id_cliente,
        fecha_creacion: (+ new Date()),
        repetir: 'nunca',
        intervalo: { repeat: 'nunca', valor: null, valorExtra: null },
        creado_por: this.props.empleado.id_empleado,
        //tarea_padre,este atributo existirá cuando se reptita la tarea

      });

    batch.commit()
    .then(() => {
      console.log('OKAY');
      this.props.setEditTask(true);
      this.props.setTareaSeleccionada(id_tarea)
      this.setState({blockPanel:false})
    })
    .catch(err=>{
      console.log(err);
      this.setState({blockPanel:false})
    })
  
  }

  render() {
    return (
      <div className='pr'>

        {this.state.blockPanel?<div className='block-panel-new-tarea'></div>:null}

        <ItemsFiltro filtros={this.props.filtros} updateFiltros={(filtros => this.changeFiltros(filtros))} />
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>



          <div className='btn-options pr' onClick={() => this.setState({ show_filtros: this.state.show_filtros ? false : true })}>

            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {this.state.show_filtros ?
              <ListaFiltros filtros={this.props.filtros} updateFiltros={(filtros => this.changeFiltros(filtros))} close={() => this.setState({ show_filtros: false })} /> : null
            }
          </div>

          {/*Items barra*/}
          <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente ? 'color-azul' : ''}`} >
            <i onClick={() => {this.setState({blockPanel:true},()=>{this.openNewTask()})} } className="material-icons hover-azul middle-item">add</i>
          </div>

        </div>
          
        
        

      </div>
    )
  }

}

function mapStateToProps(state) { return { cliente_seleccionado: state.cliente_seleccionado, addTask: state.clients.task.addTask, filtros: state.clients.task.lista.filtros, empleado: state.empleado, } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setOpenNewTask, setFiltrosClientesTask, setEditTask, setTareaSeleccionada }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
