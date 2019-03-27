import React,{Component} from 'react'
import SimpleInput from '../../../Global/SimpleInput'
import data from '../../../Global/Data/Data'
import SimpleInputDesplegable from '../../../Global/SimpleInputDesplegable'
import EmpleadoItem from '../../../Global/EmpleadoItem'
import Switch from '../../../Global/Switch'
import SimpleTextArea from '../../../Global/SimpleTextArea'




class PanelLinkbuildingPaid extends Component {

  constructor(props){
    super(props)
    this.state={

    }
  }

  render(){
    return(
      <div className='container-informacion'>

        <InformacionLinkbuilding />

        <Estrategia />

        <Micronichos />

        <InformacionEmpleados />

        <InformacionAdicional />


      </div>
    )
  }

}

export default PanelLinkbuildingPaid


class InformacionLinkbuilding extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>1. Información del linkbuilding</p>

        {/*BOTE*/}

        <SimpleInputDesplegable _class='div_text_mitad' lista={data.estados_act_des} title='Estado'  text={'Activo'} changeValor={(status)=>this.setState({status})}/>

        {/*Estado y seo*/}
        <div className='col-2-input'>
          <SimpleInput type='block'  _class_input='dni-input' title='Bote'  text={'500 €'}/>
          <SimpleInput title='Inversión mensual'  text={'400 €'} changeValue={inversion_mensual=>{this.setState({inversion_mensual})}} />
        </div>

        {/*INVERSION MENSUAL Y BENEFICIO*/}
        <div className='col-2-input'>
          <SimpleInput title='Beneficio'  text={'40 %'} changeValue={beneficio=>{this.setState({beneficio})}} />
          <SimpleInput  title='Porcentaje de pérdida' text={'15 %'} changeValor={(perdida)=>this.setState({perdida})}/>
        </div>

      </div>
    )
  }
}

class Estrategia extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>2. Estrategia</p>

        {/*KEYWORDS Y DESTINOS*/}
        <div className='col-2-input'>
          <SimpleInput title='Keywords'  text={'4'} changeValue={keywords=>{this.setState({keywords})}} />
          <SimpleInput  title='Destinos' text={'5'} changeValor={(destinos)=>this.setState({destinos})}/>
        </div>

        <div className='display_flex container-simple-input pdd-top-40'>
          <div className="title-input align-center mg-right-10 pdd-v-0">Micronichos</div>
          <span className='options-switch'>NO</span>
          <Switch class_div='switch-table' valor={true}/>
          <span className='options-switch'>SI</span>
        </div>

      </div>
    )
  }
}

class Micronichos extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className='sub-container-informacion'>

        <p className='title-informacion-alumno'>3. Micronichos</p>

        <ItemMicronicho />

        <ItemMicronicho />

        <ItemMicronicho />

        <ItemMicronicho />

      </div>
    )
  }
}

class ItemMicronicho extends Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(

      <div className='container-micronichos'>
        {/*URL*/}
        <SimpleInput title='Web'  text={'http://prueba.com'} changeValue={url=>{this.setState({url})}} />

        {/*PRESUPUESTO y CANTIDAD*/}
        <div className='col-2-input'>
          <SimpleInput title='Presupuesto'  text={'Compartido'} changeValue={presupuesto=>{this.setState({presupuesto})}} />
          <SimpleInput  title='Cantidad' text={'300 €'} changeValor={(cantidad)=>this.setState({cantidad})}/>
        </div>

        {/*KEYWORDS Y DESTINOS*/}
        <div className='col-2-input'>
          <SimpleInput title='Keywords'  text={'4'} changeValue={keywords=>{this.setState({keywords})}} />
          <SimpleInput  title='Destinos' text={'5'} changeValor={(destinos)=>this.setState({destinos})}/>
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

        <p className='title-informacion-alumno'>3. Empleados</p>

        <div className='ei-parent'>

          <EmpleadoItem />
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

        <p className='title-informacion-alumno'>4. Información adicional</p>

        {/*COMENTARIOS*/}
        <SimpleTextArea _class='pdd-top-10' title='Comentarios'  text={''} changeValue={comentario=>{this.setState({comentario})}}/>

      </div>
    )
  }
}
