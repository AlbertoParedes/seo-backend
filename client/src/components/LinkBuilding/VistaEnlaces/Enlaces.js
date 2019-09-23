import React, {Component} from 'react'
import HeaderFree from './EnlacesFree/Header/Header'
import HeaderPaid from './EnlacesPaid/Header/Header'
import PanelListaFree from './EnlacesFree/Paneles/PanelLista/PanelLista'
import PanelListaPaid from './EnlacesPaid/Paneles/PanelLista/PanelLista'
import { connect } from 'react-redux';

class Enlaces extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }

  enlacesFree = () => {
    return(
      <div className={`${!this.props.visibility?'display_none':'panel-clientes'}`} >

        <HeaderFree />

        <div className={`sub-container-panels ${this.props.panel_free==='lista'?'reset-padding':''}`}>

          {this.props.panel_free==='lista'?<PanelListaFree visibility={this.props.panel_free==='lista'?true:false} />:null}

        </div>


      </div>
    )
  }

  enlacesPaid = () => {


    return(
      <div className={`${!this.props.visibility?'display_none':'panel-clientes'}`} >

        <HeaderPaid />

        <div className={`sub-container-panels ${this.props.panel_paid==='lista'?'reset-padding':''}`}>

          {this.props.panel_paid==='lista'?<PanelListaPaid visibility={this.props.panel_paid==='lista'?true:false} />:null}



        </div>



      </div>
    )

  }

  render(){
    return(

      this.props.filtros_free.type.items.free.checked ?
       this.enlacesFree()
       :
       this.enlacesPaid()

    )
  }
}

function mapStateToProps(state){return{ panel_free: state.linkbuilding.enlaces.tipos.free.panel, panel_paid: state.linkbuilding.enlaces.tipos.paid.panel, filtros_free: state.linkbuilding.enlaces.tipos.free.paneles.lista.filtros }}
export default connect(mapStateToProps)(Enlaces);
