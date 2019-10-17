import React, { useState, useEffect, useContext } from 'react'
import Context from '../GlobalState/context'
import { Auth, graphqlOperation, Storage, API } from 'aws-amplify'
import { Button } from 'antd'
import '../Styles/Eval.css'
// import { onCreateFormCommon } from '../graphql/subscriptions'
import { withRouter } from 'react-router-dom'
import { Table, Icon } from 'antd'

import DetailedView from './DetailedView'




const Eval = props => {

    const { state, actions } = useContext(Context)
    const [show, setShow] = useState(false)
    const [finalResults, setFinalResults] = useState([])
    const [detailedView, setDetailedView] = useState({ id: "", show: false })


    useEffect(() => {
        getCustomData()
    }, [])


    const getCustomData = async () => {
        let currentUser = await Auth.currentAuthenticatedUser()
        let response = await API.graphql(graphqlOperation(`
            query {
                getUser(id:"${currentUser.username}") {
                    name evaluated
                }
            }
        `))
        let evalObj = response.data.getUser
        actions({
            type: "setState",
            payload: {
                evalData: { ...state, evaluated: evalObj.evaluated, name: evalObj.name }
            }
        })
        printTable(evalObj.evaluated)
    }

    const printTable = ids => {
        let singleIED = []
        ids.map(async (ied, i) => {
            await API.graphql(graphqlOperation(`
                    query {
                        getUser(id: "${ied}"){ id referencia nombreie codane localidad incentivo link visita }
                    }
                `)).then(res => {
                singleIED.push(res.data.getUser)
            })
                .then(res => setFinalResults(singleIED.map(x => x)))
        })
    }

    const CheckDetails = id => {
        setDetailedView({ show: true, id: id })
    }

    const BackIn = () => setDetailedView({ ...detailedView, show: false })

    const LogOut = async () => {
        await Auth.signOut()
        await props.history.push('/')
    }


    return (

        <div className='eval-container'>
            <Button style={{ position: "absolute", right: "2%", top: "2%" }} type="primary" onClick={LogOut} >Salir</Button>
            <div className="form-logo-container">
                <img className="img-logo" src={require('../Assets/cliclogo.png')} alt="" />
                <img className="img-logo2" src={require('../Assets/alcaldialogo.png')} alt="" />
                <img className="img-logo3" src={require('../Assets/unal.png')} alt="" />
            </div>
            {
                detailedView.show ? <Button style={{ position: "absolute", right: "10%", top: "2%" }} type="primary" onClick={BackIn} >Volver</Button> : console.log()
            }
            {
                !detailedView.show ?
                    <div>
                        <section className="eval-name-container">
                            <h4> <a>Evaluador:</a>  {state.evalData.name} </h4>
                        </section>

                        <div className="evaluations-box">
                            {/* <Button onClick={() => console.log(finalResults)}> Check evaluated </Button> */}
                            {
                                finalResults.length
                                    ? <div className='table-container'>
                                        <div className="table-header">
                                            <p>Nombre de la institución</p>
                                            <p>Código IED</p>
                                            <p>Localidad</p>
                                            <p>Incentivo</p>
                                            <p className="state">Postulación</p>
                                        </div>
                                        {
                                            finalResults.map((res, i) =>
                                                res.id.split("_")[0] !== "EEX" && res.id.split("_")[0] !== "MEF" ?
                                                    <div key={i} className="single-row">
                                                        <p>{res.nombreie}</p>
                                                        <p>{res.codane}</p>
                                                        <p>{res.localidad}</p>
                                                        <p>{res.incentivo}</p>
                                                        {
                                                            res.referencia === "nula" ?
                                                                <p className="state">No</p>
                                                                :
                                                                <div className="option-panel">
                                                                    <p style={{ cursor: 'pointer' }} className="resalter state" onClick={() => CheckDetails(res.id)}>Consultar</p>
                                                                    <p style={{ cursor: 'pointer' }} className="resalter state"> <a href={res.link} target="_blank" >Evaluar</a> </p>
                                                                </div>
                                                        }
                                                    </div>
                                                    :
                                                    <div key={i} className="single-row">
                                                        <p>{res.nombreie}</p>
                                                        <p>{res.codane}</p>
                                                        <p>{res.localidad}</p>
                                                        <p>{res.incentivo}</p>
                                                        {
                                                            res.referencia === "nula" ?
                                                                <p className="state">No</p>
                                                                :
                                                                <div className="option-panel">
                                                                    <p style={{ cursor: 'pointer' }} className="resalter state" onClick={() => CheckDetails(res.id)}>Consultar</p>
                                                                    <p style={{ cursor: 'pointer' }} className="resalter state"> <a href={res.link} target="_blank" >Evaluar</a> </p>
                                                                    <p style={{ cursor: 'pointer' }} className="resalter state"> <a href={res.visita} target="_blank" >Visita</a> </p>
                                                                </div>
                                                        }
                                                    </div>
                                            )
                                        }
                                    </div>

                                    : <div className="table-loading-container">
                                        <Icon type="loading" />
                                    </div>
                            }
                        </div>
                    </div>
                    :
                    <DetailedView back={BackIn} id={detailedView.id} renderOption={"eval"} />
            }
        </div>
    )
}

export default withRouter(Eval)