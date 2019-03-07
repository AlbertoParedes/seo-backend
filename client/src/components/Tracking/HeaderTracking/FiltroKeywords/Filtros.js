import React, { Component } from 'react';
import ListaFiltros from '../../../Filtros/ListaFiltros'
import ItemsFiltro from '../../../Filtros/ItemsFiltro'
import NewKeywords from './NewKeywords'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setEditKeywordsTracking, setFiltrosTrackingKeywords } from '../../../../redux/actions';
import $ from 'jquery'
import firebase from '../../../../firebase/Firebase';
import dotProp from 'dot-prop-immutable';
const db = firebase.database().ref();

class Filtros extends Component {
  constructor(props){
    super(props);
    this.state={
      show_filtros:false,
      show_new_cliente: false,
    };
  }

  mensajeInformativo = (text) =>{var element = $(`#tracking-mensaje`); if(!$(element).attr('class').includes('show')){ $(element).text(text).addClass('show'); setTimeout( function(){ $(element).removeClass('show'); }, 3500 );}}

  descargarExcel = () => {


    var resultados = {}
    var dates = {};

    db.child(`Resultados/${this.props.cliente.id_cliente}`).once("value", snapshot =>{
      snapshot.forEach( obj => {
        resultados[obj.key]=obj.val();
      });
    }).then((data)=>{

      Object.entries(resultados).forEach(([k1,r])=>{
        if(r.dates){ Object.entries(r.dates).forEach(([k2,d])=>{ dates[d.id_date]=d.id_date; }) }
      })

      var dates_ordenadas = Object.entries(dates);
      dates_ordenadas.sort((a, b) =>{ a=a[1]; b=b[1]
        if (a > b) { return -1; }
        if (a < b) { return 1; }
        return 0;
      });

      var dates_finales = [];
      var data = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
      dates_ordenadas.forEach(([k,o])=>{
        var fecha = k.split('-');
        dates_finales.push({ date:k, fecha_string: (+fecha[2])+' '+data[ (+fecha[1])-1 ]+", "+fecha[0]})
      })

      var resultados_finales = []
      Object.entries(resultados).forEach(([id_keyword,r])=>{
        if(r.dates){

          var object = {keyword:r.keyword, dates: []}
          dates_ordenadas.forEach((d,k2)=>{
            if(r.dates[d[0]]){

              var status = 'perfect', more=false;

              if(r.dates[d[0]].results.first_position){

                if(r.dates[d[0]].results.first_position > 10 && r.dates[d[0]].results.first_position < 101) status = 'ok';

              }else{ status= 'bad' }

              var url = r.dates[d[0]].results.first_url ? r.dates[d[0]].results.first_url : '-';
              if(url!=='-' && r.dates[d[0]].results.all_positions && r.dates[d[0]].results.all_positions.length > 1){
                url='';
                r.dates[d[0]].results.all_positions.forEach((obj)=>{
                  url=url + obj.url+'    --    '+obj.posicion+'                                                           '+'\n'
                })
                more = r.dates[d[0]].results.all_positions.length > 1 ? true : false;
              }

              object.dates.push({
                date:d[0],
                posicion: r.dates[d[0]].results.first_position ? r.dates[d[0]].results.first_position : '+100',
                url: url,
                status: status,
                more:more
              })
            }else{
              object.dates.push({ date:d[0], posicion: '-', url: '-', status: '-', more:more })
            }

          })
          object.dates.push({ date:' ', posicion: ' ', url:' ', status: ' ', more:'end' })
          resultados_finales.push(object)

        }
      })

      var sortBy = 'keyword'
      resultados_finales.sort((a, b) =>{
        if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) { return 1; }
        if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) { return -1; }
        return 0;
      });
      //if(this.state.des){  keywords_ordenadas.reverse(); }

      var data = {
        dates: dates_finales,
        keywords:resultados_finales
      }
      if(resultados_finales.length>0){
        $('#formTracking > #data').val(JSON.stringify(data));
        $('#formTracking').submit();
      }else{
        this.mensajeInformativo('No hay datos para exportar')
      }


    })

  }

  changeEdit = () => {


    if(
      ( this.props.empleado.clientes && this.props.empleado.clientes.tracking && this.props.empleado.clientes.tracking[this.props.cliente.id_cliente] )
      ||
      (this.props.empleado.privilegios && this.props.empleado.privilegios.tracking && this.props.empleado.privilegios.tracking.edit.edit_keywords)
    ){
      this.props.setEditKeywordsTracking({activo: this.props.tracking_keywords_edit.activo?false:true, seleccionados:{}})
    }else{
      this.mensajeInformativo('No tiene permiso para modificar estas keywords')
    }


  }

  deleteKeywords = () => {
    var selecionados_limpios = {}
    if(this.props.tracking_keywords_edit.seleccionados){
      var multiPath = {}
      Object.entries(this.props.tracking_keywords_edit.seleccionados).forEach(([k,o])=>{
        if(o.checked && this.props.cliente.id_cliente===o.id_cliente){

          multiPath[`Clientes/${o.id_cliente}/tracking/keywords/${o.id_keyword}/eliminado`]=true

        }else if(o.checked){
          selecionados_limpios[k] = o;
        }

      })
      var n = Object.keys(multiPath).length;
      if(n>0){
        db.update(multiPath)
        .then(()=>{
          //quitamos todos los elementos de este cliente seleccionados del array seleccionados
          this.props.setEditKeywordsTracking({activo: this.props.tracking_keywords_edit.activo, seleccionados:selecionados_limpios})
          this.mensajeInformativo(`Se ${n===1?'ha':'han'} borrado ${n} ${n===1?'keyword':'keywords'} correctamente`)
        })
        .catch((err)=>{ this.mensajeInformativo(`No se han podido borrar ninguna keyword`) })
      }else{ this.mensajeInformativo('No se ha seleccionado ninguna keyword') }

    }else{ this.mensajeInformativo('No se ha seleccionado ninguna keyword') }

  }
  pauseKeywords = () => {
    var selecionados_limpios = {}
    if(this.props.tracking_keywords_edit.seleccionados){
      var multiPath = {}
      Object.entries(this.props.tracking_keywords_edit.seleccionados).forEach(([k,o])=>{
        if(o.checked && this.props.cliente.id_cliente===o.id_cliente){

          multiPath[`Clientes/${o.id_cliente}/tracking/keywords/${o.id_keyword}/activo`]=false

        }else if(o.checked){
          selecionados_limpios[k] = o;
        }

      })
      var n = Object.keys(multiPath).length;
      if(n>0){
        db.update(multiPath)
        .then(()=>{
          //quitamos todos los elementos de este cliente seleccionados del array seleccionados
          this.props.setEditKeywordsTracking({activo: this.props.tracking_keywords_edit.activo, seleccionados:selecionados_limpios})
          this.mensajeInformativo(`Se ${n===1?'ha':'han'} desactivado ${n} ${n===1?'keyword':'keywords'} correctamente`)
        })
        .catch((err)=>{ this.mensajeInformativo(`No se han podido desactivar ninguna keyword`) })
      }else{ this.mensajeInformativo('No se ha seleccionado ninguna keyword') }

    }else{ this.mensajeInformativo('No se ha seleccionado ninguna keyword') }

  }
  restoreKeywords = () => {
    var selecionados_limpios = {}
    if(this.props.tracking_keywords_edit.seleccionados){
      var multiPath = {}
      Object.entries(this.props.tracking_keywords_edit.seleccionados).forEach(([k,o])=>{
        if(o.checked && this.props.cliente.id_cliente===o.id_cliente){

          multiPath[`Clientes/${o.id_cliente}/tracking/keywords/${o.id_keyword}/eliminado`]=false
          multiPath[`Clientes/${o.id_cliente}/tracking/keywords/${o.id_keyword}/activo`]=true

        }else if(o.checked){
          selecionados_limpios[k] = o;
        }

      })
      var n = Object.keys(multiPath).length/2;
      if(n>0){
        db.update(multiPath)
        .then(()=>{
          //quitamos todos los elementos de este cliente seleccionados del array seleccionados
          this.props.setEditKeywordsTracking({activo: this.props.tracking_keywords_edit.activo, seleccionados:selecionados_limpios})
          this.mensajeInformativo(`Se ${n===1?'ha':'han'} activado ${n} ${n===1?'keyword':'keywords'} correctamente`)
        })
        .catch((err)=>{ this.mensajeInformativo(`No se han podido activar ninguna keyword`) })
      }else{ this.mensajeInformativo('No se ha seleccionado ninguna keyword') }

    }else{ this.mensajeInformativo('No se ha seleccionado ninguna keyword') }

  }

  render(){
    return(
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros_tracking_keywords} updateFiltros={(filtros=>this.props.setFiltrosTrackingKeywords(filtros))}/>
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>


          <div className='btn-options pr' onClick={()=>this.setState({show_filtros:this.state.show_filtros?false:true})}>
            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {
              this.state.show_filtros?
                <ListaFiltros filtros={this.props.filtros_tracking_keywords} updateFiltros={(filtros=>this.props.setFiltrosTrackingKeywords(filtros))} close={()=>this.setState({show_filtros:false})}/>
              :null
            }

          </div>

          {/*Items barra*/}
          <div className={`item-container-icon-top-bar pr ${this.state.show_new_cliente?'color-azul':''}`} >
            <i onClick={()=>this.setState({show_new_cliente:true})} className="material-icons hover-azul middle-item">add</i>

            {this.state.show_new_cliente?
              <NewKeywords close={()=>this.setState({show_new_cliente:false})}/> : null
            }

          </div>

          <div className='item-container-icon-top-bar pr'>
            <i onClick={()=>this.descargarExcel()} className="material-icons hover-azul middle-item">save_alt</i>
            <form className="display_none" method="post" id="formTracking" target="_blank" action='https://seo.yoseomk.vps-100.netricahosting.com/api/tracking'>
              <input type="hidden" name="data" id="data" value="null"/>
            </form>
          </div>

          <div className={`item-container-icon-top-bar pr ${this.props.tracking_keywords_edit.activo?'middle-item color-azul':''}`} >
            <i onClick={()=>this.changeEdit()} className="material-icons hover-azul">edit</i>
          </div>

          {this.props.tracking_keywords_edit.activo?
            <div className={`item-container-icon-top-bar pr middle-item`} >
              <i onClick={()=>this.deleteKeywords()} className="material-icons hover-red color_eliminado">delete_forever</i>
            </div>
            :null
          }



          {this.props.tracking_keywords_edit.activo?
            <div className={`item-container-icon-top-bar pr middle-item`} >
              <i onClick={()=>this.pauseKeywords()} className="material-icons hover-orange color_parado">pause</i>
            </div>
            :null
          }

          {this.props.tracking_keywords_edit.activo?
            <div className={`item-container-icon-top-bar pr middle-item`} >
              <i onClick={()=>this.restoreKeywords()} className="material-icons hover-green color_green">restore</i>
            </div>
            :null
          }






        </div>
      </div>
    )
  }
}

function mapStateToProps(state){return{ filtros_tracking_keywords : state.filtros_tracking_keywords, cliente: state.cliente_seleccionado, tracking_keywords_edit: state.tracking_keywords_edit, empleado:state.empleado }}
function  matchDispatchToProps(dispatch){ return bindActionCreators({ setEditKeywordsTracking, setFiltrosTrackingKeywords }, dispatch) }

export default connect(mapStateToProps, matchDispatchToProps)(Filtros);
