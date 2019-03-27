import React, {Component} from 'react'
import HeaderFree from './ClientesFree/Header/Header'
import HeaderPaid from './ClientesPaid/Header/Header'
import PanelListaFree from './ClientesFree/Paneles/PanelLista/PanelLista'
import PanelListaPaid from './ClientesPaid/Paneles/PanelLista/PanelLista'
import PanelInfoFree from '../../Clientes/Paneles/PanelLinkbuildingFree/PanelLinkbuildingFree'
import PanelInfoPaid from '../../Clientes/Paneles/PanelLinkbuildingPaid/PanelLinkbuildingPaid'
import { connect } from 'react-redux';

class Clientes extends Component{
  constructor(props){
    super(props);
    this.state={
    }
  }

  clientesFree = () => {
    return(
      <div className={`${!this.props.visibility?'display_none':'panel-clientes'}`} >

        <HeaderFree />

        <div className='sub-container-panels'>

          {this.props.panel_free==='lista'?<PanelListaFree visibility={this.props.panel_free==='lista'?true:false}/>:

            <div id='container-clientes' className='container-table' >
              {this.props.panel_free==='info'?<PanelInfoFree />:null}
            </div>

          }



        </div>


      </div>
    )
  }

  clientesPaid = () => {
    return(
      <div className={`${!this.props.visibility?'display_none':'panel-clientes'}`} >

      <HeaderPaid />

      <div className='sub-container-panels'>

        {this.props.panel_paid==='lista'?

          <PanelListaPaid visibility={this.props.panel_paid==='lista'?true:false}/>:

          <div id='container-clientes' className='container-table' >
            {this.props.panel_paid==='info'?<PanelInfoPaid />:null}
          </div>

        }


      </div>



      </div>
    )
  }

  render(){
    console.log(this.props.panel_paid);
    return(

       this.props.filtros_free.type.items.free.checked ?
        this.clientesFree()
        :
        this.clientesPaid()


    )
  }
}


function mapStateToProps(state){return{ panel_free: state.linkbuilding.clientes.tipos.free.panel,panel_paid: state.linkbuilding.clientes.tipos.paid.panel, filtros_free: state.linkbuilding.clientes.tipos.free.paneles.lista.filtros }}
export default connect(mapStateToProps)(Clientes);
