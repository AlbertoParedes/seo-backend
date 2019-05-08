import React,{Component} from 'react'
import InformacionCliente from './InformacionCliente'
import Servicios from './Servicios'
import InformacionAdicional from './InformacionAdicional'
import $ from 'jquery'
import { connect } from 'react-redux';



class PanelInfo extends Component {

  constructor(props){
    super(props)
    this.state={

    }
  }
  componentDidMount = () => { this.scrollToCliente() }
  scrollToCliente = () => { setTimeout(function(){ try { $('#container-clientes').animate({scrollTop:0}, 0); } catch (e) { } }, 0); }

  render(){

    var status = this.props.cliente_seleccionado.activo?'Activado':'Desactivado'
    status =  this.props.cliente_seleccionado.eliminado?'Eliminado':status

    console.log(this.props.cliente_seleccionado.tipo);
    return(
      <div className='container-informacion'>

        <InformacionCliente
          empleado={this.props.empleado}
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          web={this.props.cliente_seleccionado.web}
          nombre={this.props.cliente_seleccionado.nombre?this.props.cliente_seleccionado.nombre:''}
          tipo={this.props.cliente_seleccionado.tipo?this.props.cliente_seleccionado.tipo:'old'}
          status={status}

        />

        <Servicios
          empleado={this.props.empleado}
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          cliente_seleccionado={this.props.cliente_seleccionado}
          tracking={this.props.cliente_seleccionado.servicios.tracking.activo?'Activado':'Desactivado'}
          linkbuilfing_free={this.props.cliente_seleccionado.servicios.linkbuilding.free.activo?'Activado':'Desactivado'}
          linkbuilfing_paid={this.props.cliente_seleccionado.servicios.linkbuilding.paid.activo?'Activado':'Desactivado'}

        />

        <InformacionAdicional
          empleado={this.props.empleado}
          id_cliente={this.props.cliente_seleccionado.id_cliente}
          idioma={this.props.cliente_seleccionado.idioma}
          blog={this.props.cliente_seleccionado.blog?true:false}
          comentario={this.props.cliente_seleccionado.comentario?this.props.cliente_seleccionado.comentario:''}
        />


      </div>
    )
  }

}
function mapStateToProps(state){return{ cliente_seleccionado:state.cliente_seleccionado, all_empleados:state.empleados, empleado:state.empleado, empleados_disponibles:state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros.empleados.items }}
export default connect(mapStateToProps)(PanelInfo);
