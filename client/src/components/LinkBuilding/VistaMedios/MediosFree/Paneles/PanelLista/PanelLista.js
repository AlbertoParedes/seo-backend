import React, {Component} from 'react'
import bbdd_file from '../../../../../Global/Data/linkbuilding_bbdd'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectCategoriaMediosGratuitos } from '../../../../../../redux/actions';
import ItemMedioFree from './ItemMedioFree'

import firebase from '../../../../../../firebase/Firebase';
const db = firebase.database().ref();


class PanelLista extends Component{

  constructor(props){
      super(props);
      this.state={

        medios:this.props.medios,
        medios_ordenados:[],

        sortBy:this.props.sortBy,
        des:this.props.des,
        search:this.props.search,
        searchBy:this.props.searchBy,

        items: this.props.items,
        filtros:this.props.filtros,


      };
  }

  componentWillMount = () => { this.ordenarMedios();}

  componentWillReceiveProps = newProps => {

    if(this.state.medios!==newProps.medios ||
       this.state.sortBy!==newProps.sortBy ||
       this.state.des!==newProps.des ||
       this.state.filtros!==newProps.filtros ||
       this.state.search!==newProps.search ||
       this.state.searchBy!==newProps.searchBy ||
       this.props.categoria_seleccionada!==newProps.categoria_seleccionada
     ){

      this.setState({
        medios:newProps.medios,
        sortBy:newProps.sortBy,
        des:newProps.des,
        filtros:newProps.filtros,
        search:newProps.search,
        searchBy:newProps.searchBy,
        categoria_seleccionada:newProps.categoria_seleccionada
      }, () => { this.ordenarMedios() })

    }else if(this.state.items!==newProps.items){this.setState({items:newProps.items})}

  }

  selectCategoria = categoria => {
    this.props.selectCategoriaMediosGratuitos(categoria);
  }

  restaurarbbdd = () =>{
    /*
    var enlaces = bbdd_file.enlaces.enlaces_gratuitos;
    console.log(bbdd_file.enlaces.enlaces_gratuitos);
    var multiPath= {}
    Object.entries(enlaces).forEach(([k,e])=>{


      Object.entries(e).forEach(([k2,f])=>{
        Object.entries(f).forEach(([k3,r])=>{

          if(r.categoria==='blogs_gratuitos'){
            //medios.webs2_0.medios=c.medios;
            r.categoria='webs2_0'
          }
          else if(r.categoria==='comentarios_en_webs'){
            //medios.comentarios.medios=c.medios;
            r.categoria='comentarios'
          }else if(r.categoria==='herramientas_de_analisis'){
            //medios.herramientas_de_analisis.medios=c.medios;
            r.categoria='herramientas_de_analisis'
          }
          else if(r.categoria==='directorios'){
            //medios.directorios.medios=c.medios;
            r.categoria='directorios'
          }else if(r.categoria==='foros'){
            //medios.foros.medios=c.medios;
            r.categoria='foros'
          }
          else if(r.categoria==='marcadores'){
            //medios.marcadores.medios=c.medios;
            r.categoria='marcadores'
          }
          else if(r.categoria==='perfiles'){
            //medios.perfiles.medios=c.medios;
            r.categoria='perfiles'
          }else if(r.categoria==='redes_sociales_o_agregadores'){
            //medios.redes_sociales_o_agregadores.medios=c.medios;
            r.categoria='redes_sociales_o_agregadores'
          }

          else if(r.categoria==='enlaces_contextuales' || r.categoria==='enlaces_de_interes' || r.categoria==='enlaces_rotos' || r.categoria==='guestblogging'){
            //Object.entries(c.medios).forEach(([k2,m])=>{

              if(r.id_medio==='-LSGEHAjfP9xgFmQ_FeK' || r.id_medio==='-LSGFEMe30srKt0nwuZ7' || r.id_medio==='-LSHCQIphvKad6PQr1N3' || r.id_medio==='-LSJFBXcDfVwrx4RsspZ' || r.id_medio==='-LSOv9x9eic4wgkl4LVI' || r.id_medio==='-LSP763RnvnJCC-aOXa4' || r.id_medio==='-LSPvXVT2_MqeH3JbSIq' || r.id_medio==='-LSUS8iaE7Kxow6co_ZY' ){
                //medios.pbn.medios[k2]=m;
                r.categoria='pbn'
              }else{
                //medios.colaboraciones.medios[k2]=m;
                r.categoria='colaboraciones'
              }
            //})
          }

          multiPath[`Servicios/Linkbuilding/Free/Enlaces/clientes/${k}/mensualidades/${k2}/enlaces/${k3}`]=r

        })
      })
    })

    console.log(enlaces);
    console.log(multiPath);
    db.update(multiPath)
    */
  }

  ordenarMedios = () => {
    if(this.state.categoria_seleccionada){
      var medios_ordenados = Object.entries(this.state.categoria_seleccionada.medios)
      this.setState({medios_ordenados},()=>{ })
    }
  }


  render(){
    console.log(this.state.medios_ordenados);
    return(

      <div className='panel-medios-gratuitos pr'>
        <div className='categotias-barra'>
          <div className='container-items-barra-lateral'>
            <div className='container-items-barra-lateral-scroll'>
              {Object.entries(this.state.medios).map(([k,c])=>{
                return(
                  <div key={k} data-id={k} className='container-item-lista-categoria'>
                    <div className={`item-lista-categoria ${this.props.categoria_seleccionada && this.props.categoria_seleccionada.id===k?'active-row-table':''} `} onClick={()=>this.selectCategoria(c)}>{c.nombre}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className='sub-container-panels'>
          <div className='categorias-panel'>
            {this.props.categoria_seleccionada?
                <div>
                  <table id='table-medios-free-linbuilding'>
                    <thead>
                      <tr>

                        {/*this.props.tracking_clientes_edit.activo?
                          <th className='cli-checkbox' > <span></span> </th> :null
                        */}

                        <th onClick={()=>this.changeSort('status')} className='lb-medios-free-status' >
                          <span>Status</span> {this.state.sortBy==='status' || true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th onClick={()=>this.changeSort('dominio')} className='lb-medios-free-web' >
                          <span>Web</span> {this.state.sortBy==='dominio'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('dr')} className='lb-medios-free-dr'>
                          <span>DR</span> {this.state.sortBy==='dr'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('ur')} className='lb-medios-free-ur'>
                          <span>UR</span> {this.state.sortBy==='ur'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>


                        <th  onClick={()=>this.changeSort('tematicas')} className='lb-medios-free-tematicas'>
                          <span>Temáticas</span> {this.state.sortBy==='tematicas'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('descripcion')} className='lb-medios-free-descripcion'>
                          <span>Descripcion</span> {this.state.sortBy==='descripcion'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>


                        <th  onClick={()=>this.changeSort('reutilizable')} className='lb-medios-free-reutilizable'>
                          <span>Reutilizable</span> {this.state.sortBy==='reutilizable'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>


                        <th  onClick={()=>this.changeSort('requiere')} className='lb-medios-free-requiere'>
                          <span>Requiere</span> {this.state.sortBy==='requiere'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('clientes')} className='lb-medios-free-clientes'>
                          <span>Clientes</span> {this.state.sortBy==='clientes'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>


                        <th className='lb-medios-free-more'></th>

                      </tr>
                    </thead>
                    <tbody>

                    {
                       this.state.medios_ordenados.reduce((result, item, i)=>{
                        const k = item[0], medio = item[1];
                        if (i < 200 ) {
                            result.push(
                              <ItemMedioFree key={k} medio={medio} />
                            );
                        }
                        return result;
                      }, [])

                    }
                    </tbody>
                  </table>
                </div>
              :null
            }



          </div>
        </div>

      </div>


    )
  }

}

function mapStateToProps(state){return{
  categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada,
  medios: state.linkbuilding.medios.tipos.free.medios
}}
function matchDispatchToProps(dispatch){ return bindActionCreators({ selectCategoriaMediosGratuitos }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
