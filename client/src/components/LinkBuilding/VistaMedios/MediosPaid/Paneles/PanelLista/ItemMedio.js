import React, { Component } from 'react';
import {cleanProtocolo} from '../../../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMedioSeleccionadoPaid, setPanelMediosPaidLinkbuilding } from '../../../../../../redux/actions';
import SideBar from '../../../MediosFree/Paneles/PanelLista/SideBar'

class ItemMedio extends Component {

  constructor(props){
      super(props);
      this.state={
        clientes:this.props.clientes,
        clientes_usados:[],
        clientes_disponibles:[],
        showClientes:false
      };
  }

  componentWillMount = () => {
    this.setClientes(this.state.clientes, this.state.clientes_usados, this.state.clientes_disponibles)
  }

  componentWillReceiveProps = newProps => {
    if(this.state.clientes!==newProps.clientes ){
      this.setClientes(newProps.clientes, this.state.clientes_usados, this.state.clientes_disponibles)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    /*if(this.props.tracking_clientes_edit!==nextProps.tracking_clientes_edit){return true}
    if(this.props.empleado!==nextProps.empleado){return true}
    if(nextProps.cliente_seleccionado !== this.props.cliente_seleccionado){
      //solo renderizamos el componente si se ha selccionado o si estaba seleccionado pero se ha seleccionado otro. Asi evitamos renderizar cada uno de los alumnos.
      if(nextProps.cliente.id_cliente===nextProps.cliente_seleccionado.id_cliente ){ return true;
      }else if(this.props.cliente_seleccionado && nextProps.cliente.id_cliente===this.props.cliente_seleccionado.id_cliente){ return true; }
    }
    if(nextProps.cliente !== this.props.cliente){ return true; }
    if(this.state.showEmpleados!==nextState.showEmpleados)return true
    return false;
    */
    if(this.state!==nextState){
      return true
    }
    return false
  }

  setClientes = (clientes, clientes_usados_old, clientes_disponibles_old) => {
    var clientes_usados = [], clientes_disponibles=[];
    
    
    Object.entries(clientes).forEach(([k,c])=>{
      var m = false
      try {
        m = c.servicios.linkbuilding.paid.home.medios_usados_follows[this.props.medio.id_medio]?true:false
      } catch (error) {}
      //console.log(this.props.medio.id_medio,k,m);
      
      if(m){
       // console.log(this.props.medio.id_medio);
        
        clientes_usados.push({id_cliente:c.id_cliente, web:c.web,medio:c.servicios.linkbuilding.paid.home.medios_usados_follows[this.props.medio.id_medio]})
      }else if(c.activo && !c.eliminado && c.servicios.linkbuilding.paid.activo){
        clientes_disponibles.push({id_cliente:c.id_cliente, web:c.web})
      }
    })

    // ordenamos los clientes 
    clientes_disponibles.sort((a, b) =>{ 
      var dominioA = cleanProtocolo(this.props.clientes[a.id_cliente].web);
      var dominioB = cleanProtocolo(this.props.clientes[b.id_cliente].web);
      if (dominioA.toLowerCase() > dominioB.toLowerCase()) { return 1; }
      if (dominioA.toLowerCase() < dominioB.toLowerCase()) { return -1; }
      return 0;
    })
    clientes_usados.sort((a, b) =>{ 
      var dominioA = cleanProtocolo(this.props.clientes[a.id_cliente].web);
      var dominioB = cleanProtocolo(this.props.clientes[b.id_cliente].web);
      if (dominioA.toLowerCase() > dominioB.toLowerCase()) { return 1; }
      if (dominioA.toLowerCase() < dominioB.toLowerCase()) { return -1; }
      return 0;
    })
    
    if(clientes_usados_old!==clientes_usados || clientes_disponibles_old!==clientes_disponibles){
      this.setState({clientes, clientes_usados, clientes_disponibles})
    }

  }

  seleccionarMedio = () => {
    this.props.setMedioSeleccionadoPaid(this.props.medio)
    this.props.setPanelMediosPaidLinkbuilding('info')
  }
  seleccionarEnlaces = () => {
    this.props.setMedioSeleccionadoPaid(this.props.medio)
    this.props.setPanelMediosPaidLinkbuilding('enlaces')
  }

  showClientes = () => {
    this.setState({showClientes:true})
  }
  callBack = () => {
    this.setState({showClientes:false})
  }

  render() {

    var enlaces_disponibles = {}
    if(this.props.medio.enlaces){
      enlaces_disponibles = Object.entries(this.props.medio.enlaces).filter(([k,e])=>{return !e.id_cliente})
    }

    return(
      <tr data-id={this.props.medio.id_medio} className={`${this.props.medio_seleccionado && this.props.medio_seleccionado.id_medio===this.props.medio.id_medio?'active-row-table':''}`}>

        {/*this.props.tracking_clientes_edit.activo?

          <td className={`cli-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.tracking_clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        */}

        <td className='lb-medios-paid-status'>
          <div className={`status-point ${this.props.medio.activo?'good-status':'warning-status'} ${this.props.medio.eliminado?'wrong-status':''}     `} ></div>
        </td>


        <td className='lb-medios-paid-web block-with-text'>
          <span>{cleanProtocolo(this.props.medio.web)}</span>
        </td>

        <td  className='lb-medios-paid-dr'>
          <span>{this.props.medio.dr}</span>
        </td>

        <td  className='lb-medios-paid-ur'>
          <span>{this.props.medio.ur}</span>
        </td>

        {/*
        <td  className='lb-medios-paid-tematicas'>
          <span>-</span>
        </td>
        */}

        <td  className='lb-medios-paid-descripcion block-with-text'>
          <span>{this.props.medio.descripcion}</span>
        </td>

        <td  className='lb-medios-paid-reutilizable'>
          <span>No</span>
        </td>

        <td onClick={()=>{this.seleccionarEnlaces()}} className='lb-medios-paid-enlaces'>
          <span>{Object.keys(enlaces_disponibles).length}</span>
        </td>

        <td  className='lb-medios-paid-clientes' onClick={()=>this.showClientes()}>
          <span>{this.state.clientes_disponibles.length}</span>

          {this.state.showClientes?
            <SideBar
              subtext={this.props.medio.web}
              clientes_disponibles={this.state.clientes_disponibles}
              clientes_usados={this.state.clientes_usados}
              clientes={this.props.clientes}
              
              callBack={(list)=>{this.callBack()}}
            />:null
          }

        </td>

        <td onClick={()=>{this.seleccionarMedio()}} className='lb-medios-paid-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ medio_seleccionado: state.linkbuilding.medios.tipos.paid.medio_seleccionado, clientes: state.clientes }}
function matchDispatchToProps(dispatch){ return bindActionCreators({  setMedioSeleccionadoPaid, setPanelMediosPaidLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemMedio);
