import React, {Component} from 'react'
import HeaderClientes from './HeaderClientes/HeaderClientes'
import PanelLista from './Paneles/PanelLista/PanelLista'
import { connect } from 'react-redux';
import PanelInfo from './Paneles/PanelInfo/PanelInfo'
import PanelLinkbuildingFree from './Paneles/PanelLinkbuildingFree/PanelLinkbuildingFree'
import PanelLinkbuildingPaid from './Paneles/PanelLinkbuildingPaid/PanelLinkbuildingPaid'
import PanelTracking from './Paneles/PanelTracking/PanelTracking'

class Clientes extends Component {

  constructor(props){
    super(props);
    this.state={

      search:'', searchBy:'web', //buscaremos a los clientes por su web, su servicio, el nombre del clientes


    }
  }

  render() {
    return(
      <div className={`${!this.props.visibility?'display_none':'panel-clientes'}`} >
        <HeaderClientes

          search={this.state.search}
          changeSearch={search=>{this.setState({search})}}

          searchBy={this.state.searchBy}
          changeSearchBy={searchBy=>{this.setState({searchBy})}}

        />

        <div  className='sub-container-panels'>

          {this.props.panel_clientes==='lista'?
            <PanelLista
              visibility={this.props.panel_clientes==='lista'?true:false}
              search={this.state.search}
              searchBy={this.state.searchBy}
            />
          :null
          }


          <div id='container-clientes' className='container-table' ref={scroller => {this.scroller = scroller}} onScroll={this.handleScroll}>

            {this.props.panel_clientes==='info'?<PanelInfo />:null}
            {this.props.panel_clientes==='linkbuilding_gratuito'?<PanelLinkbuildingFree />:null}
            {this.props.panel_clientes==='linkbuilding_pagado'?<PanelLinkbuildingPaid />:null}
            {this.props.panel_clientes==='tracking'?<PanelTracking />:null}

          </div>

        </div>


      </div>
    )
  }

}

function mapStateToProps(state){return{ panel_clientes: state.panel_clientes, cliente_seleccionado:state.cliente_seleccionado }}
export default connect(mapStateToProps)(Clientes);
