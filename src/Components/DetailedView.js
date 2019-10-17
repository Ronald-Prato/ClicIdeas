import React, { useState, useEffect, useContext } from 'react'
import Context from '../GlobalState/context'
import '../Styles/DetailedView.css'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import * as queries from '../graphql/queries'
import { Button, Icon, Checkbox } from 'antd'
import { CSVLink, CSVDownload } from "react-csv";



const DetailedView = props => {

    const { state, actions } = useContext(Context)
    const [localForm, setLocalForm] = useState({
        red: {
            id: "",
            correoResponsable: "",
            downloadRoute: "",
            iedDesignada: "",
            iedNodo: "",
            numeroNodo: "",
            otraTematica: "",
            personaResponsable: "",
            telefonoResponsable: "",
            tematicaProyecto: "",
            tituloProyecto: "",
            retro: "",
            c1: false
        },
        common: {
            id: "",
            correoResponsable: "",
            downloadRoute: "",
            otraTematica: "",
            personaResponsable: "",
            telefonoResponsable: "",
            tematicaProyecto: "",
            tituloProyecto: "",
            retro: "",
            madeBy: "",
            c1: false
        }
    })
    const [localrenderOption, setRenderOption] = useState("")
    const [iedFullData, setIEDFullData] = useState({})
    const [mainLink, setMainLink] = useState("")
    const [anexLink, setAnexLink] = useState("")
    const [checked, setChecked] = useState(false)
    const [csvHeaders, setCsvHeaders] = useState([
        "CODIGO DANE",
        "IED",
        "LOCALIDAD",
        "CORREO ELECTRONICO",
        "INCENTIVO AL QUE SE PRESENTA",
        "DATOS CONTACTO",
        "RECTOR",
        "NOMBRES RESPONSABLES",
        "NUMERO ESTUDIANTES IED",
        "NUMERO DOCENTES IED",
        "NUMERO NODO",
        "IED QUE PARTICIPAN EN NODO",
        "IED DESIGNADA",
        "PERSONA RESPONSABLE",
        "CORREO RESPONSABLE",
        "TELEFONO RESPONSABLE",
        "TITULO EXPERIENCIA",
        "TEMATICA EXPERIENCIA",
        "OTRA TEMATICA",
        "CRITERIO PARTICIPACION 1",
        "CRITERIO PARTICIPACION 2",
        "CRITERIO PARTICIPACION 3",
        "CRITERIO PARTICIPACION 4",
        "CRITERIO PARTICIPACION 5",
        "JUSTIFICACION PARTICIPACION",
        "CRITERIO INTEGRALIDAD 1",
        "CRITERIO INTEGRALIDAD 2",
        "CRITERIO INTEGRALIDAD 3",
        "CRITERIO INTEGRALIDAD 4",
        "CRITERIO MEJORAMIENTO 1",
        "CRITERIO MEJORAMIENTO 2",
        "JUSTIFICACION MEJORAMIENTO",
        "CRITERIO OPORTUNIDAD 1",
        "CRITERIO OPORTUNIDAD 2",
        "JUSTIFICACION OPORTUNIAD",
        "CRITERIO RECONOCIMIENTO 1",
        "CRITERIO RECONOCIMIENTO 2",
        "CRITERIO RECONOCIMIENTO 3",
        "JUSTIFICACIOM RECONOCIMIENTO",
        "CRITERIO ADECUACION 1",
        "CRITERIO ADECUACION 2",
        "CRITERIO ADECUACION 3",
        "JUSTIFICACION ADECUACION",
        "CRITERIO SEGUIMIENTO 1",
        "CRITERIO SEGUIMIENTO 2",
        "JUSTIFICACION SEGUIMIENTO",
        "CRITERIO RETROALIMENTACION 1",
        "CRITERIO RETROALIMENTACION 2",
        "CRITERIO RETROALIMENTACION 3",
        "JUSTIFICACION RETROALIMENTACION",
        "CRITERIO PARTICIPACION RED DE BUENAS PRACTICAS",
        "DESCRIPCION PARTICIPACION",
        "CRITERIO SOCIALIZACION",
        "DESCRIPCION SOCIALIZACION",
        "CRITERIO ACTUALIZACION",
        "DESCRIPCION ACTUALIZACION",
        "PUNTAJE TOTAL EVALUACION",
        "PUNTOS FUERTES POSTULACION",
        "POTENCIAL IMPLEMENTACION",
        "PUNTOS DEBILES POSTULACION",
        "IMPACTO EN EJECUCION",
        "ELEMENTOS INNOVADORES",
        "JUSTIFICACION ELEMENTOS INNOVADORES",
        "COHERENCIA POSTULACIÓN VISITA",
        "JUSTIFICACION COHERENCIA POSTULACION VISITA",
        "COMPETENCIA EQUIPO",
        "JUSTIFICACION COMPETENCIA EQUIPO",
        "ESTANDARES DE CALIDAD",
        "JUSTIFICACION ESTANDARES DE CALIDAD",
        "IMPACTO EN LA COMUNIDAD",
        "JUSTIFICACION IMPACTO EN LA COMUNIDAD",
        "RECIBE RECONOCIMIENTO",
        "JUSTIFICACION RECIBE RECONOCIMIENTO",
        "PUNTAJE TOTAL VISITA",
        "EVALUADOR",
        "RUTA ARCHIVO",
        "RUTA ARCHIVO EVALUACION"
    ])
    const [csvData, setCsvData] = useState([])


    useEffect(() => {
        props.id.split("_")[0] === "RED"
            ? getFormRedData()
            : getFormCommonData()
    }, [])

    const getFormCommonData = async () => {
        setIEDFullData(getIEDFullData())
        let res = await API.graphql(graphqlOperation(`
            query {
                listFormsCommon(filter: {
                    madeBy: {
                        contains: "${props.id}"
                    }
                }){
                    items {
                        correoResponsable id madeBy
                        otraTematica personaResponsable
                        telefonoResponsable tematicaProyecto
                        tituloProyecto c1 c2 downloadRoute retro
                    }
                }
            }
        `))
        let data = res.data.listFormsCommon.items[0]
        console.log(data)
        if (data) {
            setRenderOption("common")
            setLocalForm({
                ...localForm,
                common: {
                    id: data.id,
                    correoResponsable: data.correoResponsable,
                    downloadRoute: data.downloadRoute,
                    otraTematica: data.otraTematica,
                    personaResponsable: data.personaResponsable,
                    telefonoResponsable: data.telefonoResponsable,
                    tematicaProyecto: data.tematicaProyecto,
                    tituloProyecto: data.tituloProyecto,
                    retro: data.retro,
                    madeBy: data.madeBy,
                    c1: data.c1
                }
            })
            console.log("data -> ", data)
            setChecked(data.retro)
        } else {
            setRenderOption("common")
        }
    }

    const getFormRedData = async () => {
        setIEDFullData(getIEDFullData())
        let res = await API.graphql(graphqlOperation(`
            query {
                listFormsRed(filter: {
                    madeBy: {
                        contains: "${props.id}"
                    }
                }){
                    items {
                        correoResponsable iedDesignada
                        iedNodo id numeroNodo
                        otraTematica personaResponsable
                        telefonoResponsable tematicaProyecto
                        tituloProyecto c1 c2 downloadRoute retro
                    }
                }
            }
        `))
        let data = res.data.listFormsRed.items[0]
        if (data) {
            setRenderOption("red")
            setLocalForm({
                ...localForm,
                red: {
                    id: data.id,
                    iedDesignada: data.iedDesignada,
                    iedNodo: data.iedNodo,
                    numeroNodo: data.numeroNodo,
                    correoResponsable: data.correoResponsable,
                    downloadRoute: data.downloadRoute,
                    otraTematica: data.otraTematica,
                    personaResponsable: data.personaResponsable,
                    telefonoResponsable: data.telefonoResponsable,
                    tematicaProyecto: data.tematicaProyecto,
                    tituloProyecto: data.tituloProyecto,
                    retro: data.retro,
                    c1: data.c1
                }
            })
            setChecked(data.retro)
        } else {
            setRenderOption("red")
        }
    }

    const getIEDFullData = async () => {
        let request = await API.graphql(graphqlOperation(queries.getUser, { id: props.id }))
            .then(res => setIEDFullData(res.data.getUser))
        try {
            Storage.get(props.id)
                .then(res => setMainLink(res))
            Storage.get(props.id + "_" + "ANEXOS")
                .then(res => setAnexLink(res))
        } catch (error) { console.log(error) }
    }

    const update = async option => {
        option === "red" ?
            await API.graphql(graphqlOperation(`
                mutation {
                    retroRed(id: "${localForm.red.id}", retro: ${checked})
                        { id retro }
                }
            `))
            :
            await API.graphql(graphqlOperation(`
                mutation {
                    retroCommon(id: "${localForm.common.id}", retro: ${checked}) 
                        { id retro }
                }
        `))
        await props.back()
    }

    const GenerateCSV = () => {
        const { codane, localidad, incentivo, nombreie } = iedFullData
        if (props.id.split("_")[0] !== "RED") {
            let data = [
                csvHeaders,
                [
                    codane,
                    nombreie,
                    localidad,
                    "N.A",
                    incentivo,
                    "", "", "", "", "", "", "", "",
                    localForm.common.personaResponsable,
                    localForm.common.correoResponsable,
                    localForm.common.telefonoResponsable,
                    localForm.common.tituloProyecto,
                    localForm.common.tematicaProyecto,
                    localForm.common.otraTematica,
                ]
            ]
            setCsvData(data)
        } else {
            let data = [
                csvHeaders,
                [
                    codane,
                    nombreie,
                    localidad,
                    "N.A",
                    incentivo,
                    "", "", "", "", "",
                    localForm.red.numeroNodo,
                    localForm.red.iedNodo,
                    localForm.red.iedDesignada,
                    localForm.red.personaResponsable,
                    localForm.red.correoResponsable,
                    localForm.red.telefonoResponsable,
                    localForm.red.tituloProyecto,
                    localForm.red.tematicaProyecto,
                    localForm.red.otraTematica,
                ]
            ]
            setCsvData(data)
        }
    }

    return (
        localrenderOption === "" ?
            <div className="table-loading-container">
                <Icon type="sync" spin />
            </div>
            : localrenderOption === "red" ?
                <div className='main-detail-container'>
                    <div className="full-info-container-red">
                        <section className="ied-info-continer">
                            <h4>Información General</h4> <br /><br />
                            <p>IED: </p>
                            <p>{iedFullData.nombreie}</p>

                            <p>Usuario: </p>
                            <p>{localForm.common.madeBy}</p>

                            <p>Localidad: </p>
                            <p>{iedFullData.localidad}</p>

                            <p>Incentivo al que se aplica: </p>
                            <p>{iedFullData.incentivo}</p>
                            <br /><br /><br />
                            {
                                localForm.red.c1 ?
                                    <p>Enviado para Retroalimentación </p>
                                    :
                                    <p>Enviado para Evaluación </p>
                            }

                            {/* {
                                        !csvData.length ?
                                            <Button style={{ marginTop: '2em' }} type="primary" onClick={GenerateCSV}>Generar CSV</Button>
                                            :
                                            <CSVLink style={{ marginTop: '2em' }} data={csvData}>Descargar CSV</CSVLink>
                                    } */}
                        </section>

                        <section className="info-container-red">
                            <h4>Formulario</h4> <br />
                            <p className=" item item1"> Número de nodo: </p>
                            <p className=" item item2">{localForm.red.numeroNodo}</p>

                            <p className=" item item3"> IED que participan en el nodo: </p>
                            <p className=" item item4">{localForm.red.iedNodo}</p>

                            <p className=" item item5"> IED Designada: </p>
                            <p className=" item item6">{localForm.red.iedDesignada}</p>

                            <p className=" item item7"> Persona Responsable: </p>
                            <p className=" item item8">{localForm.red.personaResponsable}</p>

                            <p className=" item item9"> Correo Responsable: </p>
                            <p className=" item item10">{localForm.red.correoResponsable}</p>

                            <p className=" item item11"> Teléfono del Responsable: </p>
                            <p className=" item item12">{localForm.red.telefonoResponsable}</p>

                            <p className=" item item13"> Título del proyecto: </p>
                            <p className=" item item14">{localForm.red.tituloProyecto}</p>

                            <p className=" item item15"> Temática del proyecto: </p>
                            <p className=" item item16">{localForm.red.tematicaProyecto}</p>

                            <p className=" item item17"> Otra Temática: </p>
                            <p className=" item item18">{localForm.red.otraTematica || "---"}</p>

                        </section>

                        <section className="options-container">
                            <h4>Documentos y Opciones</h4> <br />

                            {/* <Button onClick={() => console.log()}>Check</Button> */}
                            <p style={{ marginTop: "1em" }}>Planilla: </p>
                            <a href={mainLink} target="_blank"> {iedFullData.referencia} </a>

                            <p style={{ marginTop: "2em" }}>Anexos: </p>
                            {
                                localForm.red.downloadRoute !== " " ?
                                    <a href={anexLink} target="_blank"> {localForm.red.downloadRoute} </a>
                                    :
                                    <a> ---------- </a>
                            }

                            {
                                props.renderOption === "eval" ?
                                    <div className="final-options-container">
                                        <Checkbox className="final-check" checked={checked} onChange={e => setChecked(e.target.checked)} >
                                            <i>Retroalimentado</i>
                                        </Checkbox>

                                        <Button onClick={() => update("common")} className="final-btn"> Guardar </Button>
                                    </div>
                                    : <div></div>
                            }
                        </section>
                    </div>
                </div>
                :
                <div className="full-info-container">
                    <section className="ied-info-continer">
                        <h4>Información General</h4> <br /><br />
                        <p>IED: </p>
                        <p>{iedFullData.nombreie}</p>

                        <p>Usuario: </p>
                        <p>{localForm.common.madeBy}</p>

                        <p>Localidad: </p>
                        <p>{iedFullData.localidad}</p>

                        <p>Incentivo al que se aplica: </p>
                        <p>{iedFullData.incentivo}</p>
                        <br /><br /><br />
                        {
                            localForm.common.c1 ?
                                <p>Enviado para Retroalimentación </p>
                                :
                                <p>Enviado para Evaluación </p>
                        }
                        {/* {
                                !csvData.length ?
                                    <Button style={{ marginTop: '2em' }} type="primary" onClick={GenerateCSV}>Generar CSV</Button>
                                    :
                                    <CSVLink style={{ marginTop: '2em' }} data={csvData}>Descargar CSV</CSVLink>
                            } */}
                    </section>

                    <section className="info-container">
                        <h4>Formulario</h4> <br />

                        <p className=" item item7"> Persona Responsable: </p>
                        <p className=" item item8">{localForm.common.personaResponsable}</p>

                        <p className=" item item9"> Correo Responsable: </p>
                        <p className=" item item10">{localForm.common.correoResponsable}</p>

                        <p className=" item item11"> Teléfono del Responsable: </p>
                        <p className=" item item12">{localForm.common.telefonoResponsable}</p>

                        <p className=" item item13"> Título del proyecto: </p>
                        <p className=" item item14">{localForm.common.tituloProyecto}</p>

                        <p className=" item item15"> Temática del proyecto: </p>
                        <p className=" item item16">{localForm.common.tematicaProyecto}</p>

                        <p className=" item item17"> Otra Temática: </p>
                        <p className=" item item18">{localForm.common.otraTematica || "---"}</p>

                        <div></div>
                    </section>

                    <section className="options-container">
                        <h4>Documentos y Opciones</h4> <br />

                        {/* <Button onClick={() => console.log()}>Check</Button> */}
                        <p style={{ marginTop: "1em" }}>Planilla: </p>
                        <a href={mainLink} target="_blank"> {iedFullData.referencia} </a>

                        <p style={{ marginTop: "2em" }}>Anexos: </p>
                        {
                            localForm.common.downloadRoute !== " " ?
                                <a href={anexLink} target="_blank"> {localForm.common.downloadRoute} </a>
                                :
                                <a> ---------- </a>
                        }

                        {
                            props.renderOption === "eval" ?
                                <div className="final-options-container">
                                    <Checkbox className="final-check" checked={checked} onChange={e => setChecked(e.target.checked)} >
                                        <i>Retroalimentado</i>
                                    </Checkbox>

                                    <Button onClick={() => update("common")} className="final-btn"> Guardar </Button>
                                </div>
                                : <div></div>
                        }
                    </section>
                </div>

    )
}

export default DetailedView