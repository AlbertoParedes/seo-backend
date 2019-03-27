import React, {Component} from 'react'
import dataMedios from '../../../../../Global/Data/medios_gratuitos'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectCategoriaMediosGratuitos } from '../../../../../../redux/actions';
import ItemMedioFree from './ItemMedioFree'

class PanelLista extends Component{

  constructor(props){
    super(props);
    this.state={
      medios : {

        herramientas_de_analisis:{
          id:'herramientas_de_analisis',
          nombre:'Herramientas de análisis',
          medios:{}
        },
        marcadores:{
          id:'marcadores',
          nombre:'Marcadores',
          medios:{}
        },
        redes_sociales_o_agregadores:{
          id:'redes_sociales_o_agregadores',
          nombre:'RRSS y agregadores',
          medios:{}
        },
        directorios:{
          id:'directorios',
          nombre:'Directorios',
          medios:{}
        },
        foros:{
          id:'foros',
          nombre:'Foros',
          medios:{}
        },
        perfiles:{
          id:'perfiles',
          nombre:'Perfiles',
          medios:{}
        },
        comentarios:{
          id:'comentarios',
          nombre:'Comentarios',
          medios:{}
        },
        webs2_0:{
          id:'webs2_0',
          nombre:'Webs 2.0',
          medios:{}
        },
        pbn:{
          id:'pbn',
          nombre:'PBN',
          medios:{}
        },
        colaboraciones:{
          id:'colaboraciones',
          nombre:'Colaboraciones',
          medios:{}
        },

      },
      medios_ordenados:[],
      categoria_seleccionada:this.props.categoria_seleccionada
    }
  }

  componentWillReceiveProps = newProps => {
    if(this.props.categoria_seleccionada!==newProps.categoria_seleccionada){this.setState({categoria_seleccionada:newProps.categoria_seleccionada}, ()=>{
      this.ordenarMedios()
    }) }
  }

  componentWillMount = () =>{
    this.restaurarbbdd();
    this.ordenarMedios()
  }

  selectCategoria = categoria => {
    this.props.selectCategoriaMediosGratuitos(categoria);
  }

  restaurarbbdd = () =>{
    var medios_bbdd = dataMedios;
    var medios=this.state.medios;
    Object.entries(medios_bbdd.categorias).forEach(([k,c])=>{

      console.log(k,Object.keys(c.medios).length);

      if(k==='blogs_gratuitos'){
        medios.webs2_0.medios=c.medios;
      }
      else if(k==='comentarios_en_webs'){
        medios.comentarios.medios=c.medios;
      }else if(k==='herramientas_de_analisis'){
        medios.herramientas_de_analisis.medios=c.medios;
      }
      else if(k==='directorios'){
        medios.directorios.medios=c.medios;
      }else if(k==='foros'){
        medios.foros.medios=c.medios;
      }
      else if(k==='marcadores'){
        medios.marcadores.medios=c.medios;
      }
      else if(k==='perfiles'){
        medios.perfiles.medios=c.medios;
      }else if(k==='redes_sociales_o_agregadores'){
        medios.redes_sociales_o_agregadores.medios=c.medios;
      }

      else if(k==='enlaces_contextuales' || k==='enlaces_de_interes' || k==='enlaces_rotos' || k==='guestblogging'){
        Object.entries(c.medios).forEach(([k2,m])=>{

          if(m.web.includes('madrid-reformasintegrales.com') || m.web.includes('seo-posicionamientoweb.com') || m.web.includes('tratamientoyenfermedades.com') || m.web.includes('gethealthonline.net') || m.web.includes('tumejorestetica.com') || m.web.includes('brainstormer.es') || m.web.includes('yoseomarketing.com') || m.web.includes('ofertasdepanalesbaratosonline.es') ){
            medios.pbn.medios[k2]=m;
          }else{
            medios.colaboraciones.medios[k2]=m;
          }
        })
      }


    })
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
          {Object.entries(this.state.medios).map(([k,c])=>{
            return(
              <div key={k} data-id={k} className='container-item-lista-categoria'>
                <div className={`item-lista-categoria ${this.props.categoria_seleccionada && this.props.categoria_seleccionada.id===k?'active-row-table':''} `} onClick={()=>this.selectCategoria(c)}>{c.nombre}</div>
              </div>
            )
          })}
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

                        <th  onClick={()=>this.changeSort('clientes')} className='lb-medios-free-clientes'>
                          <span>Clientes</span> {this.state.sortBy==='clientes'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('reutilizable')} className='lb-medios-free-reutilizable'>
                          <span>Reutilizable</span> {this.state.sortBy==='reutilizable'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('requiere')} className='lb-medios-free-requiere'>
                          <span>Requiere</span> {this.state.sortBy==='requiere'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('tematicas')} className='lb-medios-free-tematicas'>
                          <span>Temáticas</span> {this.state.sortBy==='tematicas'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
                        </th>

                        <th  onClick={()=>this.changeSort('descripcion')} className='lb-medios-free-descripcion'>
                          <span>Descripcion</span> {this.state.sortBy==='descripcion'|| true? <i className={`material-icons sort-arrow ${this.state.des?'des-arrow':''}`}>arrow_downward</i> :null}
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

function mapStateToProps(state){return{ categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada }}
function matchDispatchToProps(dispatch){ return bindActionCreators({ selectCategoriaMediosGratuitos }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(PanelLista);
