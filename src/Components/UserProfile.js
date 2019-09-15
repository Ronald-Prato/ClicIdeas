import React, { useState, useEffect, useContext } from 'react'
import Context from '../GlobalState/context'
import '../Styles/UserProfile.css'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import * as queries from '../graphql/queries'
import { Button, Input } from 'antd'
import { withRouter } from 'react-router-dom'


const UserProfile = props => {

    const { state, actions } = useContext(Context)
    const [localRequest, setLocalRequest] = useState([])
    const [show, setShow] = useState(false)
    const [details, showDetails] = useState(false)
    const [localData, setLocalData] = useState({})

    useEffect(() => {
        checkCurrentSession()
    }, [])

    const checkCurrentSession = async () => {
        try {
            let currentUser = await Auth.currentAuthenticatedUser()
            let userData = await API.graphql(graphqlOperation(queries.getUser, { id: currentUser.username }))
            let userObj = userData.data.getUser;
            userObj.id.split("_")[0] !== "RED"
                ? getUserRequestCommon(userObj.id)
                : getUserRequestRed(userObj.id)
            await actions({
                type: "setState",
                payload: {
                    ...state,
                    userData: {
                        username: userObj.id,
                        codane: userObj.codane,
                        localidad: userObj.localidad,
                        nombreie: userObj.nombreie,
                        incentivo: userObj.incentivo,
                        referencia: userObj.referencia
                    }
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const getUserRequestCommon = async u => {
        try {
            let req = await API.graphql(graphqlOperation(`
                query {
                    listFormsCommon(filter: {
                        madeBy: {
                        contains: "${u}"
                        }
                    }){
                        items {
                            correoResponsable
                            downloadRoute
                            otraTematica
                            personaResponsable
                            telefonoResponsable
                            tematicaProyecto
                            tituloProyecto
                            madeBy
                        }
                    }
                }
            `))
            await setLocalRequest(req.data.listFormsCommon.items)
            await setShow(true)
        } catch (error) {
            console.log(error)
        }
    }

    const getUserRequestRed = async u => {
        try {
            let req = await API.graphql(graphqlOperation(`
                query {
                    listFormsRed(filter: {
                        madeBy: {
                        contains: "${u}"
                        }
                    }){
                        items {
                            iedDesignada
                            iedNodo
                            numeroNodo
                            correoResponsable
                            downloadRoute
                            otraTematica
                            personaResponsable
                            telefonoResponsable
                            tematicaProyecto
                            tituloProyecto
                            madeBy
                        }
                    }
                }
            `))
            await setLocalRequest(req.data.listFormsRed.items)
            await setShow(true)
        } catch (error) {
            console.log(error)
        }
    }

    const LogOut = async () => {
        await Auth.signOut()
        await props.history.push('/')
    }

    return (
        !details ?
            <div className='user-profile-container'>
                <Button style={{ position: "absolute", right: "1%", top: "2%" }} type="primary" onClick={LogOut} >Salir</Button>
                <div className="info-box-user">
                    <p style={{ color: "steelblue" }}> Usuario: </p>
                    <p>{state.userData.username}</p><br /><br />
                    <p style={{ color: "steelblue" }}> IED: </p>
                    <p>{state.userData.nombreie}</p><br /><br />
                    <p style={{ color: "steelblue" }}> Localidad </p>
                    <p>{state.userData.localidad}</p><br /><br />
                    <p style={{ color: "steelblue" }}> Incentivo al que se presenta </p>
                    <p>{state.userData.incentivo}</p>
                </div>

                <div className="user-solicitudes">
                    <h2>Solicitudes Tramitadas</h2>
                    {
                        localRequest.map((x, i) =>
                            <div onClick={() => console.log()/*showDetails(true)*/} key={i} className="request-box">
                                <p> {x.tituloProyecto} </p>
                                <p> {x.tematicaProyecto} </p>
                                <p> {x.correoResponsable} </p>
                            </div>
                        )
                    }
                </div>
            </div>
            : console.log()
        // <div className="user-profile-container">
        //     <Button style={{ position: "absolute", right: "1%", top: "2%" }} type="primary" onClick={LogOut} >Salir</Button>
        //     <div className="info-box-user">
        //         <p style={{ color: "steelblue" }}> Usuario: </p>
        //         <p>{state.userData.username}</p><br /><br />
        //         <p style={{ color: "steelblue" }}> IED: </p>
        //         <p>{state.userData.nombreie}</p><br /><br />
        //         <p style={{ color: "steelblue" }}> Localidad </p>
        //         <p>{state.userData.localidad}</p><br /><br />
        //         <p style={{ color: "steelblue" }}> Incentivo al que se presenta </p>
        //         <p>{state.userData.incentivo}</p>
        //     </div>

        //     <div className="formred-box">
        //         <p className="nodo-title"> * Número del Nodo </p>
        //         <Input value={localRequest[0].nodo} onChange={e => setFields({ ...fields, nodo: e.target.value })} className="nodo-input" />

        //         <p className="iednodo-title-red"> * IED Que participan en el nodo </p>
        //         <Input value={localRequest[0].iedNodo} onChange={e => setFields({ ...fields, iedNodo: e.target.value })} className="iednodo-input-red" />

        //         <p className="ied-designada-title-red"> * IED Designada </p>
        //         <Input value={localRequest[0].iedDesignada} onChange={e => setFields({ ...fields, iedDesignada: e.target.value })} className="ied-designada-input-red" />

        //         <p className="persona-responsable-title-red"> * Persona Responsable </p>
        //         <Input value={localRequest[0].personaResponsable} onChange={e => setFields({ ...fields, personaResponsable: e.target.value })} className="persona-responsable-input-red" />

        //         <p className="correo-responsable-title-red"> * Correo Responsable </p>
        //         <Input value={localRequest[0].correoResponsable} onChange={e => setFields({ ...fields, correoResponsable: e.target.value })} className="correo-responsable-input-red" />

        //         <p className="tel-responsable-title-red"> * Teléfono Responsable </p>
        //         <Input value={localRequest[0].telfResponsable} onChange={e => setFields({ ...fields, telfResponsable: e.target.value })} className="tel-responsable-input-red" />

        //         <p className="titulo-proyecto-title-red"> * Título del Proyecto </p>
        //         <Input value={localRequest[0].tituloProyecto} onChange={e => setFields({ ...fields, tituloProyecto: e.target.value })} className="titulo-proyecto-input-red" />

        //         <p className="tematica-proyecto-title-red"> * Temática del Proyecto </p>
        //         <Dropdown className="tematica-proyecto-input-red" overlay={menu} trigger={['click']}>
        //             <a className="ant-dropdown-link-red" href="#">
        //                 {
        //                     !fields.tematicaProyecto ? "Seleccione Temática" : fields.tematicaProyecto
        //                 }
        //                 <Icon type="down" />
        //             </a>
        //         </Dropdown>,
        //     {/* <Input onChange={e => setFields({ ...fields, tematicaProyecto: e.target.value })} className="" /> */}

        //         <p className="otra-tematica-title-red"> Otra Temática </p>
        //         <Input disabled={fields.tematicaProyecto === "Otra" ? false : true} value={otraTematica} onChange={e => setOtraTematica(e.target.value)} className="otra-tematica-input-red" />

        //         <p className="plantilla-title-red"> * Cargue la plantilla de postulación diligenciada </p>
        //         <div className="plantilla-input-red">
        //             <FilePond
        //                 labelIdle='Arrastra los archivos que desees o dale click acá para buscar'
        //                 allowMultiple={false}
        //                 files={file.fileC}
        //                 maxFiles={1}
        //                 onupdatefiles={e => {
        //                     let name = "", type = "", file = []
        //                     setFile({
        //                         ...file, fileC: e.map(single_file => {
        //                             name = single_file.filename
        //                             type = single_file.fileType
        //                             return single_file.file
        //                         }), filename: name, filetype: type
        //                     })


        //                 }}
        //             />
        //         </div>

        //         <div className="send-btn-container-red">
        //             <Button onClick={validateBeforeSend} >Enviar Postulación para Evaluación </Button>
        //         </div>
        //     </div>
        // </div >
    )
}

export default withRouter(UserProfile)