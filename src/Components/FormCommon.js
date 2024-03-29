import React, { useState, useEffect, useContext } from 'react'
import Context from '../GlobalState/context'
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify'
import { FilePond } from 'react-filepond';
import { Button, Input, Menu, Dropdown, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import '../Styles/FormCommon.css'
import * as mutation from '../graphql/mutations'
import * as queries from '../graphql/queries'
import { Checkbox } from 'antd';
import Swal from 'sweetalert2'



const FormCommon = props => {

    const { state, actions } = useContext(Context)
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [checkInputs, setCheckInputs] = useState({ c1: false, c2: false })
    const [upload, setUpload] = useState({ show: true, link: "" })
    const [anx, setAnx] = useState({ name: "", link: "" })
    const [otraTematica, setOtraTematica] = useState("")
    const [file, setFile] = useState({ fileC: [], filename: "", filatype: "" })
    const [file2, setFile2] = useState({ fileC2: [], filename2: "", filetype2: "" })
    const [currentRequestID, setCurrentRequestID] = useState("")
    const [reviewed, setReviewed] = useState(false)
    const [l1, setL1] = useState("")
    const [l2, setL2] = useState("")
    const [l3, setL3] = useState("")
    const [fields, setFields] = useState({
        personaResponsable: "", correoResponsable: "", telfResponsable: "",
        tituloProyecto: "", tematicaProyecto: ""
    })
    const menu = (
        <Menu>
            <Menu.Item onClick={() => setFields({ ...fields, tematicaProyecto: "Convivencia" })} key="0"> 1. Convivencia </Menu.Item>
            <Menu.Item onClick={() => setFields({ ...fields, tematicaProyecto: "Prácticas Pedagógicas" })} key="1"> 2. Prácticas Pedagógicas </Menu.Item>
            <Menu.Item onClick={() => setFields({ ...fields, tematicaProyecto: "Movilización" })} key="2"> 3. Movilización </Menu.Item>
            <Menu.Item onClick={() => setFields({ ...fields, tematicaProyecto: "Otra" })} key="3"> 4. Otra </Menu.Item>
        </Menu>
    );


    useEffect(() => {
        checkCurrentSession()
        getDocuments()
    }, [])

    const getDocuments = () => {
        Storage.get('doc1.pdf')
            .then(result => {
                setL1(result)
            })
        Storage.get('doc2.pdf')
            .then(result => {
                setL2(result)
            })
        Storage.get('doc3.pdf')
            .then(result => {
                setL3(result)
            })
    }

    const checkCurrentSession = async () => {
        try {
            let currentUser = await Auth.currentAuthenticatedUser()
            let userData = await API.graphql(graphqlOperation(queries.getUser, { id: currentUser.username }))
            let userObj = userData.data.getUser;
            setShowForm(true)
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
            if (userObj.referencia !== "nula") getCurrentRequestFile(userObj.id)
            let userRequest = await API.graphql(graphqlOperation(`
                    query {
                        listFormsCommon(filter: {
                            madeBy: {
                                contains: "${userObj.id}"
                            }
                        }){
                            items {
                                personaResponsable correoResponsable 
                                tematicaProyecto tituloProyecto otraTematica
                                telefonoResponsable id c1 c2 downloadRoute
                            }
                        }
                    }
                `))
            await console.log(userRequest)
            if (userRequest.data.listFormsCommon.items.length > 0) setReviewed(true)
            let response = userRequest.data.listFormsCommon.items[0]
            await setFields({
                correoResponsable: response.correoResponsable,
                personaResponsable: response.personaResponsable,
                tematicaProyecto: response.tematicaProyecto,
                tituloProyecto: response.tituloProyecto,
                telfResponsable: response.telefonoResponsable,
            })
            await setOtraTematica(response.otraTematica)
            await setCurrentRequestID(response.id)
            await setCheckInputs({ c1: response.c1, c2: response.c2 })
            await getCurrentAnexFile(response.downloadRoute, userObj.id)
        } catch (error) {
            setShowForm(true)
            console.log(error)
        }
    }

    const getCurrentAnexFile = (filename, fileroute) => {
        Storage.get(fileroute + "_" + "ANEXOS")
            .then(res => {
                setAnx({ name: filename, link: res })
            })
    }

    const validateBeforeSend = async option => {
        if (option === 'create') {
            !file.fileC || Object.values(fields).includes("")
                ? alert("Asegúrese que todos los campos esten llenos y que la planilla se ha subido correctamente")
                : checkInputs.c1 === false && checkInputs.c2 === false
                    ? alert("Debe seleccionar al menos un checkbox")
                    : emailComprobation()
                        ? sendForm()
                        : alert("El correo ingresado es inválido")
        } else if (option === 'update') {
            !file.fileC || Object.values(fields).includes("")
                ? alert("Asegúrese que todos los campos esten llenos y que la planilla se ha subido correctamente")
                : checkInputs.c1 === false && checkInputs.c2 === false
                    ? alert("Debe seleccionar al menos un checkbox")
                    : emailComprobation()
                        ? updateUserRequest()
                        : alert("El correo ingresado es inválido")

        }
    }

    const emailComprobation = () => {
        let email = fields.correoResponsable
        return email.includes("@")
            ? email.split('@')[1].includes('.') ? true : false
            : false
    }

    const sendForm = async () => {
        await setLoading(true)
        let uploadedFormCommon = await API.graphql(graphqlOperation(mutation.createFormCommon, {
            input: {
                personaResponsable: fields.personaResponsable,
                correoResponsable: fields.correoResponsable,
                telefonoResponsable: fields.telfResponsable,
                tituloProyecto: fields.tituloProyecto,
                tematicaProyecto: fields.tematicaProyecto,
                downloadRoute: file2.filename2 || " ",
                otraTematica: otraTematica || " ",
                madeBy: state.userData.username,
                c1: checkInputs.c1,
                c2: checkInputs.c2,
                retro: false
            }
        }))

        let updateReference = await API.graphql(graphqlOperation(`
            mutation {
                updateUser(id: "${state.userData.username}", input: {
                    referencia: "${file.filename}"
                }){
                    id referencia
                }
            }
        `))

        Storage.put(state.userData.username, file.fileC[0], {
            contentType: file.filetype
        })
            .then(res => {
                setLoading(false)
                showAlert()
            })
            .catch(err => { setLoading(false); console.log(err) });
        if (file2.filename2.length) {
            await Storage.put(`${state.userData.username}_ANEXOS`, file2.fileC2[0], {
                contentType: file2.filetype2
            })
                .then(res => {
                    setLoading(false)
                    setUpload({ ...upload, show: false })
                    showAlert("create")
                    checkCurrentSession()
                })
                .catch(err => { setLoading(false); console.log(err) });
        } else {
            setUpload({ ...upload, show: false })
            showAlert("create")
            checkCurrentSession()
        }
    }

    const updateUserRequest = async () => {
        await setLoading(true)
        let uploadedFormCommon = await API.graphql(graphqlOperation(`
            mutation {
                updateFormCommon(id: "${currentRequestID}", input: {
                    personaResponsable: "${fields.personaResponsable}",
                    correoResponsable: "${fields.correoResponsable}",
                    telefonoResponsable: "${fields.telfResponsable}",
                    tituloProyecto: "${fields.tituloProyecto}",
                    tematicaProyecto: "${fields.tematicaProyecto}",
                    downloadRoute: "${file2.filename2 || anx.name}",
                    otraTematica: "${otraTematica || " "}"
                    c1: ${ checkInputs.c1},
                    c2: ${ checkInputs.c2}
                }){
                    id
                    correoResponsable
                    madeBy
                    tituloProyecto
                    tematicaProyecto
                    personaResponsable
                    telefonoResponsable
                    downloadRoute c1 c2
                }
            }
        `))

        if (file.filename) {
            let updateReference = await API.graphql(graphqlOperation(`
            mutation {
                updateUser(id: "${state.userData.username}", input: {
                    referencia: "${file.filename}"
                }){
                    id referencia
                }
            }
        `))
            await console.log(updateReference)
        }


        Storage.put(state.userData.username, file.fileC[0], {
            contentType: file.filetype
        })
            .then(res => {
                setLoading(false)
                showAlert()
            })
            .catch(err => { setLoading(false); console.log(err) });
        if (file2.filename2.length) {
            await Storage.put(`${state.userData.username}_ANEXOS`, file2.fileC2[0], {
                contentType: file2.filetype2
            })
                .then(res => {
                    setLoading(false)
                    setUpload({ ...upload, show: false })
                    showAlert("update")
                    checkCurrentSession()
                })
                .catch(err => { setLoading(false); console.log(err) });
        } else {
            setUpload({ ...upload, show: false })
            showAlert("update")
            checkCurrentSession()
        }
    }

    const getCurrentRequestFile = (file) => {
        Storage.get(file)
            .then(res => {
                setUpload({ show: false, link: res })
            })
    }

    const LogOut = async () => {
        await Auth.signOut()
        await props.history.push('/')
    }

    const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000
    })

    const showAlert = option => {
        option === "create" ?
            Toast.fire({
                type: 'success',
                title: 'Postulación enviada exitosamente',
            })
            :
            Toast.fire({
                type: 'success',
                title: 'Postulación guardada exitosamente',
            })
    }


    return (
        showForm ?
            <div className='formcommon-container'>
                <div className="form-logo-container">
                    <img className="img-logo" src={require('../Assets/cliclogo.png')} alt="" />
                    <img className="img-logo2" src={require('../Assets/alcaldialogo.png')} alt="" />
                    <img className="img-logo3" src={require('../Assets/unal.png')} alt="" />
                </div>
                {loading ?
                    <div className="load-animation">
                        <p className="loading-title">Subiendo</p>
                        <div className="micro-loading-container">
                            <Icon className="loading-icon" type="loading" />
                        </div>
                    </div>
                    : <div />}

                <Button style={{ position: "absolute", right: "1%", top: "2%" }} type="primary" onClick={LogOut} >Salir</Button>
                {/* <Button style={{ position: "absolute", right: "5%", top: "2%" }} type="primary" onClick={() => console.log(currentRequestID)} >Salir</Button> */}

                <div className="info-box">
                    <p style={{ color: "steelblue" }}> Usuario: </p>
                    <p>{state.userData.username}</p><br /><br />
                    <p style={{ color: "steelblue" }}> IED: </p>
                    <p>{state.userData.nombreie}</p><br /><br />
                    <p style={{ color: "steelblue" }}> Localidad </p>
                    <p>{state.userData.localidad}</p><br /><br />
                    <p style={{ color: "steelblue" }}> Incentivo al que se presenta </p>
                    <p>{state.userData.incentivo}</p> <br /><br />


                    <div className="links-descarga">
                        <a href={l1} target="_blank" >Descargar Términos y condiciones CLIC </a><br />
                        <a href={l3} target="_blank" >Descargar Adenda 01</a><br />
                        <a href={l2} target="_blank" >Descargar guía para diligenciar</a>
                        {/* <button onClick={() => console.log(l1, l2, l3)}>Check</button> */}
                    </div>
                </div>

                <div className="formcommon-box">
                    <p className="persona-responsable-title"> * Persona Responsable </p>
                    <Input value={fields.personaResponsable} onChange={e => setFields({ ...fields, personaResponsable: e.target.value })} className="persona-responsable-input" />

                    <p className="correo-responsable-title"> * Correo Responsable </p>
                    <Input value={fields.correoResponsable} onChange={e => setFields({ ...fields, correoResponsable: e.target.value })} className="correo-responsable-input" />

                    <p className="tel-responsable-title"> * Teléfono Responsable </p>
                    <Input value={fields.telfResponsable} onChange={e => setFields({ ...fields, telfResponsable: e.target.value })} className="tel-responsable-input" />

                    <p className="titulo-proyecto-title"> * Título del Proyecto </p>
                    <Input value={fields.tituloProyecto} onChange={e => setFields({ ...fields, tituloProyecto: e.target.value })} className="titulo-proyecto-input" />

                    <p className="tematica-proyecto-title"> * Temática del Proyecto </p>
                    <Dropdown className="tematica-proyecto-input" overlay={menu} trigger={['click']}>
                        <a className="ant-dropdown-link" href="#">
                            {
                                !fields.tematicaProyecto ? "Seleccione Temática" : fields.tematicaProyecto
                            }
                            <Icon type="down" />
                        </a>
                    </Dropdown>
                    {/* <Input onChange={e => setFields({ ...fields, tematicaProyecto: e.target.value })} className="" /> */}

                    <p className="otra-tematica-title"> Otra Temática </p>
                    <Input disabled={fields.tematicaProyecto === "Otra" ? false : true} value={otraTematica} onChange={e => setOtraTematica(e.target.value)} className="otra-tematica-input" />

                    {
                        upload.show
                            ? <p className="plantilla-title"> * Plantilla de postulación diligenciada </p>
                            : <p style={{ marginTop: "2em" }} className="plantilla-title"> * Archivo Cargado (clic para descargar) </p>
                    }

                    {
                        upload.show ?
                            <div className="plantilla-input">
                                <FilePond
                                    labelIdle='Arrastra o selecciona archivo'
                                    allowMultiple={false}
                                    files={file.fileC}
                                    maxFiles={1}
                                    onupdatefiles={e => {
                                        let name = "", type = "", file = []
                                        setFile({
                                            ...file, fileC: e.map(single_file => {
                                                name = single_file.filename
                                                type = single_file.fileType
                                                return single_file.file
                                            }), filename: name, filetype: type
                                        })


                                    }}
                                />
                            </div>
                            :
                            <div className="plantilla-document-name">
                                <a style={{ marginTop: "2em" }} href={upload.link} target="_blank">
                                    {state.userData.referencia}
                                </a>
                                <a style={{ marginTop: "2em" }} href={anx.link} target="_blank">
                                    {anx.name}
                                </a>
                                <Button className="edit-file-btn" onClick={() => setUpload({ ...upload, show: true })}>Editar Archivo</Button>
                            </div>
                    }
                    {
                        upload.show
                            ? <p className="anexos"> Anexos </p>
                            : console.log()
                    }
                    {
                        upload.show ?
                            <div className="anexos-input">
                                <FilePond
                                    labelIdle='Arrastra o selecciona archivo'
                                    className="filepond"
                                    allowMultiple={false}
                                    files={file2.fileC2}
                                    maxFiles={1}
                                    onupdatefiles={e => {
                                        let name = "", type = "", file = []
                                        setFile2({
                                            ...file2, fileC2: e.map(single_file => {
                                                name = single_file.filename
                                                type = single_file.fileType
                                                return single_file.file
                                            }), filename2: name, filetype2: type
                                        })


                                    }}
                                />
                            </div>
                            : console.log()
                    }

                    <div className="checkbox-container">
                        <Checkbox checked={checkInputs.c1} onChange={e => setCheckInputs({ ...checkInputs, c1: e.target.checked })}>
                            <i style={{ margin: '0', fontSize: '.8em' }}>Enviar para retroalimentación del experto</i>
                        </Checkbox>
                        <Checkbox checked={checkInputs.c2} onChange={e => setCheckInputs({ ...checkInputs, c2: e.target.checked })}>
                            <i style={{ margin: '0', fontSize: '.8em' }}>Enviar para Evaluación</i>
                        </Checkbox>
                    </div>

                    <div className="send-btn-container">
                        {
                            reviewed
                                ? <Button onClick={() => validateBeforeSend('update')} >Guardar</Button>
                                : <Button onClick={() => validateBeforeSend('create')} >Enviar Postulación</Button>
                        }

                    </div>

                </div>
            </div >
            :
            <div></div>
    )
}

export default withRouter(FormCommon)