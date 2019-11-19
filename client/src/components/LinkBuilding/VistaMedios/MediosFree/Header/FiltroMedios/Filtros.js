import React, { Component } from 'react'
import ListaVistas from '../../../../../Filtros/ListaVistas'
import ItemsFiltro from '../../../../../Filtros/ItemsFiltro'
import ListaFiltros from '../../../../../Filtros/ListaFiltros'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPopUpInfo, setVistaLinkBuilding, setFiltrosMediosFreeListaLinkbuilding, setFiltrosFreePaid } from '../../../../../../redux/actions';
import NuevoMedio from './NuevoMedio'
import firebase from '../../../../../../firebase/Firebase';
import ExcelButton from './ExcelButton'
import MedioImportado from '../../../../../Global/Model/MedioImportado'
import SideBar from './SideBar'
import { cleanProtocolo } from '../../../../../Global/functions';
const db = firebase.database().ref();
class Filtros extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show_filtros: false,
      show_vistas: false,
      show_new_medios: false,
      showViewExcel:false,
      showPanelNewMedios: false,
      mediosNuevos:[]
    }
  }

  changeFiltros = (filtros) => {
    if (this.props.filtros.type !== filtros.type) {
      this.props.setFiltrosFreePaid(filtros.type)
    } else {
      this.props.setFiltrosMediosFreeListaLinkbuilding(filtros)
    }
  }

  changeVista = (vistas) => {
    var multiPath = {}
    var vistaDisponible = Object.entries(vistas.items).find(([k, v]) => { return v.checked })
    if (vistaDisponible) {
      multiPath[`Empleados/${this.props.empleado.id_empleado}/session/vista`] = vistaDisponible[0]
      db.update(multiPath)
    }
    console.log(vistas);
    
    this.props.setVistaLinkBuilding(vistas)
  }

  openNew = () => {
    if (!this.props.categoria_seleccionada) {
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text: 'Selecciona una categoria' })
      return false;
    }
    this.setState({ show_new_medios: true })
  }

  getDataExcel = (dataFile) => {
    if(!dataFile[0]) return false
    var cabeceraData = dataFile[0]
    //comprobamos que existen cada uno de los campos en en el orden correcto
    var cabecera = errorCabecera(cabeceraData)
    if(!cabecera){
      var error = false;
      //agregamos todos los medios a un array 
      
      var mediosNuevos = []
      dataFile.forEach((row, key)=>{
        if(key===0)return false
        if(!row[13] || row[13].trim()==="" || error)return false

        var medio = row[13].trim().toLowerCase();
        error = mediosNuevos.some(m=> cleanProtocolo(m.medio)===cleanProtocolo(medio) )

        //validamos que no hay repetidos entre los medios del excel, sino mostrar error
        if(error){ 
          error = `Linea ${key+1}: se ha repetido el medio ${medio}`;
          return false 
        }

        //creamos el objeto medio
        var newMedio = new MedioImportado({
          tematica: row[0],
          categoria: row[1],
          F_NF: row[2],
          dr: row[3],
          da: row[4],
          rdDomain: row[5],
          rdDomainDf: row[6],
          //porcentajeDfDomain: row[7],
          rdInternas: row[8],
          ldDomain: row[9],

          ldInternas: row[10],
          //ratio domain 11
          //ratio internas 12
          medio,
          precio: row[14],
          claves: row[15],
          notas: row[16],
          trafico: row[17],
          importacion:true,
          idArrayExcel:key,

        })

        //comprobar que existe tematica y que es una de las de Prensarank
        if(newMedio.checkTematica()){
          error = `Linea ${key+1}: la temática no existe`;
          return false
        }
        //comprobamos la categoria del medio sino mostramos error
        if(newMedio.checkCategoria()){ 
          error = `Linea ${key+1}: la categoria no es correcta`; 
          return false 
        }
        //comprobamos que la categoria del medio del excel es el mismo que el del medio de la bbdd y sino mostramos un error
        var errorMedio = newMedio.checkMedioEncontrado(this.props.medios)
        if(errorMedio){
          error = `Linea ${key+1}: ${errorMedio}`;
          return false
        }
        
        mediosNuevos.push(newMedio)
      })

      if(error){
        this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text:error })
      }else{
        //si no hay errores procederemos a agregar los medios nuevos
        this.uploadMedios()
      }

      //this.setState({showPanelNewMedios:true, mediosNuevos})

    }else{
      this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text:cabecera })
    }
  }

  uploadMedios = () => {
    console.log('ok');
    
  }

  errorExcel = text => {
    this.props.setPopUpInfo({ visibility: true, status: 'close', moment: Date.now(), text })
  }

  callBack = () => {
    this.setState({showPanelNewMedios:false})
  }

  render() {
    return (
      <div className='pr'>
        <ItemsFiltro filtros={this.props.filtros} updateFiltros={(filtros => this.changeFiltros(filtros))} />
        <div className='opciones-alumnos'>
          <div className='deg-opt'></div>



          <div className='btn-options pr' onClick={() => this.setState({ show_filtros: this.state.show_filtros ? false : true })}>

            <i className="material-icons"> filter_list </i> <span>Filtros</span>
            {this.state.show_filtros ?
              <ListaFiltros filtros={this.props.filtros} updateFiltros={(filtros => this.changeFiltros(filtros))} close={() => this.setState({ show_filtros: false })} /> : null
            }
          </div>

          <div className='btn-options pr' onClick={() => this.setState({ show_vistas: this.state.show_vistas ? false : true })}>

            <i className="material-icons"> visibility </i> <span>Vistas</span>
            {this.state.show_vistas ?
              <ListaVistas vistas={this.props.vistas} updateVistas={(vistas => this.changeVista(vistas))} close={() => this.setState({ show_vistas: false })} /> : null
            }
          </div>

          {/*Items barra*/}
          <div className={`item-container-icon-top-bar pr ${this.state.show_new_medios ? 'color-azul' : ''}`} >
            <i onClick={() => this.openNew()} className="material-icons hover-azul middle-item">add</i>
            {this.state.show_new_medios ?
              <NuevoMedio close={() => { this.setState({ show_new_medios: false }) }} /> : null
            }
          </div>

          {/*Items barra*/}
          <ExcelButton getDataExcel={this.getDataExcel} errorExcel={text=>this.errorExcel(text)}/>

          {this.state.showPanelNewMedios?
            <SideBar
              subtext={'sadalkdjad'}
              mediosNuevos={this.state.mediosNuevos}
              callBack={(list)=>{this.callBack()}}
            />:null
          }

          {/*this.state.showPanelNewMedios?
            <div className={`panel-container-nuevos-medios-importados`}>
              <div className={`container-side child-medios-importados-root`} onClick={e=>e.stopPropagation()}>
                <div className='title-side-bar-medios pr'>
                  <div className="close-side-bar-medios" onClick={()=>this.setState({showPanelNewMedios:false})}><i className="material-icons "> cancel </i></div>
                  <div className="text-title-medios">Importar medios</div>
                  <div className="container-opciones-medios">
                    <div className="opciones-bar-medios width_100 opc-activa txt-title-url-estrategia">
                      <span className="pr add-new-destino-estrategia">1200 medios encontrados</span>
                    </div>
                  </div>
                </div>
                <div className='scroll-side scroll-bar-medios pr overflow_hidden pdd-65'>
                  <TablaMediosImportados mediosNuevos={this.state.mediosNuevos}/>
                </div>
              </div>
            </div>
            :null
          */}
          

        </div>

      </div>
    )
  }

}

function mapStateToProps(state) { return { medios: state.linkbuilding.medios.tipos.free.medios, vistas: state.linkbuilding.vistas, filtros: state.linkbuilding.medios.tipos.free.paneles.lista.filtros, empleado: state.empleado, categoria_seleccionada: state.linkbuilding.medios.tipos.free.categoria_seleccionada, } }
function matchDispatchToProps(dispatch) { return bindActionCreators({ setPopUpInfo, setVistaLinkBuilding, setFiltrosMediosFreeListaLinkbuilding, setFiltrosFreePaid }, dispatch) }
export default connect(mapStateToProps, matchDispatchToProps)(Filtros);

function errorCabecera(title) {
  if(!title[0] || title[0].toLowerCase().trim()!==('TEMATICA').toLowerCase()){
    return 'Error posicion TEMATICA'
  }
  if(!title[1] || title[1].toLowerCase().trim()!==('CATEGORIA').toLowerCase()){
    return 'Error posicion CATEGORIA'
  }
  if(!title[2] || title[2].toLowerCase().trim()!==('F/NF').toLowerCase()){
    return 'Error posicion F/NF'
  }
  if(!title[3] || title[3].toLowerCase().trim()!==('DR').toLowerCase()){
    return 'Error posicion DR'
  }
  if(!title[4] || title[4].toLowerCase().trim()!==('DA').toLowerCase()){
    return 'Error posicion DA'
  }
  if(!title[5] || title[5].toLowerCase().trim()!==('RD Domain').toLowerCase()){
    return 'Error posicion RD Domain'
  }
  if(!title[6] || title[6].toLowerCase().trim()!==('RD Domain DF').toLowerCase()){
    return 'Error posicion RD Domain DF'
  }
  if(!title[7] || title[7].toLowerCase().trim()!==('%DF Domain').toLowerCase()){
    return 'Error posicion %DF Domain'
  }
  if(!title[8] || title[8].toLowerCase().trim()!==('RD Internas').toLowerCase()){
    return 'Error posicion RD Internas'
  }
  if(!title[9] || title[9].toLowerCase().trim()!==('LD Domain').toLowerCase()){
    return 'Error posicion LD Domain'
  }
  if(!title[10] || title[10].toLowerCase().trim()!==('LD Internas').toLowerCase()){
    return 'Error posicion LD Internas'
  }
  if(!title[11] || title[11].toLowerCase().trim()!==('Ratio Domain').toLowerCase()){
    return 'Error posicion Ratio Domain'
  }
  if(!title[12] || title[12].toLowerCase().trim()!==('Ratio Internas').toLowerCase()){
    return 'Error posicion Ratio Internas'
  }
  if(!title[13] || title[13].toLowerCase().trim()!==('MEDIO').toLowerCase()){
    return 'Error posicion MEDIO'
  }
  if(!title[14] || title[14].toLowerCase().trim()!==('PRECIO').toLowerCase()){
    return 'Error posicion PRECIO'
  }
  if(!title[15] || title[15].toLowerCase().trim()!==('CLAVES').toLowerCase()){
    return 'Error posicion CLAVES'
  }
  if(!title[16] || title[16].toLowerCase().trim()!==('NOTAS').toLowerCase()){
    return 'Error posicion NOTAS'
  }
  if(!title[17] || title[17].toLowerCase().trim()!==('Trafico').toLowerCase()){
    return 'Error posicion Trafico'
  }

  return false
}

class TablaMediosImportados extends Component{

  render(){
    return(
      <div className='container-table-import-medios'>

        <table id='table-import-medios'>
          <thead>

            <tr>
              <th className="lb-medios-import-td-status"><span>Status</span> </th>
              <th class="lb-medios-free-web">
                  <span>Web</span> 
                  <i class="material-icons sort-arrow ">arrow_downward</i>
              </th>
              <th className="lb-medios-import-td-tematica"><span>Temática</span> </th>
              <th className="lb-medios-import-td-categoria"><span>Categoria</span> </th>

              <th className="lb-medios-import-td-fnf"><span>F/NF</span> </th>
              <th className="lb-medios-import-td-dr"><span>DR</span> </th>
              <th className="lb-medios-import-td-da"><span>DA</span> </th>
              <th className="lb-medios-import-td-"><span>RD Domain</span> </th>
              <th className="lb-medios-import-td-"><span>RD Domain DF</span> </th>
              <th className="lb-medios-import-td-"><span>%DF Domain</span> </th>
              <th className="lb-medios-import-td-"><span>RD Internas</span> </th>
              <th className="lb-medios-import-td-"><span>LD Domain</span> </th>
              <th className="lb-medios-import-td-"><span>LD Internas</span> </th>
              <th className="lb-medios-import-td-"><span>Ratio Domain</span> </th>
              <th className="lb-medios-import-td-"><span>Ratio Internas</span> </th>
              <th className="lb-medios-import-td-"><span>Precio</span> </th>
              <th className="lb-medios-import-td-"><span>Claves</span> </th>
              <th className="lb-medios-import-td-"><span>Notas</span> </th>
              <th className="lb-medios-import-td-"><span>Tráfico</span> </th>
            </tr>

          </thead>

          <tbody>
            {this.props.mediosNuevos.map((medio,key)=>{
              return(
                <ItemMedio key={key} medio={medio}/>
              )
            })

            }
          </tbody>


        </table>

      </div>
    )
    }

}

class ItemMedio extends Component {

  constructor(props){
    super(props)
    this.state={
      medio: this.props.medio
    }
  }

  componentWillReceiveProps = (newProps) =>{
    if(this.state.medio!==newProps.medio)this.setState({medio:newProps.medio})
  }

  render(){
    const {medio} = this.state
    return(
      <tr>
        <td></td>
        <td className="lb-medios-import-td-web">
          <span class="span_edit">
            <a href={medio.medio} class="break_sentence ">
            {medio.medio}
            </a>
          </span>
        
        
        </td>
        <td className="lb-medios-import-td-tematica">
          {medio.tematica}
        </td>
        <td className="lb-medios-import-td-categoria">{medio.tipo}</td>
        <td className="lb-medios-import-td-fnf">{medio.f_nf}</td>
        <td className="lb-medios-import-td-dr">{medio.dr}</td>
        <td className="lb-medios-import-td-da">{medio.da}</td>
        <td>{medio.rdDomain}</td>
        <td>{medio.rdDomainDf}</td>
        <td></td>
        <td>{medio.rdInternas}</td>
        <td>{medio.ldDomain}</td>
        <td>{medio.ldInternas}</td>
        <td></td>
        <td></td>
        <td>{medio.precio}</td>
        <td>{medio.claves}</td>
        <td>{medio.notas}</td>
        <td>{medio.trafico}</td>
      </tr>
    )
  }
}