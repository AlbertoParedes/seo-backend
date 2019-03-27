import React,{Component} from 'react'
import SimpleInput from '../../../../../Global/SimpleInput'
import data from '../../../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../../../Global/SimpleInputDesplegable'
import Switch from '../../../../../Global/Switch'
import SimpleTextArea from '../../../../../Global/SimpleTextArea'


class PanelInfo extends Component {

  constructor(props){
    super(props)
    this.state={

    }
  }

  render(){
    return(
      <div className='container-informacion'>

        <InformacionCliente />

        <InformacionAdicional />


      </div>
    )
  }

}

export default PanelInfo


class InformacionCliente extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>1. Información del medio</p>

        {/*ID Y ESTADO*/}
        <div className='col-2-input'>
          <SimpleInput type='block' _class_input='dni-input' title='Código'  text={'fasdffadshfasf'}/>
          <SimpleInputDesplegable lista={data.estados} title='Estado'  text={'Activo'} changeValor={(status)=>this.setState({status})}/>
        </div>

        {/*URL*/}
        <div className='col-2-input'>
          <SimpleInput  title='Web del medio'  text={'http://prueba.com'} changeValue={web=>{this.setState({web})}}/>
        </div>

        {/*ID Y ESTADO*/}
        <div className='col-2-input'>
          <SimpleInput title='DR'  text={'22'} changeValor={(status)=>this.setState({status})}/>
          <SimpleInput title='UR'  text={'98'} changeValor={(status)=>this.setState({status})}/>
        </div>





      </div>
    )
  }
}


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
          <SimpleInput title='Reutilizable'  text={'Si'} changeValor={(status)=>this.setState({status})}/>
          <SimpleInput title='Requiere'  text={'Registo'} changeValor={(status)=>this.setState({status})}/>
        </div>

        <div className='col-2-input'>
          {/*Clientes*/}
          <SimpleInput title='Clientes' text={'4'} changeValor={(idioma)=>this.setState({idioma})}/>
          <SimpleInput title='Temáticas' text={'7'} changeValor={(idioma)=>this.setState({idioma})}/>


        </div>

        {/*COMENTARIOS*/}
        <SimpleTextArea _class='pdd-top-10' title='Descripción'  text={''} changeValue={comentario=>{this.setState({comentario})}}/>


      </div>
    )
  }
}
