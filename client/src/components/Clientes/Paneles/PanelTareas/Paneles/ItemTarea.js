import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setEditTask, setTareaSeleccionada } from '../../../../../redux/actions'
import moment from 'moment'
import StarRatingComponent from 'react-star-rating-component';

class ItemTarea extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tarea: this.props.tarea
    }
  }

  componentWillReceiveProps = (newProps) => {
    if (this.state.tarea !== newProps.tarea) {
      this.setState({ tarea: newProps.tarea })
    }
  }

  shouldComponentUpdate(newProps, newState) {
    var update = false
    if( this.state.tarea!==newProps.tarea ){
      update = true;
    }
    if(this.props.tarea_seleccionada!==newProps.tarea_seleccionada){
      update = true;
    }
    return update;
  }

  openTarea = () => {
    this.props.setEditTask(true);
    this.props.setTareaSeleccionada(this.state.tarea.id_tarea)
  }

  render() {
    const { tarea } = this.state

    var iconEstado = '', classEstado = '', fraseEstado=''
    if (tarea.estado === 'no_completado' || tarea.estado === 'No completado') {
      iconEstado = 'alarm';
      fraseEstado = 'No completado'
    } else if (tarea.estado === 'en_proceso' || tarea.estado === 'En proceso') {
      iconEstado = 'autorenew'
      classEstado = 'task-proceso-item'
      fraseEstado = 'En proceso'
    } else if (tarea.estado === 'completado' || tarea.estado === 'Completado') {
      iconEstado = 'done'
      classEstado = 'task-done-item'
      fraseEstado = 'Completado'
    }

    if(tarea.en_proceso && tarea.en_proceso.type==='numerico'){
      fraseEstado+= `: ${tarea.en_proceso.valor.first_value} / ${tarea.en_proceso.valor.last_value}`
    }

    var fecha = moment(tarea.fecha_limite).locale('es').format('LL')
    fecha = fecha.split(' de ');
    if(fecha[2]===moment().format('YYYY')){
      fecha = `${fecha[0]} ${fecha[1].replace('.','')}`
    }else{
      fecha = `${fecha[0]} ${fecha[1].replace('.','')}, ${fecha[2]}`
    }


    return (
      <tr data-id-tarea={tarea.id_tarea} className={`${this.props.tarea_seleccionada && this.props.tarea_seleccionada === tarea.id_tarea ? 'active-row-table' : ''}`} onClick={() => this.openTarea()}>

        <td className='tk-clientes-status'>

          <div className={`status-container-item-task ${classEstado}`}>
            {/*<i className={`material-icons ${iconEstado === 'autorenew' ? 'rotating' : ''}`}>{iconEstado}</i>*/}
            <span className='phrase-estado-task'>{fraseEstado}</span>
          </div>
          {/*
          <span className='span_edit'>
            <span className='break_sentence'>{tarea.estado}</span>
          </span>
          */}

        </td>

        <td className='tk-clientes-title'>
          <span className='span_edit'>
            <span className='break_sentence'>{tarea.title}</span>
          </span>
        </td>

        


        {
          /*
           <td className='tk-clientes-diasRestantes'>
          {tarea.diferencia_dias == 1 ? '1 día' : tarea.diferencia_dias + " días"}
        </td>
          */
        }


        <td className='tk-clientes-empleados'>

          <div className='FollowersList empleados-div-item-task' data-empleado={Object.keys(tarea.empleados).length > 4 ? 'max' : 'min'}>
            {/* Array de los empleados asignados */}
            {tarea.empleados && tarea.empleados.cliente?
              <div className="RemovableAvatar FollowersList-facepileAvatar">
                <div className="Avatar Avatar--small Avatar--color7">
                  <i className="material-icons icon-person icon-client-task">person</i>
                </div>
              </div>
            :null}
            <ListaEmpleados empleados={tarea.empleados?tarea.empleados:{}} listaEmpleados={this.props.empleados} />

            {/*
              Object.entries(tarea.empleados).map(([index, item]) => {
                if (!item) return null
                var fullName = this.props.empleados[index].nombre + " " + this.props.empleados[index].apellidos;
                return (
                  <div className="RemovableAvatar FollowersList-facepileAvatar" key={index}>
                    <div className="Avatar Avatar--small Avatar--color7" style={{ backgroundImage: `url(${this.props.empleados[index].foto})` }}>
                      {this.props.empleados[index].foto === 'x' ? 'al' : ''}
                    </div>
                    <div className='more-info-task-empleado' style={{ backgroundImage: `url(${this.props.empleados[index].foto})` }}>
                      <div>
                        <span>{fullName}</span>
                      </div>
                    </div>
                  </div>
                )
              })
            */}


          </div>

        </td>


        <td className='tk-clientes-due'>
          {fecha}
        </td>
        
        <td className='tk-clientes-prioridad'>
          <div>
            <StarRatingComponent name="app6" starColor="#1090f7" emptyStarColor="#1090f7" value={tarea.prioridad} className='prioridad-chat'
              renderStarIcon={(index, value) => { return (<span> <i className={index <= value ? 'fas fa-star' : 'far fa-star'} /> </span>); }}
              renderStarIconHalf={() => { return (<span> <span style={{ position: 'absolute' }}><i className="far fa-star" /></span> <span><i className="fas fa-star-half" /></span></span>); }}
            />
          </div>
        </td>

        <td className='tk-clientes-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>

      </tr>
    )
  }
}


function mapStateToProps(state) { return { addTask: state.clients.task.editTask, empleados: state.empleados } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setEditTask, setTareaSeleccionada }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemTarea);

class ListaEmpleados extends Component {
  constructor(props){
    super(props)
    this.state={
      empleados:this.props.empleados,
      empleadosOrdenados: []
    }
  }

  
  shouldComponentUpdate(newProps, newState) {
    var update = false
    if( this.state.empleados!==newProps.empleados ){
      update = true;
    }
    if(this.state.empleadosOrdenados!==newState.empleadosOrdenados){
      update = true;
    }

    return update;
  }
  componentWillReceiveProps = newProps => {
    if(this.state.empleados!==newProps.empleados){
      this.setState({empleados: newProps.empleados},()=>this.ordenarEmpleados())
    }
  }
  componentWillMount = () => {
    this.ordenarEmpleados()
  }

  ordenarEmpleados = () => {
    var empleadosOrdenados = Object.entries(this.state.empleados)
    empleadosOrdenados.sort((a, b) => {
      a = a[0]; b = b[0]
      if(a==='cliente' || b==='cliente')return 0
      
      var fullNameA = `${this.props.listaEmpleados[a].nombre} ${this.props.listaEmpleados[a].apellidos}`;
      var fullNameB = `${this.props.listaEmpleados[b].nombre} ${this.props.listaEmpleados[b].apellidos}`;
      if (fullNameA.toLowerCase() > fullNameB.toLowerCase()) { return 1; }
      if (fullNameA.toLowerCase() < fullNameB.toLowerCase()) { return -1; }
      
      return 0;
    });
    this.setState({empleadosOrdenados})
  }

  render(){
    return(
      this.state.empleadosOrdenados.map((i,k)=>{
        return(
          <ItemEmpleado empleado={this.props.listaEmpleados[i[0]]} key={k}/>
        )
      })
    )
  }


}

class ItemEmpleado extends Component{
  constructor(props){
    super(props);
    this.state={
      empleado:this.props.empleado,
      hover:false
    }
  }
  shouldComponentUpdate = (newProps, newState) => {
    if(this.state.hover!==newState.hover){
      return false//true
    }
    return false
  }

  mouseOut = () => {
    this.setState({hover:false})
  }
  mouseOver = () => {
    this.setState({hover:true})
  }

  render(){
    var empleado = this.state.empleado;
    if(!empleado)return false

    return(
      <div className="RemovableAvatar FollowersList-facepileAvatar" onMouseOut={() => this.mouseOut()} onMouseOver={() => this.mouseOver()}>

        <div className="Avatar Avatar--small Avatar--color7" style={{ backgroundImage: `url(${empleado.foto})` }}>
          {empleado.foto === 'x' ? empleado.nombre.substring(0,2).toLowerCase() : ''}
        </div>

        {this.state.hover ?
          <div className='more-info-task-empleado' >
            {empleado.foto.startsWith('http')?<img src={empleado.foto} />
            :null}
            
            <div>
              <span>{`${empleado.nombre} ${empleado.apellidos}`}</span>
            </div>
          </div>
        :null
        }
        

      </div>
    )
  }
}

//style={{visibility: 'visible' , backgroundImage: `url(${this.state.empleado.foto})` }}