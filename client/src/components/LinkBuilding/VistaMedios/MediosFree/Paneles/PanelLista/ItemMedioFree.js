import React, { Component } from 'react';
import {cleanProtocolo} from '../../../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding } from '../../../../../../redux/actions';
import SideBar from './SideBar'
class ItemMedioFree extends Component {

  constructor(props){
      super(props);
      this.state={
        clientes:this.props.clientes,
        clientes_usados:[],
        clientes_disponibles:[],
        showClientes:false
      };
  }

  componentWillReceiveProps = newProps => {
    if(this.state.clientes!==newProps.clientes ){
      this.setClientes(newProps.clientes, this.state.clientes_usados, this.state.clientes_disponibles)
    }
  }

  shouldComponentUpdate = (newProps, nextState) => {
    if(this.state!==nextState){
      return true
    }
    return false
  }

  componentWillMount = () => {
    this.setClientes(this.state.clientes, this.state.clientes_usados, this.state.clientes_disponibles)
  }

  setClientes = (clientes, clientes_usados_old, clientes_disponibles_old) => {
    var clientes_usados = [], clientes_disponibles=[];
    Object.entries(clientes).forEach(([k,c])=>{
      var m = false
      try {
        m = c.servicios.linkbuilding.free.home.medios_usados_follow[this.props.medio.id_medio]?true:false
      } catch (error) {}
      if(m){
        clientes_usados.push({id_cliente:c.id_cliente, web:c.web,medio:c.servicios.linkbuilding.free.home.medios_usados_follow[this.props.medio.id_medio]})
      }else if(c.activo && !c.eliminado && c.servicios.linkbuilding.free.activo){
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


  seleccionarMedio = () =>{
    this.props.selectMedioMediosGratuitos(this.props.medio)
    this.props.setPanelMediosFreeLinkbuilding('info')
  }

  showClientes = () => {
    this.setState({showClientes:true})
  }
  callBack = () => {
    this.setState({showClientes:false})
  }



  render() {
    var requiere = '';
    if(this.props.medio.requiere_aprobacion)requiere+=', Aprobación';
    if(this.props.medio.requiere_registro)requiere+=', Registro';
    if(this.props.medio.requiere_fecha)requiere+=', Fecha';
    requiere= requiere.replace(', ','')
    console.log('render');
    

    return(
      <tr data-id={this.props.medio.id_medio} className={`${this.props.medio_seleccionado && this.props.medio_seleccionado.id_medio===this.props.medio.id_medio?'active-row-table':''}`}>

        {/*this.props.clientes_edit && this.props.clientes_edit.activo?

          <td className={`lb-medios-free-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        */}

        <td className='lb-medios-free-status'>
          <div className={`status-point ${this.props.medio.activo?'good-status':'warning-status'} ${!this.props.medio.eliminado?'':'wrong-status'}      `} ></div>
        </td>

        <td className='lb-medios-free-web block-with-text'>
            <a href={this.props.medio.web} target='_blank' rel="noopener noreferrer" > {cleanProtocolo(this.props.medio.web)} </a>
        </td>

        <td  className='lb-medios-free-dr'>
          <span>{this.props.medio.dr}</span>
        </td>
        <td  className='lb-medios-free-ur'>
          <span>{this.props.medio.ur}</span>
        </td>


        {/*
        <td  className='lb-medios-free-tematicas'>
          <span> </span>
        </td>
        */}
        <td  className='lb-medios-free-descripcion block-with-text'>
          <span>{this.props.medio.descripcion}</span>
        </td>

        <td  className='lb-medios-free-reutilizable'>
          <span>No</span>
        </td>


        <td  className='lb-medios-free-requiere block-with-text'>
          <span>{requiere}</span>
        </td>

        <td  className='lb-medios-free-clientes' onClick={()=>this.showClientes()}>
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



        <td onClick={()=>{this.seleccionarMedio()}} className='lb-medios-free-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ medio_seleccionado: state.linkbuilding.medios.tipos.free.medio_seleccionado, clientes: state.clientes,}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemMedioFree);
