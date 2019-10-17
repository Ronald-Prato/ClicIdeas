import React, { useState, useEffect, useContext } from 'react'
import Context from '../GlobalState/context'
import '../Styles/Admin.css'
import { withRouter } from 'react-router-dom'
import { Button, Input, Icon } from 'antd'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import * as queries from '../graphql/queries'
import DetailedView from './DetailedView'
import { CSVLink } from "react-csv";



const Admin = props => {

    const { state, actions } = useContext(Context)
    const [evaluators, setEvaluators] = useState([])
    const [evaluatorSearch, setEvaluatorSearch] = useState("")
    const [singlEvaluatorSearch, setSingleEvaluatorSearch] = useState("")
    const [singleEvaluator, setSingleEvaluator] = useState({})
    const [singleEvaluatorIEDs, setSingleEvaluatorIEDs] = useState([])
    const [viewDetails, setViewDetails] = useState(false)
    const [detailedId, setDetailedId] = useState("")
    const [csvHeaders, setCsvHeaders] = useState([
        "CODIGO DANE",
        "IED",
        "LOCALIDAD",
        "INCENTIVO AL QUE SE PRESENTA",
        "NUMERO NODO",
        "IED QUE PARTICIPAN EN NODO",
        "IED DESIGNADA",
        "PERSONA RESPONSABLE",
        "CORREO RESPONSABLE",
        "TELEFONO RESPONSABLE",
        "TITULO EXPERIENCIA",
        "TEMATICA EXPERIENCIA",
        "OTRA TEMATICA",
        "ENVIADO PARA RETROALIMENTACION DEL EXPERTO",
        "ENVIADO PARA EVALUACION",
        "RETROALIMENTADO",
        "EVALUADOR",
        "ARCHIVO POSTULACION",
        "ANEXO POSTULACION"
    ])
    const [GeneralCSVDownload, ShowGeneralCSVDownload] = useState(0)
    const [FinalCSVData, setFinalCSVData] = useState([])
    const { Search } = Input;

    useEffect(() => {
        GetAllUsers()
    }, [])

    const GetAllUsers = async () => {
        try {
            let allEvaluators = await API.graphql(graphqlOperation(`
                query {
                    listUsers(filter:{
                        id: {
                        contains: "EV"
                        }
                    }) {
                        items {
                        id name evaluated
                        }
                    }
                }
            `))
            console.log(allEvaluators)
            setEvaluators(allEvaluators.data.listUsers.items)
        } catch (res) {
            console.log(res)
        }
    }

    const RenderSingleEvaluator = async evaluator => {
        setSingleEvaluator(evaluator)
        console.log(evaluator)
        let users = []
        evaluator.evaluated.map(async x => {
            await API.graphql(graphqlOperation(queries.getUser, { id: x }))
                .then(res => users.push(res.data.getUser))
                .then(() => setSingleEvaluatorIEDs(users.map(x => x)))
        })
    }

    const GenerateAllCsv = async () => {
        ShowGeneralCSVDownload(1)
        let formsCommon = [], usersCommon = [], usersRed = [], formsRed = [], indexes = [], evaluators = [], indexesRed = [],
            singleEval = [], singleEvalRed = []
        let finalData = [
            csvHeaders
        ]

        await API.graphql(graphqlOperation(`
            {
                listUsers(filter: {
                    id: {
                        contains: "EV"
                    }
                }){
                    items { 
                        id evaluated
                    }
                }
            }
        `)).then(res => {
            console.log("Evaluators: ", res.data.listUsers.items)
            evaluators = res.data.listUsers.items
        })

        await API.graphql(graphqlOperation(`
            {
                listUsers(filter: {
                    id: {
                        notContains: "EV"
                    }
                    referencia: {
                        notContains: "nula"
                    }
                }){
                    items {
                        id codane nombreie localidad incentivo referencia
                    }
                }
            }
        `))
            .then(res => {
                // console.log(res.data.listUsers.items)
                usersCommon = res.data.listUsers.items.filter(x => x.id.split("_")[0] !== "RED")
                usersRed = res.data.listUsers.items.filter(x => x.id.split("_")[0] === "RED")

                usersCommon.map(async (user, index) => {
                    await API.graphql(graphqlOperation(`
                {
                    listFormsCommon(filter: {
                        madeBy: {
                            contains: "${user.id}"
                        }
                    }){ items {
                        personaResponsable 
                        correoResponsable 
                        telefonoResponsable 
                        tituloProyecto 
                        tematicaProyecto 
                        otraTematica
                        c1 c2 retro
                        downloadRoute
                        madeBy
                    }}
                }
            `)).then(res => {
                        if (res.data.listFormsCommon.items.length > 0) {
                            indexes.push(index)
                            formsCommon.push(res.data.listFormsCommon.items[0])
                            for (let i = 0; i < evaluators.length; i++) {
                                if (evaluators[i].evaluated.includes(user.id)) {
                                    singleEval.push(evaluators[i].id)
                                    break
                                }
                            }
                        }
                    })
                })


                usersRed.map(async (user, index) => {
                    await API.graphql(graphqlOperation(`
                {
                    listFormsRed(filter: {
                        madeBy: {
                            contains: "${user.id}"
                        }
                    }){ items {
                        iedDesignada
                        iedNodo
                        numeroNodo
                        personaResponsable 
                        correoResponsable 
                        telefonoResponsable 
                        tituloProyecto 
                        tematicaProyecto 
                        otraTematica
                        c1 c2 retro
                        downloadRoute
                        madeBy
                    }}
                }
            `)).then(res => {
                        if (res.data.listFormsRed.items.length > 0) {
                            indexesRed.push(index)
                            formsRed.push(res.data.listFormsRed.items[0])
                            for (let i = 0; i < evaluators.length; i++) {
                                if (evaluators[i].evaluated.includes(user.id)) {
                                    singleEvalRed.push(evaluators[i].id)
                                    break
                                }
                            }
                        }

                    })
                })

            })











        setTimeout(() => {
            indexes.map((x, i) => {
                finalData.push([
                    usersCommon[x].codane,
                    usersCommon[x].nombreie,
                    usersCommon[x].localidad,
                    usersCommon[x].incentivo,
                    "", "", "",
                    formsCommon[i].personaResponsable,
                    formsCommon[i].correoResponsable,
                    formsCommon[i].telefonoResponsable,
                    formsCommon[i].tituloProyecto,
                    formsCommon[i].tematicaProyecto,
                    formsCommon[i].otraTematica,
                    formsCommon[i].c1 ? "X" : " ",
                    formsCommon[i].c2 ? "X" : " ",
                    formsCommon[i].retro ? "X" : " ",
                    singleEval[i],
                    usersCommon[x].referencia,
                    formsCommon[i].downloadRoute
                ])
            })
            indexesRed.map((x, i) => {
                finalData.push([
                    usersRed[x].codane,
                    usersRed[x].nombreie,
                    usersRed[x].localidad,
                    usersRed[x].incentivo,
                    formsRed[i].numeroNodo,
                    formsRed[i].iedNodo,
                    formsRed[i].iedDesignada,
                    formsRed[i].personaResponsable,
                    formsRed[i].correoResponsable,
                    formsRed[i].telefonoResponsable,
                    formsRed[i].tituloProyecto.replace(/"/g, "'"),
                    formsRed[i].tematicaProyecto,
                    formsRed[i].otraTematica,
                    formsRed[i].c1 ? "X" : " ",
                    formsRed[i].c2 ? "X" : " ",
                    formsRed[i].retro ? "X" : " ",
                    singleEvalRed[i],
                    usersRed[x].referencia,
                    formsRed[i].downloadRoute
                ])
            })
        }, 10000)
        setTimeout(() => {
            setFinalCSVData(finalData)
            ShowGeneralCSVDownload(2)
        }, 11000)
        // setTimeout(() => console.log(finalData, singleEval), 4600)
        // await API.graphql(graphqlOperation(`
        //     {

        //     }
        // `))
    }

    const CheckDetails = id => {
        setDetailedId(id)
        setViewDetails(true)
    }

    const LogOut = async () => {
        await Auth.signOut()
        await props.history.push('/')
    }

    const BackIn = () => {
        setViewDetails(false)
    }

    return (

        <div className='admin-main-container'>

            {
                !viewDetails ?
                    <div>
                        <Button style={{ position: "absolute", right: "2%", top: "2%" }} type="primary" onClick={LogOut} >Salir</Button>
                        {
                            GeneralCSVDownload === 0 ?
                                <Button style={{ position: "absolute", right: "10%", top: "2%" }} onClick={GenerateAllCsv} > Generar CSV General </Button>
                                : GeneralCSVDownload === 1 ?
                                    <div className="icon-setter-container"> <Icon className="loading-icon-admin" type="sync" spin /> <p>Generando...</p> </div>
                                    : GeneralCSVDownload === 2 ?
                                        <CSVLink style={{ position: "absolute", right: "10%", top: "3%" }} data={FinalCSVData}>Descargar CSV</CSVLink> :
                                        console.log()
                        }
                    </div>
                    :
                    <div>
                        <Button style={{ position: "absolute", right: "2%", top: "2%" }} type="primary" onClick={LogOut} >Salir</Button>
                        <Button style={{ position: "absolute", right: "10%", top: "2%" }} type="primary" onClick={BackIn} >Volver</Button>
                    </div>
            }

            <div className="form-logo-container">
                <img className="img-logo" src={require('../Assets/cliclogo.png')} alt="" />
                <img className="img-logo2" src={require('../Assets/alcaldialogo.png')} alt="" />
                <img className="img-logo3" src={require('../Assets/unal.png')} alt="" />
            </div>
            {
                !viewDetails ?
                    <div className="box-data-container">
                        <section className="evaluators-container">

                            <Search
                                placeholder="Buscar un usuario"
                                onChange={e => setEvaluatorSearch(e.target.value)}
                            />

                            <div className="evaluators-header">
                                <p>Nombre</p>
                            </div>


                            <div className="evaluators-data">
                                {
                                    !evaluatorSearch ?
                                        evaluators.map((evaluator, i) =>
                                            <div onClick={() => RenderSingleEvaluator(evaluator)} key={i} className="single-evaluator">
                                                <p>{evaluator.name}</p>
                                            </div>
                                        )
                                        :
                                        evaluators.filter(x => x.name.toLowerCase().includes(evaluatorSearch.toLocaleLowerCase())).map((evaluator, i) =>
                                            <div onClick={() => RenderSingleEvaluator(evaluator)} key={i} className="single-evaluator">
                                                <p>{evaluator.name}</p>
                                            </div>
                                        )
                                }
                            </div>
                        </section>

                        <section className="single-evaluator-data">
                            <Search
                                placeholder="Buscar un IED específico"
                                onChange={e => setSingleEvaluatorSearch(e.target.value)}
                                className="single-evaluator-search"
                            />
                            <p > Evaluador:  <a className="single-evaluator-name">{singleEvaluator.name}</a> </p>

                            {/* <Button type="primary" onClick={() => console.log(singleEvaluatorIEDs)} >Check</Button> */}

                            <section className="evaluators-ieds-headers">
                                <p> Código </p>
                                <p> Nombre IED </p>
                                <p> Postulación </p>
                            </section>

                            <section className="evaluators-ieds-data">
                                {
                                    !singlEvaluatorSearch ?
                                        singleEvaluatorIEDs.map(evaluator =>
                                            <div className="single-evaluator-ieds">
                                                <p> {evaluator.id} </p>
                                                <p> {evaluator.nombreie} </p>
                                                {
                                                    evaluator.referencia !== "nula" ?
                                                        <a onClick={() => CheckDetails(evaluator.id)}> Consultar </a>
                                                        :
                                                        <p> No </p>
                                                }
                                            </div>
                                        )
                                        :
                                        singleEvaluatorIEDs.filter(x => x.nombreie.toLowerCase().includes(singlEvaluatorSearch.toLowerCase())).map(evaluator =>
                                            <div className="single-evaluator-ieds">
                                                <p> {evaluator.id} </p>
                                                <p> {evaluator.nombreie} </p>
                                                {
                                                    evaluator.referencia !== "nula" ?
                                                        <a> Consultar </a>
                                                        :
                                                        <p> No </p>
                                                }
                                            </div>
                                        )
                                }
                            </section>
                        </section>

                    </div>
                    :
                    <DetailedView back={BackIn} id={detailedId} renderOption={"admin"} />
            }

        </div>


    )
}

export default withRouter(Admin)