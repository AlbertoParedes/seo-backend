import React, { Component } from 'react';
import functions from '../../../Global/functions'
import { connect } from 'react-redux';
import firebase from '../../../../firebase/Firebase';
import $ from 'jquery'
const db = firebase.database().ref();

class NewClientes extends Component {
  constructor(props){
    super(props);
    this.state={
      newClientes:''
    };
  }

  componentWillMount = () => {document.addEventListener('mousedown',this.clickOutSide, false);}
  componentWillUnmount = () => {document.removeEventListener('mousedown',this.clickOutSide, false);}
  clickOutSide = (e) => {if(!this.node.contains(e.target)){this.close()}}
  close = () =>{this.props.close()}

  mensajeInformativo = (text) =>{var element = $(`#tracking-mensaje`); if(!$(element).attr('class').includes('show')){ $(element).text(text).addClass('show'); setTimeout( function(){ $(element).removeClass('show'); }, 3500 );}}


  //con esto creamos y revisamos si ya existe el cliente para añadirlo o informar de que ya exite
  newClientes = () => {

    var array = this.state.newClientes.split('\n');
    var nuevos_clientes = [], error_protocolo=false,error_punto=false, lista=[];
    array.forEach( c => {
      if(c.trim()!==''){

        var url = c.toLowerCase().trim();
        if(!url.includes('.')){
          error_punto = true
          return false
        } else if(url.startsWith('http://') || url.startsWith('https://')){

          var dominio = functions.getDominio(url);

          var repetido = lista.some((l) => {return l.dominio===dominio})

          if(!repetido){
            nuevos_clientes.push({dominio,url: c.toLowerCase().trim()})
            lista.push({dominio})
          }


        }else{
          error_protocolo = true
          return false
        }
      }
    })

    if(error_protocolo){
      this.mensajeInformativo('Todas las urls tienen que empezar por http:// o https://')
    }
    else if(error_punto){
      this.mensajeInformativo('Todas las urls tienen que contener almenos un punto')
    }else{

      var multiPath = {}
      nuevos_clientes.forEach( cl => {

        var repetido = Object.entries(this.props.clientes).some(([k,c])=>{return functions.getDominio(c.web)===cl.dominio})
        if(!repetido){

          var key = db.child(`Clientes`).push().key;
          var cliente = {
            web:cl.url,
            id_cliente:key,
            eliminado:false,
            activo:true,
            dominio:cl.dominio,
            empleados:{
              tracking:{}
            },
            tracking:{
              activo:true,
              keywords:{}
            }
          }

          multiPath[`Clientes/${key}`] = cliente;

        }

      })



      if(Object.keys(multiPath).length>0){
        var n = Object.keys(multiPath).length
        db.update(multiPath)
        .then(()=>{
          this.mensajeInformativo(`Se ${n===1?'ha':'han'} agregado ${n} ${n===1?'cliente nuevo':'clientes nuevos'} correctamente`)
          this.close()
        })
        .catch((err)=>{
          this.mensajeInformativo(`No se han podido añadir ningun cliente`)
        })

      }else{
        this.mensajeInformativo('Ya existen o no son válidos estos clientes')
      }




    }



  }

  render(){
    return(
      <div className='pop-up-new-clientes' onClick={e=>e.stopPropagation()} ref={node=>this.node=node}>


        <div className='container-list-filter blank-hover'>
          <div className='title-option-filter'>Nuevos clientes</div>


          <textarea className='textarea-clientes-nuevos' value={this.state.newClientes} onChange={e=>this.setState({newClientes:e.target.value})} placeholder='Añade uno o varios clientes por fila'/>

        </div>

        <div className="container-bottom-btns-confirm opciones-nuevos-clientes">
          <div className="btn-cancelar-confirm" onClick={()=>this.close()}>Cancelar</div>
          <div className="btn-aceptar-confirm" onClick={()=>this.newClientes()}>Guardar</div>
        </div>


      </div>
    )
  }
}

function mapStateToProps(state){return{ clientes : state.clientes }}

export default connect(mapStateToProps)(NewClientes);
