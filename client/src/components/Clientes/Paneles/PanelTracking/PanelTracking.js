import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'
import EmpleadoItem from '../../../Global/EmpleadoItem'

class PanelTracking extends Component {

  constructor(props){
    super(props)
    this.state={

    }
  }

  render(){
    return(
      <div className='container-informacion'>

        <InformacionCliente />

        <InformacionEmpleados />

        <InformacionAdicional />


      </div>
    )
  }

}

export default PanelTracking


class InformacionCliente extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>1. Información del cliente</p>

        {/*Estado*/}
        <SimpleInputDesplegable _class='div_text_mitad' lista={data.estados_act_des} title='Estado'  text={'Activo'} changeValor={(status)=>this.setState({status})}/>

        {/*Dominio y Keywords*/}
        <div className='col-2-input'>
          <SimpleInput title='Dominio a buscar'  text={'arteneo.com/es'} changeValor={(dominio)=>this.setState({dominio})}/>
          <SimpleInput title='Keywords'  text={'2'} changeValor={(keywords)=>this.setState({keywords})}/>
        </div>


      </div>
    )
  }
}

class InformacionEmpleados extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>2. Empleados</p>

        <div className='ei-parent'>

          <EmpleadoItem />


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

        <p className='title-informacion-alumno'>3. Información adicional</p>

        {/*COMENTARIOS*/}
        <SimpleTextArea _class='pdd-top-10' title='Comentarios'  text={''} changeValue={comentario=>{this.setState({comentario})}}/>


      </div>
    )
  }
}
