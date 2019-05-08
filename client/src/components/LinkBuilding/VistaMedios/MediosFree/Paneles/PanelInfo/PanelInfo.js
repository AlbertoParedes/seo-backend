import React,{Component} from 'react'
import SimpleInput from '../../../../../Global/SimpleInput'
import data from '../../../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../../../Global/SimpleInputDesplegable'
import Switch from '../../../../../Global/Switch'
import SimpleTextArea from '../../../../../Global/SimpleTextArea'
import InformacionMedio from './InformacionMedio'
import { connect } from 'react-redux';

class PanelInfo extends Component {

  constructor(props){
    super(props)
    this.state={

    }
  }

  render(){

    var status = this.props.medio_seleccionado.activo?'Activado':'Desactivado'
    status =  this.props.medio_seleccionado.eliminado?'Eliminado':status

    return(
      <div className='container-informacion'>

        <InformacionMedio

          id_medio={this.props.medio_seleccionado.id_medio}
          web={this.props.medio_seleccionado.web}
          dr={this.props.medio_seleccionado.dr || this.props.medio_seleccionado.dr===0 ?this.props.medio_seleccionado.dr.toString():''}
          ur={this.props.medio_seleccionado.ur || this.props.medio_seleccionado.ur===0 ?this.props.medio_seleccionado.ur.toString():''}
          status={status}
          categoria={this.props.categoria_seleccionada.id}

        />

        <InformacionAdicional />


      </div>
    )
  }
}


function mapStateToProps(state){return{ categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada, medio_seleccionado: state.linkbuilding.medios.tipos.free.medio_seleccionado, }}
export default connect(mapStateToProps)(PanelInfo);

class InformacionAdicional extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>2. Información adicional</p>

        {/*ID Y ESTADO*/}
        <div className='col-2-input'>
          <SimpleInput type='block' title='Reutilizable'  text={'Si'} changeValor={(status)=>this.setState({status})}/>
          <SimpleInput type='block' title='Requiere'  text={'Registo'} changeValor={(status)=>this.setState({status})}/>
        </div>

        <div className='col-2-input'>
          {/*Clientes*/}
          <SimpleInput type='block' title='Clientes' text={'4'} changeValor={(idioma)=>this.setState({idioma})}/>
          <SimpleInput type='block' title='Temáticas' text={'7'} changeValor={(idioma)=>this.setState({idioma})}/>


        </div>

        {/*COMENTARIOS*/}
        <SimpleTextArea type='block' _class='pdd-top-10' title='Descripción'  text={''} changeValue={comentario=>{this.setState({comentario})}}/>


      </div>
    )
  }
}
