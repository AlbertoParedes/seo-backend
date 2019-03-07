import React, { Component } from 'react';
import functions from '../../../Global/functions'
import data from '../../../Global/Data/Data'
import CargandoData from '../../../Global/CargandoData'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setItemsTrackingKeywords, setClienteSeleccionado,setPanelTracking } from '../../../../redux/actions';
import $ from 'jquery'
import ItemKeyword from './ItemKeyword'

import firebase from '../../../../firebase/Firebase';
const db = firebase.database().ref();
const ITEMS = 50;

class PanelKeywords extends Component {

  constructor(props){
      super(props);
      this.state={

        items:ITEMS, sortBy:'keyword', des:false,

        searchByKeywords:this.props.searchByKeywords,
        searchKeywords:this.props.searchKeywords,

        cliente:this.props.cliente,
        keywords:this.props.keywords,
        keywords_ordenadas:[],
        filtros:this.props.filtros,
      };
  }

  componentWillMount = () => { this.ordenarKeywords()}

  componentWillReceiveProps = newProps => {
    if(this.state.cliente!==newProps.cliente){ this.setState({cliente:newProps.cliente}, ()=> this.ordenarKeywords() ) }
    if(this.state.keywords!==newProps.keywords){ this.setState({keywords:newProps.keywords}, ()=> this.ordenarKeywords() ) }
    if(this.state.filtros!==newProps.filtros){ this.setState({filtros:newProps.filtros}, () => { this.ordenarKeywords() }) }

    if(this.state.searchKeywords!==newProps.searchKeywords || this.state.searchByKeywords!==newProps.searchByKeywords){
      this.setState({searchKeywords:newProps.searchKeywords, searchByKeywords:newProps.searchByKeywords, items: ITEMS},()=>this.ordenarKeywords())
    }
  }

  handleScroll = () =>{
    if(this.scroller && this.props.visibility){
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
  loadMore = (valor) =>{ this.setState({items:this.state.items+valor}, ()=>this.changeContadorKeywords()) }



  ordenarKeywords = () => {

    var keywords_ordenadas = Object.entries(this.state.keywords)

    if(this.state.searchKeywords.trim()!==''){
      keywords_ordenadas = keywords_ordenadas.filter(item=>{return item[1][this.state.searchByKeywords] && functions.limpiarString(item[1][this.state.searchByKeywords]).includes(functions.limpiarString(this.state.searchKeywords)) })
    }

    //filtramos por los filtros seleccionados
    const filtros = this.state.filtros;
    keywords_ordenadas = keywords_ordenadas.filter( (item)=>{
      item=item[1];
      if(
          ( (filtros.status.todos && filtros.status.todos.checked) || (filtros.status.items.activos.checked && item.activo && !item.eliminado) || (filtros.status.items.pausados.checked && !item.activo && !item.eliminado) || (filtros.status.items.eliminados.checked && item.eliminado)       )
        ){
        return true
      }
      return false;
    })

    keywords_ordenadas.sort((a, b) =>{ a=a[1]; b=b[1]

      if(this.state.sortBy==='first_position'){
        var aKeys = 102;
        if(a.results.new.first_position===false && a.results.new.id_date){ aKeys=101}
        else if(a.results.new.first_position){ aKeys = (+a.results.new.first_position) }

        var bKeys = 102;
        if(b.results.new.first_position===false && b.results.new.id_date){ bKeys=101}
        else if(b.results.new.first_position){ bKeys = (+b.results.new.first_position) }

        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }

      else if(this.state.sortBy==='first_url'){

        var aKeys = a.results.new.first_url ? functions.cleanProtocolo(a.results.new.first_url) : '~'
        var bKeys = b.results.new.first_url ? functions.cleanProtocolo(b.results.new.first_url) : '~'

        if (aKeys > bKeys) { return 1; }
        if (aKeys < bKeys) { return -1; }
      }

      else{

        var valA = a[this.state.sortBy]?a[this.state.sortBy].toString().toLowerCase():'~';
        var valB = b[this.state.sortBy]?b[this.state.sortBy].toString().toLowerCase():'~';
        if (valA > valB) { return 1; }
        if (valA < valB) { return -1; }
      }

      return 0;
    });

    if(this.state.des){  keywords_ordenadas.reverse(); }
    this.setState({keywords_ordenadas},()=>{
      this.changeContadorKeywords();
    })

  }

  changeContadorKeywords = () => {
    var showing = this.state.items;
    if(showing>this.state.keywords_ordenadas.length)showing=this.state.keywords_ordenadas.length
    this.props.setItemsTrackingKeywords({showing,size:this.state.keywords_ordenadas.length})
  }

  changeSort = (id) =>{
    var des = false;
    if(this.state.sortBy===id){ des = this.state.des?false:true;}
    this.setState({sortBy:id,des}, ()=>this.ordenarKeywords())
  }



  render() {
    return (

      <div id='container-clientes-tracking-keywords' className={`container-table ${!this.props.visibility?'display_none':''}`} ref={scroller => {this.scroller = scroller}} onScroll={this.handleScroll}>

        {Object.keys(this.state.keywords).length > 0 ?
          <div>

            <table id='table-clientes-tracking-keywords'>
              <thead>
                <tr>

                  {this.props.tracking_keywords_edit.activo?

                    <th className='key-checkbox' >
                      <span></span>
                    </th>

                    :null
                  }

                  <th onClick={()=>this.changeSort('keyword')} className='key-keyword' >
                    <span>Keyword</span>
                    {this.state.sortBy==='keyword'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th onClick={()=>this.changeSort('first_position')} className='key-posicion'>
                    <span>Posición</span>
                    {this.state.sortBy==='first_position'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th  onClick={()=>this.changeSort('first_url')} className='key-url'>
                    <span>Url</span>
                    {this.state.sortBy==='first_url'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th  onClick={()=>this.changeSort('id_date')} className='key-fecha'>
                    <span>Fecha</span>
                    {this.state.sortBy==='id_date'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th className='key-img'>
                    <span>Imagen</span>
                  </th>

                  <th  onClick={()=>this.changeSort('activo')} className='key-activo'>
                    <span>Activo</span>
                    {this.state.sortBy==='activo'? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                  </th>

                  <th className='key-more'></th>

                </tr>
              </thead>
              <tbody>

              {
                 this.state.keywords_ordenadas.reduce((result, item, i)=>{
                  const k = item[0], keyword = item[1];
                  if (i < this.state.items ) {
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
          <div className={`${!this.props.visibility?'display_none':''}`} >

            <div className='no-data'>No existen keywords para este cliente</div>

          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state){return{cliente:state.cliente_seleccionado ,filtros: state.filtros_tracking_keywords, tracking_keywords_edit: state.tracking_keywords_edit }}
function matchDispatchToProps(dispatch){ return bindActionCreators({ setItemsTrackingKeywords, setClienteSeleccionado, setPanelTracking }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelKeywords);
