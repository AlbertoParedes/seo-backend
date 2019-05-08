import React, {Component} from 'react'
import HeaderFree from './MediosFree/Header/Header'
import HeaderPaid from './MediosPaid/Header/Header'
import PanelListaFree from './MediosFree/Paneles/PanelLista/PanelLista'
import PanelListaPaid from './MediosPaid/Paneles/PanelLista/PanelLista'
import PanelInfoFree from './MediosFree/Paneles/PanelInfo/PanelInfo'

import PanelInfoPaid from './MediosPaid/Paneles/PanelInfo/PanelInfo'
import PanelEnlacesPaid from './MediosPaid/Paneles/PanelEnlaces/PanelEnlaces'
import { connect } from 'react-redux';

class Medios extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }

  mediosFree = () => {
    return(
      <div className={`${!this.props.visibility?'display_none':'panel-clientes'}`} >

        <HeaderFree />

        <div className={`sub-container-panels ${this.props.panel_free==='lista'?'reset-padding':''}`}>

          {this.props.panel_free==='lista'?<PanelListaFree visibility={this.props.panel_free==='lista'?true:false} />:null}
          {this.props.panel_free==='info'?<div className="container-table"><PanelInfoFree /></div>:null}
          {this.props.panel_free==='clientes'?<div className="container-table"><PanelInfoFree /></div>:null}

        </div>


      </div>
    )
  }

  mediosPaid = () => {
    return(
      <div className={`${!this.props.visibility?'display_none':'panel-clientes'}`} >

        <HeaderPaid />

        <div className='sub-container-panels'>

          {this.props.panel_paid==='lista'?<PanelListaPaid visibility={this.props.panel_paid==='lista'?true:false}/>:null}
          {this.props.panel_paid==='info'?<div className="container-table"><PanelInfoPaid /></div>:null}
          {this.props.panel_paid==='enlaces'?<div className="container-table"><PanelEnlacesPaid /></div>:null}


        </div>



      </div>
    )
  }

  render(){
    console.log(this.props.filtros_free);
    return(

      this.props.filtros_free.type.items.free.checked ?
       this.mediosFree()
       :
       this.mediosPaid()

    )
  }
}

function mapStateToProps(state){return{ panel_free: state.linkbuilding.medios.tipos.free.panel, panel_paid: state.linkbuilding.medios.tipos.paid.panel, filtros_free: state.linkbuilding.medios.tipos.free.paneles.lista.filtros }}
export default connect(mapStateToProps)(Medios);
