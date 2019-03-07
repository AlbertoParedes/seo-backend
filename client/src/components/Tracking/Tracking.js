import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import HeaderTracking from './HeaderTracking/HeaderTracking'
import PanelLista from './Paneles/PanelLista/PanelLista'
import PanelKeywords from './Paneles/PanelKeywords/PanelKeywords'
import PanelDates from './Paneles/PanelDates/PanelDates'

const ITEMS = 50;

class Tracking extends Component {

  constructor(props){
      super(props);
      this.state={

        panel:'lista',

        // filtros panel listado
        search:'', searchBy:'web',

        // filtros panel listado
        searchKeywords:'', searchByKeywords:'keyword',
      }
  }

  componentWillReceiveProps = newProps => {
    if(this.props.cliente_seleccionado!==newProps.cliente_seleccionado){
      this.setState({searchKeywords:'',searchByKeywords:'keyword'})
    }
  }

  render() {

    return (
      <div className={`${!this.props.visibility?'display_none':'panel-colegios'}`} >

        <HeaderTracking

          search={this.state.search}
          changeSearch={search=>{this.setState({search})}}

          searchBy={this.state.searchBy}
          changeSearchBy={searchBy=>{this.setState({searchBy})}}

          searchKeywords={this.state.searchKeywords}
          changeSearchKeywords={searchKeywords=>{this.setState({searchKeywords})}}

          searchByKeywords={this.state.searchByKeywords}
          changeSearchByKeywords={searchByKeywords=>{this.setState({searchByKeywords})}}

          panel={this.state.panel}
          changePanel={panel=>this.setState({panel})}

        />

        <div className='sub-container-panels'>


            <PanelLista
              visibility={this.props.panel_tracking==='lista'?true:false}
              search={this.state.search}
              searchBy={this.state.searchBy}
            />

            {this.props.cliente_seleccionado?
              <PanelKeywords
                visibility={this.props.panel_tracking==='keywords'?true:false}
                searchKeywords={this.state.searchKeywords}
                searchByKeywords={this.state.searchByKeywords}
                keywords={this.props.cliente_seleccionado.tracking.keywords?this.props.cliente_seleccionado.tracking.keywords:{}} />:null
            }

            {this.props.keyword_tracking_selected?
              <PanelDates
                visibility={this.props.panel_tracking==='keyword'?true:false}
              />:null
            }




        </div>

      </div>
    )
  }
}

function mapStateToProps(state){return{ panel_tracking: state.panel_tracking, cliente_seleccionado:state.cliente_seleccionado, keyword_tracking_selected: state.keyword_tracking_selected}}
export default connect(mapStateToProps)(Tracking);
