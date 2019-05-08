import React, { Component } from 'react';
import functions from '../../../Global/functions'
import { connect } from 'react-redux';
import firebase from '../../../../firebase/Firebase';
import $ from 'jquery'
const db = firebase.database().ref();

class NewKeywords extends Component {
  constructor(props){
    super(props);
    this.state={
      newKeywords:''
    };
  }

  componentWillMount = () => {document.addEventListener('mousedown',this.clickOutSide, false);}
  componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
  clickOutSide = (e) => {if(!this.node.contains(e.target)){this.close()}}
  close = () =>{this.props.close()}

  //con esto creamos y revisamos si ya existe el cliente para añadirlo o informar de que ya exite
  agregarKeywords = () => {

    var separators = ['\n'];
    var lista = this.state.newKeywords.split(new RegExp(separators.join('|'), 'g'));
    var keywordsAux = [];

    var multiPath = {}
    lista.forEach((l,k)=>{
      var keyword = l.trim();


      //buscamos si esta palabra ya esta dentro del las keywords de este cliente
      var some = this.props.cliente.servicios.tracking.keywords ? Object.entries(this.props.cliente.servicios.tracking.keywords).some(([k,o])=>{return o.keyword===keyword}) : false;

      //comprobamos que no se unas a otras las keywords introducidas
      var repetido = keywordsAux.filter( o => {return o===keyword} );
      keywordsAux.push(keyword)

      if(!some && keyword!=='' && repetido.length===0){
        console.log(keyword);
        var key = db.child(`Clientes/${this.props.cliente.id_cliente}/servicios/tracking/keywords`).push().key;
        var object = {
          activo:true,
          done:false,
          eliminado:false,
          id_keyword:key,
          keyword: keyword,
          results: {
            new:{
              all_positions:false,
              first_position:false,
              first_url:false,
              id_date:false,
              image:false
            },
            previous:{
              all_positions:false,
              first_position:false,
              first_url:false,
              id_date:false,
              image:false
            }
          }
        }
        multiPath[`Clientes/${this.props.cliente.id_cliente}/servicios/tracking/keywords/${key}`]=object;
      }


    })
    console.log(multiPath);
    if(Object.keys(multiPath).length>0){
      var n = Object.keys(multiPath).length
      db.update(multiPath)
      .then(()=>{
        //this.mensajeInformativo(`Se ${n===1?'ha':'han'} agregado ${n} ${n===1?'keyword nueva':'keywords nuevas'} correctamente`)
        console.log(`Se ${n===1?'ha':'han'} agregado ${n} ${n===1?'keyword nueva':'keywords nuevas'} correctamente`);
        this.close()
      })
      .catch((err)=>{
        //this.mensajeInformativo(`No se han podido añadir ninguna keyword`)
        console.log(`No se han podido añadir ninguna keyword`);
      })
    }else{
      //this.mensajeInformativo('Ya existen o no son válidas estos keywords')
      console.log('Ya existen o no son válidas estos keywords');
    }
  }

  render(){
    return(
      <div className='pop-up-new-clientes' onClick={e=>e.stopPropagation()} ref={node=>this.node=node}>


        <div className='container-list-filter blank-hover'>
          <div className='title-option-filter'>Nuevas keywords</div>


          <textarea className='textarea-clientes-nuevos' value={this.state.newKeywords} onChange={e=>this.setState({newKeywords:e.target.value})} placeholder='Añade una o varias keywords por fila'/>

        </div>

        <div className="container-bottom-btns-confirm opciones-nuevos-clientes">
          <div className="btn-cancelar-confirm" onClick={()=>this.close()}>Cancelar</div>
          <div className="btn-aceptar-confirm" onClick={()=>this.agregarKeywords()}>Guardar</div>
        </div>


      </div>
    )
  }
}

function mapStateToProps(state){return{ cliente : state.cliente_seleccionado }}

export default connect(mapStateToProps)(NewKeywords);
