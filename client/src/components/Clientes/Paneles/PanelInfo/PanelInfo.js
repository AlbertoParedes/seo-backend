import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'


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

        <Servicios />

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

        <p className='title-informacion-alumno'>1. Información del cliente</p>

        {/*ID*/}
        <SimpleInput type='block' _class='div_text_mitad' _class_input='dni-input' title='Código'  text={'fasdffadshfasf'}/>

        {/*URL*/}
        <div className='col-2-input'>
          <SimpleInput  title='Web del cliente'  text={'http://prueba.com'} changeValue={web=>{this.setState({web})}}/>
        </div>

        {/*NOMBRE*/}
        <div className='col-2-input'>
          <SimpleInput  title='Nombre del cliente'  text={'Alberto Paredes'} changeValue={nombre=>{this.setState({nombre})}}/>
        </div>

        {/*Seo y Estado*/}
        <div className='col-2-input'>
          <SimpleInputDesplegable lista={data.seo} title='Seo'  text={'Pro'} changeValor={(seo)=>this.setState({seo})}/>
          <SimpleInputDesplegable lista={data.estados} title='Estado'  text={'Activo'} changeValor={(status)=>this.setState({status})}/>
        </div>


      </div>
    )
  }
}


class Servicios extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>2. Servicios</p>

        {/*TRACKING*/}
        <SimpleInputDesplegable _class='div_text_mitad' lista={data.estados_servicios} title='Tracking'  text={'Activado'} changeValor={(tracking)=>this.setState({tracking})}/>

        {/*Tracking free y de pago y Estado*/}
        <div className='col-2-input'>
          <SimpleInputDesplegable lista={data.estados_servicios} title='Linkbuilding gratuito'  text={'Activado'} changeValor={(linkbuilfing_free)=>this.setState({linkbuilfing_free})}/>
          <SimpleInputDesplegable lista={data.estados_servicios} title='Linkbuilding de pago'  text={'Activado'} changeValor={(linkbuilfing_paid)=>this.setState({linkbuilfing_paid})}/>
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

        <div className='col-2-input'>
          {/*IDIOMA*/}
          <SimpleInputDesplegable lista={data.idiomas} title='Idioma' text={'Español'} changeValor={(idioma)=>this.setState({idioma})}/>
          {/*BLOG*/}
          <div className='display_flex container-simple-input pdd-top-40'>
            <div className="title-input align-center mg-right-10 pdd-v-0">¿Tiene blog?</div>
            <span className='options-switch'>NO</span>
            <Switch class_div='switch-table' valor={true}/>
            <span className='options-switch'>SI</span>
          </div>

        </div>

        {/*COMENTARIOS*/}
        <SimpleTextArea _class='pdd-top-10' title='Comentarios'  text={''} changeValue={comentario=>{this.setState({comentario})}}/>


      </div>
    )
  }
}
