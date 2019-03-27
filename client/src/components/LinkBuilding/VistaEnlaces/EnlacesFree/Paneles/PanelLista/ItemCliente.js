import React,{Component} from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setClienteSeleccionado } from '../../../../../../redux/actions';

class ItemCliente extends Component {
  constructor(props){
    super(props)
    this.state={

    }
  }

  render(){
    var mes = this.props.cliente.servicios.linkbuilding.free.home.mensualidades[this.props.fecha]?this.props.cliente.servicios.linkbuilding.free.home.mensualidades[this.props.fecha]:false
    var follows = mes?mes.follows:0
    var nofollows = mes?mes.nofollows:0
    var follows_done_all = 0

    var follows_empleados = 0, follows_done_empleados = 0
    if(mes && mes.empleados){
      var empleados_filtro = this.props.filtros.empleados.items
      Object.entries(mes.empleados).forEach(([k,c])=>{
        if(c.enlaces_follows){ follows_done_all = follows_done_all + Object.entries(c.enlaces_follows).filter(([k2,e])=>{return e===true}).length }//enlaces totales hechos sin tener encuenta a los empleados
        if(empleados_filtro[k] && empleados_filtro[k].checked){
          follows_empleados = follows_empleados + c.follows;
          try {
            follows_done_empleados = follows_done_empleados + Object.entries(c.enlaces_follows).filter(([k2,e])=>{return e===true}).length
          } catch (e) {}
        }
      })
      if(this.props.filtros.empleados.todos.checked){ follows_empleados=follows; follows_done_empleados=follows_done_all}
    }

    var enlaces_restante = follows_empleados - follows_done_empleados;
    var pausado = !this.props.cliente.servicios.linkbuilding.free.activo;
    var eliminado = this.props.cliente.eliminado

    return(
      <div className={`item-lista-categoria ${this.props.cliente_seleccionado && this.props.cliente_seleccionado.id_cliente===this.props.cliente.id_cliente?'active-row-table':''} `} onClick={()=>this.props.setClienteSeleccionado(this.props.cliente)}>


        <div className='container-clientes-div-enlaces'>

          <div className='lb-enla-status-clientes'>
            {enlaces_restante>0?<div className='lb-enla-follows-clientes-number'>{enlaces_restante}</div>:null}
            {enlaces_restante===0?
              <i className="material-icons color-favorito"> done </i>
            :null}

          </div>

          <div className='lb-enla-info-clientes block-with-text'>
            <div className='block-with-text'>{this.props.cliente.dominio}</div>
            <div className='subtitle-lb-clientes-enlaces'>
              {/*<span>nofollows: 0 de {nofollows}</span> <span  className='float-right'>follows: {follows_done} de {follows}</span> */}
              <span>follows: {follows_done_all} de {follows}</span>
            </div>
          </div>

          <div className='lb-enla-follows-clientes'>

            {/*
            {!pausado && !eliminado && this.props.cliente.tipo==='better_links'? <i className="material-icons color-favorito"> grade </i> :null}
            {!pausado && !eliminado && this.props.cliente.tipo==='new'? <i className="material-icons color-new"> fiber_new </i> :null}
            {!pausado && !eliminado && this.props.cliente.tipo==='our'? <span className='cliente-our-enlaces'>y</span> :null}

            {pausado && !eliminado? <i className="material-icons color-pausa"> pause </i> :null}
            {eliminado? <i className="material-icons color-basura"> delete </i> :null}

            {!pausado && !eliminado && this.props.cliente.tipo!=='better_links' && this.props.cliente.tipo!=='new' && this.props.cliente.tipo!=='our'?<div className={`lb-enla-status-clientes-point`}></div>:null}
            */}

            {!pausado && !eliminado && this.props.cliente.tipo==='better_links'? <div className={`lb-enla-status-clientes-point favorite-status`}></div> :null}
            {!pausado && !eliminado && this.props.cliente.tipo==='new'? <div className={`lb-enla-status-clientes-point good-status`}></div> :null}
            {!pausado && !eliminado && this.props.cliente.tipo==='our'? <div className={`lb-enla-status-clientes-point yoseo-status`}></div>  :null}

            {pausado && !eliminado? <div className={`lb-enla-status-clientes-point warning-status`}></div> :null}
            {eliminado? <div className={`lb-enla-status-clientes-point wrong-status`}></div> :null}

            {!pausado && !eliminado && this.props.cliente.tipo!=='better_links' && this.props.cliente.tipo!=='new' && this.props.cliente.tipo!=='our'?<div className={`lb-enla-status-clientes-point`}></div>:null}


          </div>

        </div>

      </div>
    )
  }
}


function mapStateToProps(state){return{
  cliente_seleccionado: state.cliente_seleccionado,
  filtros:state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros,
  fecha:state.linkbuilding.enlaces.fecha
}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setClienteSeleccionado }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemCliente);
