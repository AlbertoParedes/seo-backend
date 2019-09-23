import React, { Component } from 'react';
import CheckBox from '../../../Global/CheckBox'
import firebase from '../../../../firebase/Firebase';
import data from '../../../Global/Data/Data'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setPanelTracking, setKeywordTrackingSelected, setEditKeywordsTracking } from '../../../../redux/actions';
import dotProp from 'dot-prop-immutable';
const db = firebase.database().ref();

class ItemKeyword extends Component {

  constructor(props){
      super(props);
      this.state={
      };
  }

  seleccionarKeyword = () => {
    if(this.props.keyword.results.new.id_date){
      this.props.setKeywordTrackingSelected(this.props.keyword)
      this.props.setPanelTracking('resultados')
    }else{
      console.log('Esta keyword no tiene registros');
    }
  }

  updateCheckBox = (value) => {

    var seleccionados = dotProp.set(this.props.tracking_keywords_edit.seleccionados, `${this.props.keyword.id_keyword}.checked`, value) ;
    seleccionados[this.props.keyword.id_keyword].id_keyword=this.props.keyword.id_keyword
    seleccionados[this.props.keyword.id_keyword].id_cliente=this.props.cliente.id_cliente
    this.props.setEditKeywordsTracking({ activo:this.props.tracking_keywords_edit.activo , seleccionados })
    console.log(seleccionados);
    //this.setState({empleados})

  }

  callbackSwitch = (json) => {
    var multiPath = {}
    if(json.id==='activo'){
      //si eres el empleado de ese cliente si vas a poder modificar el activo
      if( !this.props.cliente.empleados || (this.props.cliente.empleados && !this.props.cliente.empleados.tracking) || (this.props.cliente.empleados && this.props.cliente.empleados.tracking[this.props.empleado.id_empleado])   ||   this.props.empleado.privilegios.tracking.edit.status_keyword){

        multiPath[`Clientes/${this.props.cliente.id_cliente}/tracking/keywords/${this.props.keyword.id_keyword}/activo`]=json.valor
        db.update(multiPath)
        .then(()=>{  })
        .catch((err)=>{ this.mensajeInformativo('Error') })

      }else{
        this.mensajeInformativo('No tiene permiso para modificar esta keyword');
      }
    }
  }


  render() {

    var posicion = '-';
    if(this.props.keyword.results.new.id_date && !this.props.keyword.results.new.first_position){
      posicion='+100'
    }else if(this.props.keyword.results.new.first_position){
      posicion = this.props.keyword.results.new.first_position
    }

    var date = '-';
    if(this.props.keyword.results.new.id_date){
      date = this.props.keyword.results.new.id_date.split('-');
      date = (+date[2])+' '+data.months[ (+date[1])-1 ]+", "+date[0]
    }

    /*Calculamos la direrencia entre el anterior y el nuevo*/
    var diferencia = 'error';
    if(this.props.keyword.results.new.first_position === this.props.keyword.results.previous.first_position){
      diferencia=0;
    }else if(this.props.keyword.results.new.first_position && this.props.keyword.results.previous.first_position){
      diferencia = this.props.keyword.results.previous.first_position - this.props.keyword.results.new.first_position

    }else if(this.props.keyword.results.previous.first_position && !this.props.keyword.results.new.first_position){ // si el anterior existe pero el nuevo no esta entre los 100 primero restaremos 100
      diferencia = this.props.keyword.results.previous.first_position - 100;

    }else if(!this.props.keyword.results.previous.first_position && this.props.keyword.results.new.first_position){ // si el nuevo existe pero el anterior no esta entre los 100 primero restaremos 100
      diferencia = 100 - this.props.keyword.results.new.first_position;
    }


    return(
      <tr data-id={this.props.keyword.id_keyword} className={`${this.props.keyword_selected && this.props.keyword_selected.id_keyword===this.props.keyword.id_keyword?'active-row-table':''}`}>

        {this.props.tracking_keywords_edit.activo?

          <td className='key-checkbox' >
            <CheckBox _class='checkbox-in-table' checked={!this.props.tracking_keywords_edit.seleccionados[this.props.keyword.id_keyword]?false:this.props.tracking_keywords_edit.seleccionados[this.props.keyword.id_keyword].checked } changeValue={value=>this.updateCheckBox(value)}/>
          </td>

          :null
        }

        <td className='key-status'>
          <div className={`status-point ${this.props.keyword.activo?'good-status':'warning-status'} ${this.props.keyword.eliminado?'wrong-status':''}     `} ></div>
        </td>

        <td className='key-keyword'>
          <div className='edit-container'>
            <span> {this.props.keyword.keyword} </span>
          </div>
        </td>

        <td  className='key-posicion pr'>

            {diferencia!==0?
              <span className={`diferencia-num ${diferencia<0?'negative-pos':''} ${diferencia>0?'positive-pos':''}`}>
                <i className={`material-icons ${diferencia<0?'arrow_red':''} ${diferencia>0?'arrow_green':''}`} > chevron_right </i>
                <span >{diferencia.toString().replace('-','')}</span>
              </span> :null
            }


            <span className={`${posicion==='+100'?'mayor-cien':''}`}>{posicion}</span>
        </td>

        <td  className='key-url'>
          { this.props.keyword.results.new.first_url ? this.props.keyword.results.new.first_url : '-' }
        </td>

        <td  className='key-fecha'>
          <span> {date} </span>
        </td>

        <td  className='key-img'>
          {this.props.keyword.results.new.image?
              <a href={this.props.keyword.results.new.image} target='_blank' rel="noopener noreferrer" className='align-center'><i className="material-icons">camera_alt</i></a>
            :
              <span className='align-center'>-</span>
          }
        </td>

        <td onClick={()=>{this.seleccionarKeyword()}} className='key-more'>
          <i className="material-icons align-center">chevron_right</i>
        </td>
      </tr>

    )
  }
}

function mapStateToProps(state){return{ keyword_selected:state.tracking.keyword_tracking_selected, cliente: state.cliente_seleccionado, empleado: state.empleado, tracking_keywords_edit: state.tracking.tracking_keywords_edit }}
function matchDispatchToProps(dispatch){ return bindActionCreators({setPanelTracking, setKeywordTrackingSelected, setEditKeywordsTracking }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(ItemKeyword);
