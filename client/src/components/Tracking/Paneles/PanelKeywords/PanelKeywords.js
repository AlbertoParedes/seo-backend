import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setItemsTrackingKeywords, setClienteSeleccionado, setPanelTracking } from '../../../../redux/actions';
import * as functions from '../../../Global/functions'
import $ from 'jquery'
import ItemKeyword from './ItemKeyword'
const ITEMS = 50;
class PanelKeywords extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items,
      sortBy: this.props.sortBy,
      des: this.props.des,
      searchBy: this.props.searchBy,
      search: this.props.search,


      cliente_seleccionado: this.props.cliente_seleccionado,
      keywords: this.props.keywords,
      keywords_ordenadas: [],

      filtros: this.props.filtros,
      clientes: this.props.clientes,
    };
  }

  componentWillMount = () => { this.ordenarKeywords() }
  componentDidMount = () => { this.scrollToCliente(); }
  componentWillReceiveProps = newProps => {
    if (
      this.state.search !== newProps.search ||
      this.props.searchBy !== newProps.searchBy ||
      this.props.sortBy !== newProps.sortBy ||
      this.props.des !== newProps.des ||
      this.props.items !== newProps.items ||
      this.state.filtros !== newProps.filtros ||
      this.state.keywords !== newProps.keywords ||
      this.state.cliente_seleccionado !== newProps.cliente_seleccionado
    ) {
      this.setState({
        search: newProps.search,
        searchBy: newProps.searchBy,
        sortBy: newProps.sortBy,
        des: newProps.des,
        items: newProps.items,
        filtros: newProps.filtros,
        keywords: newProps.keywords,
        cliente_seleccionado: newProps.cliente_seleccionado

      }, () => this.ordenarKeywords())
    }
  }
  ordenarKeywords = () => {

    var keywords_ordenadas = Object.entries(this.state.keywords)

    if (keywords_ordenadas.length === 0) { return null }

    if (this.state.search.trim() !== '') {
      keywords_ordenadas = keywords_ordenadas.filter(item => { return item[1][this.state.searchBy] && functions.limpiarString(item[1][this.state.searchBy]).includes(functions.limpiarString(this.state.search)) })
    }

    //filtramos por los filtros seleccionados
    const filtros = this.state.filtros;
    keywords_ordenadas = keywords_ordenadas.filter((item) => {
      item = item[1];
      if (
        ((filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.activo && !item.eliminado) || (filtros.status.items.pausados.checked && !item.activo && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado))
      ) {
        return true
      }
      return false;
    })

    keywords_ordenadas.sort((a, b) => {
      a = a[1]; b = b[1]

      var aKeys = false, bKeys = false;
      if (this.state.sortBy === 'first_position') {
        aKeys = 102;
        if (a.results.new.first_position === false && a.results.new.id_date) { aKeys = 101 }
        else if (a.results.new.first_position) { aKeys = (+a.results.new.first_position) }

        bKeys = 102;
        if (b.results.new.first_position === false && b.results.new.id_date) { bKeys = 101 }
        else if (b.results.new.first_position) { bKeys = (+b.results.new.first_position) }

        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }

      else if (this.state.sortBy === 'first_url') {

        aKeys = a.results.new.first_url ? functions.cleanProtocolo(a.results.new.first_url) : '~'
        bKeys = b.results.new.first_url ? functions.cleanProtocolo(b.results.new.first_url) : '~'

        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }

      else {
        var valA = a[this.state.sortBy] ? a[this.state.sortBy].toString().toLowerCase() : '~';
        var valB = b[this.state.sortBy] ? b[this.state.sortBy].toString().toLowerCase() : '~';
        if (valA > valB) { return 1; }
        if (valA < valB) { return -1; }
      }

      return 0;
    });

    if (this.state.des) { keywords_ordenadas.reverse(); }
    this.setState({ keywords_ordenadas }, () => {
      this.changeContadorKeywords();
    })

  }



  scrollToCliente = () => {
    setTimeout(function () {
      try {
        $('#container-tracking-keywords').animate({ scrollTop: $("#container-tracking-keywords").scrollTop() - $("#container-tracking-keywords").offset().top + $("#container-tracking-keywords").find(`.active-row-table`).offset().top - 100 }, 0);
      } catch (e) { }
    }, 0);
  }
  handleScroll = () =>{
    
    if(this.scroller){
      const limite = 250;
      var scrollHeight = this.scroller.scrollHeight;
      var outerHeight = $(this.scroller).outerHeight()
      var refreshPosition = scrollHeight-outerHeight - limite;
      
      try {
        if(this.scroller.scrollTop>=refreshPosition){
          this.loadMore(ITEMS)
        }else if(this.scroller.scrollTop===0){
          //this.setState({items:ITEMS})
        }
      } catch (e) { }
    }
  }

  

  //// TODO:
  loadMore = (valor) => { this.setState({ items: this.state.items + valor }, () => this.changeContadorKeywords()) }

  changeContadorKeywords = () => {

    var keywords_eliminadas = 0,
      keywords_paradas = 0,
      keywords_disponibles = 0;

    this.state.keywords_ordenadas.forEach(item => {

      var keyword = item[1];
      if (keyword.eliminado) {
        keywords_eliminadas++;
      } else if (!keyword.activo) {
        keywords_paradas++
      } else {
        keywords_disponibles++
      }
    })

    this.props.setItemsTrackingKeywords({
      keywords: { keywords_disponibles },
      keywords_eliminadas, keywords_paradas
    })

  }

  changeSort = (id) => {
    var des = false;
    if (this.state.sortBy === id) { des = this.state.des ? false : true; }
    this.setState({ sortBy: id, des }, () => this.ordenarKeywords())
  }

  render() {

    return (
      <div id='container-tracking-keywords' className='container-table min-panel-enlaces-free' ref={scroller => { this.scroller = scroller }} onScroll={this.handleScroll}>
        <div >

          {Object.keys(this.state.keywords).length > 0 ?
            <div>
              <table id='table-clientes-tracking-keywords'>
                <thead>
                  <tr>

                    {this.props.tracking_keywords_edit.activo ?

                      <th className='key-checkbox' >
                        <span></span>
                      </th>

                      : null
                    }

                    <th onClick={() => this.changeSort('status')} className='key-status' >
                      <span>Status</span>
                      {this.state.sortBy === 'status' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                    </th>

                    <th onClick={() => this.changeSort('keyword')} className='key-keyword' >
                      <span>Keyword</span>
                      {this.state.sortBy === 'keyword' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                    </th>

                    <th onClick={() => this.changeSort('first_position')} className='key-posicion'>
                      <span>Posición</span>
                      {this.state.sortBy === 'first_position' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                    </th>

                    <th onClick={() => this.changeSort('first_url')} className='key-url'>
                      <span>Url</span>
                      {this.state.sortBy === 'first_url' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                    </th>

                    <th onClick={() => this.changeSort('id_date')} className='key-fecha'>
                      <span>Fecha</span>
                      {this.state.sortBy === 'id_date' ? <i className={`material-icons sort-arrow ${this.state.des ? 'des-arrow' : ''}`}>arrow_downward</i> : null}
                    </th>


                    <th className='key-img'>
                      <span>Imagen</span>
                    </th>

                    <th className='key-more'></th>

                  </tr>
                </thead>
                <tbody>

                  {
                    this.state.keywords_ordenadas.reduce((result, item, i) => {
                      const k = item[0], keyword = item[1];
                      if (i < this.state.items) {
                        result.push(
                          <ItemKeyword key={k} keyword={keyword} />
                        );
                      }
                      return result;
                    }, [])

                  }
                </tbody>
              </table>
            </div>
            :
            <div className="div_info_panel_linkbuilding">No existen keywords para este cliente</div>
          }

        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {

    cliente_seleccionado: state.cliente_seleccionado,
    keywords: state.cliente_seleccionado.servicios.tracking.keywords ? state.cliente_seleccionado.servicios.tracking.keywords : {},

    tracking_keywords_edit: state.tracking.tracking_keywords_edit,
    filtros: state.tracking.paneles.keywords.filtros,
    search: state.tracking.paneles.keywords.search,
    searchBy: state.tracking.paneles.keywords.searchBy,
    sortBy: state.tracking.paneles.keywords.sortBy,
    des: state.tracking.paneles.keywords.des,
    items: state.tracking.paneles.keywords.items_loaded,
    empleado: state.empleado

  }
}
function matchDispatchToProps(dispatch) { return bindActionCreators({ setItemsTrackingKeywords, setClienteSeleccionado, setPanelTracking }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelKeywords);
