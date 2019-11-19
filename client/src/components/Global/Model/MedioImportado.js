import {cleanProtocolo} from '../functions'
import data from '../../Global/Data/Data'

class MedioImportado {
  idMedio = false
  tematica
  categoria
  f_nf
  dr
  da
  rdDomain
  rdDomainDf
  rdInternas 
  ldDomain
  ldInternas
  enlace
  precio
  claves
  notas
  trafico
  idArrayExcel


  porcentajeDfDomain
  ratioDomain
  ratioInternas

  medioEncontrado=false
  categoriaObject=false


  constructor({
    tematica,
    categoria,
    f_nf,
    dr,
    da,
    rdDomain,
    rdDomainDf,
    rdInternas, 
    ldDomain,
    ldInternas,
    medio,
    precio,
    claves,
    notas,
    trafico,
    idArrayExcel,
  }){

    this.tematica = tematica ? tematica.trim() : ''
    this.categoria = categoria ? categoria.trim() : ''
    this.f_nf = f_nf ? f_nf.trim() : ''
    this.dr = dr ? dr : 0
    this.da = da ? da : 0
    this.rdDomain = rdDomain ? rdDomain : 0
    this.rdDomainDf = rdDomainDf ? rdDomainDf : 0
    this.rdInternas = rdInternas ? rdInternas : 0
    this.ldDomain = ldDomain ? ldDomain : 0
    this.ldInternas = ldInternas ? ldInternas : 0

    if(medio){
      if(medio.startsWith('http://') && medio.startsWith('https://') ){
        this.medio = `http://${medio}`
      }else{
        this.medio = medio
      }
      
    }else{
      this.medio = ''
    }

    this.precio = precio ? precio : 0
    this.claves = claves ? claves.trim() : ''
    this.notas = notas ? notas.trim()  : ''
    this.trafico = trafico ? trafico: 0
    this.idArrayExcel = idArrayExcel?idArrayExcel:''
    
  }

  checkTematica = () => {
    var error = false
    if(this.tematica!=='' && data.tematicasPrensarank.some(t=>t.toLowerCase()===this.tematica.toLowerCase())){
      this.tematica = data.tematicasPrensarank.some(t=>t.toLowerCase()===this.tematica.toLowerCase())
    }else{
      error = true
    }
    return error
  }

  checkMedioEncontrado = (mediosGratuitos) => {
    var error = false
    var encontrado = Object.entries(mediosGratuitos).some(([i,c])=>{
      return Object.entries(c.medios).some(([j,m])=>{
        //comprobamos que el medio ya esta en nuestra base de datos y le asignamos ese id para no crear uno nuevo
        if(cleanProtocolo(m.web) === cleanProtocolo(this.medio)){
          if(!this.categoriaObject){
            error = 'no existe esa categoria'
          }else if(this.categoriaObject.id===c.id){
            //si la categoria de la clasificacion de Guille coincide con la del excel, no habra ningun problema 
            this.medioEncontrado = {
              idCategoria:c.id,
              nombreCategoria: c.valor,
              idMedio: m.id_medio
            }
            this.idMedio = m.id_medio
          }else if(this.categoriaObject.id!==c.id){
            //si la categoria existe pero no es la misma la tendran que cambiar desde el excel
            error = `la categoria no coincide, deberia ser ${c.valor}`
          }
          return true
        }
        return false 
      })
    })
    return error
  }

  checkCategoria = () => {
    var error = false
    var categoriaObject = Object.entries(data.categoriaMediosFree).find(([i,c])=>{
      return c.texto.toLowerCase()===this.categoria.toLowerCase()
    })
    if(categoriaObject){
      this.categoriaObject = categoriaObject[1]
    }else{
      error=true
    }
    return error
  }



}

export default MedioImportado