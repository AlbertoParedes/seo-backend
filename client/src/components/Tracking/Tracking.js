import React, {Component} from 'react'
import HeaderTracking from './HeaderTracking/HeaderTracking'
import HeaderTrackingKeywords from './HeaderTrackingKeywords/HeaderTrackingKeywords'
import PanelLista from './Paneles/PanelLista/PanelLista'
import { connect } from 'react-redux';
import PanelInfo from '../Clientes/Paneles/PanelTracking/PanelTracking'
import PanelKeywords from './Paneles/PanelKeywords/PanelKeywords'
import PanelResultados from './Paneles/PanelResultados/PanelResultados'

class Clientes extends Component {

  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
    return(
      <div className={`${!this.props.visibility?'display_none':'panel-clientes'}`} >

        {this.props.panel==='lista' || this.props.panel==='info'?<HeaderTracking />:null}
        {this.props.panel==='keywords' || this.props.panel==='resultados'?<HeaderTrackingKeywords />:null}


        {
        <div  className='sub-container-panels'>

          {this.props.panel==='lista'? <PanelLista visibility={this.props.panel==='lista'?true:false} /> :null }
          {this.props.panel==='keywords'?<PanelKeywords />:null}
          {this.props.panel==='resultados'?<PanelResultados />:null}

          <div id='container-clientes' className='container-table' ref={scroller => {this.scroller = scroller}} onScroll={this.handleScroll}>

            {this.props.panel==='info'?<PanelInfo />:null}


          </div>

        </div>
        }


      </div>
    )
  }

}

function mapStateToProps(state){return{
  panel: state.tracking.panel
}}
export default connect(mapStateToProps)(Clientes);
