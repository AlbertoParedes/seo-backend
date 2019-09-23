import React, { Component } from 'react'
import HeaderClientes from './HeaderClientes/HeaderClientes'
import PanelLista from './Paneles/PanelLista/PanelLista'
import { connect } from 'react-redux';
import PanelInfo from './Paneles/PanelInfo/PanelInfo'
import PanelLinkbuildingFree from './Paneles/PanelLinkbuildingFree/PanelLinkbuildingFree'
import PanelLinkbuildingPaid from './Paneles/PanelLinkbuildingPaid/PanelLinkbuildingPaid'
import PanelTracking from './Paneles/PanelTracking/PanelTracking'
import PanelTareas from './Paneles/PanelTareas/Paneles/PanelLista'

import axios from 'axios';

const BASE_URL = 'https://seo.yoseomk.vps-100.netricahosting.com/files/';
class Clientes extends Component {

  constructor(props) {
    super(props);
    this.state = {

      search: '', searchBy: 'web', //buscaremos a los clientes por su web, su servicio, el nombre del clientes


      //images: [],
      //imageUrls: [],
    }
  }

/*
  selectImages = (event) => {
    let images = []
    for (var i = 0; i < event.target.files.length; i++) {
      images[i] = event.target.files.item(i);
    }
    images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
    let message = `${images.length} valid image(s) selected`
    console.log(images);
    
    this.setState({ images, message })
  }
  uploadImages = () => {
    const uploaders = this.state.images.map( image => {
      var data = new FormData();
      data.append('path', '/2019/cliente1');
      data.append("image", image, image.name);

      return axios
            .post(BASE_URL + 'upload-image-tracking', data)
            .then(response => {
              console.log(response);
            })
    });

    axios.all(uploaders)
    .then(() => {
      console.log('done');
    })
    .catch(err => alert(err.message));
  }
*/
  render() {
    return (
      <div className={`${!this.props.visibility ? 'display_none' : 'panel-clientes'}`} >

        <HeaderClientes

          search={this.state.search}
          changeSearch={search => { this.setState({ search }) }}

          searchBy={this.state.searchBy}
          changeSearchBy={searchBy => { this.setState({ searchBy }) }}

        />



        <div className='sub-container-panels'>

          {/*
          <div style={{display:'none'}} >
            <input className="form-control " type="file" onChange={this.selectImages} multiple/>
            <button className="btn btn-primary" value="Submit" onClick={this.uploadImages}>Submit</button>
          </div>
          */}

          {this.props.panel_clientes === 'lista' ?
            <PanelLista
              visibility={this.props.panel_clientes === 'lista' ? true : false}
              search={this.state.search}
              searchBy={this.state.searchBy}
            />
            : null
          }

          <div id='container-clientes' className={`container-table ${this.props.panel_clientes === 'tasks' ? 'pdd_0 overflow_v_hidden' : ''}`} ref={scroller => { this.scroller = scroller }} onScroll={this.handleScroll}>

            {this.props.panel_clientes === 'info' ? <PanelInfo /> : null}
            {this.props.panel_clientes === 'linkbuilding_gratuito' ? <PanelLinkbuildingFree /> : null}
            {this.props.panel_clientes === 'linkbuilding_pagado' ? <PanelLinkbuildingPaid /> : null}
            {this.props.panel_clientes === 'tracking' ? <PanelTracking /> : null}

            {this.props.panel_clientes === 'tasks' ? <PanelTareas /> : null}
          </div>



        </div>


      </div>
    )
  }

}

function mapStateToProps(state) { return { panel_clientes: state.panel_clientes, cliente_seleccionado: state.cliente_seleccionado } }
export default connect(mapStateToProps)(Clientes);
