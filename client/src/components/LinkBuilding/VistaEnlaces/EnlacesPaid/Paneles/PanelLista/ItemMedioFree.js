import React, { Component } from 'react';
import functions from '../../../../../Global/functions'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding } from '../../../../../../redux/actions';

class ItemMedioFree extends Component {

  constructor(props){
      super(props);
      this.state={
      };
  }


  seleccionarMedio = () =>{
    this.props.selectMedioMediosGratuitos(this.props.medio)
    this.props.setPanelMediosFreeLinkbuilding('info')
  }


  render() {
    var requiere = '';
    if(this.props.medio.requiere_aprobacion)requiere+=', Aprobación';
    if(this.props.medio.requiere_registro)requiere+=', Registro';
    if(this.props.medio.requiere_fecha)requiere+=', Fecha';
    requiere= requiere.replace(', ','')


    return(
      <tr>

        {/*this.props.clientes_edit && this.props.clientes_edit.activo?

          <td className={`lb-medios-free-checkbox`} >
            <CheckBox _class={`checkbox-in-table ${!permiso_edit?'no-selecionable':''}`} checked={!this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente]?false:this.props.clientes_edit.seleccionados[this.props.cliente.id_cliente].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        */}

        <td className='lb-medios-free-status'>
          <div className={`status-point ${!this.props.medio.eliminado?'good-status':'wrong-status'}      `} ></div>
        </td>

        <td className='lb-medios-free-web block-with-text'>
            <a href={this.props.medio.web} target='_blank'> {functions.cleanProtocolo(this.props.medio.web)} </a>
        </td>

        <td  className='lb-medios-free-dr'>
          <span>{this.props.medio.dr}</span>
        </td>
        <td  className='lb-medios-free-ur'>
          <span>{this.props.medio.ur}</span>
        </td>
        <td  className='lb-medios-free-clientes'>
          <span>0</span>
        </td>
        <td  className='lb-medios-free-reutilizable'>
          <span>No</span>
        </td>
        <td  className='lb-medios-free-requiere'>
          <span>{requiere}</span>
        </td>
        <td  className='lb-medios-free-tematicas'>
          <span> </span>
        </td>
        <td  className='lb-medios-free-descripcion block-with-text'>
          <span>{this.props.medio.descripcion}</span>
        </td>


        <td onClick={()=>{this.seleccionarMedio()}} className='lb-medios-free-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ medio_seleccionado: state.clientes}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ selectMedioMediosGratuitos, setPanelMediosFreeLinkbuilding }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemMedioFree);
