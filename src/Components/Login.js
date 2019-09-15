import React, { useState, useEffect, useContext } from 'react'
import { ConsoleLogger } from '@aws-amplify/core'
import { Input, Button, Icon } from 'antd'
import '../Styles/Login.css'
import { withRouter } from 'react-router-dom'
import { Auth, API, graphqlOperation } from 'aws-amplify'
import * as queries from '../graphql/queries'
import Context from '../GlobalState/context'

const Login = props => {

    const [credentials, setCredentials] = useState({ u: "", p: "" })
    const { state, actions } = useContext(Context)
    const [show, setShow] = useState(false)
    const [loadingLogin, setLoadingLogin] = useState(false)

    useEffect(() => {
        checkCurrentSession()
    }, [])

    const register = async () => {
        try {
            let res = await Auth.signUp({
                username: credentials.u,
                password: credentials.p
            })
            await console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const login = () => {
        let role = credentials.u.split("_")
        console.log(role)
        setLoadingLogin(true)
        Auth.signIn(credentials.u.replace(/ /g, ""), credentials.p)
            .then(async res => {
                if (role[0].toLowerCase() !== "eval") {
                    let userData = await API.graphql(graphqlOperation(queries.getUser, { id: res.username }))
                    let userObj = userData.data.getUser;
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
                    // if (role[0].toLowerCase() === "red") {
                    //     props.history.push('formred')
                    // } else { props.history.push('formcommon') }
                    props.history.push('splash')
                } else {
                    switch (role[1]) {
                        case 'progreso': {
                            actions({ type: "setState", payload: { ...state, currentIed: "PER_111001014869" } })
                        } break;
                        case 'experiencias': {
                            actions({ type: "setState", payload: { ...state, currentIed: "EEX_111001013935" } })
                        } break;
                        case 'modelos': {
                            actions({ type: "setState", payload: { ...state, currentIed: "MEF_111001086801" } })
                        } break;
                        case 'disminucion': {
                            actions({ type: "setState", payload: { ...state, currentIed: "DIS_111001044385" } })
                        } break;
                        case 'red': {
                            actions({ type: "setState", payload: { ...state, currentIed: "RED_111001011819" } })

                        }
                    }
                    setLoadingLogin(false)
                    props.history.push('splash')
                }

            })
            .catch(error => {
                alert("Las Credenciales son Invalidas")
                setLoadingLogin(false)
            })
    }

    const checkCurrentSession = async () => {
        try {
            let current = await Auth.currentAuthenticatedUser()
            if (current) props.history.push('splash')
            // if (current.username.split("_")[0] !== "RED") props.history.push('formcommon')
            // else props.history.push('formred')
        } catch (error) {
            console.log(error)
            setShow(true)
        }
    }


    return (
        show ?
            <div className='login-container'>

                <img src={require('../Assets/cliclogo.png')} width="100" alt="Clic Ideas" /> <br />

                <div className="login-box">
                    <p className="user-title">Usuario</p>
                    <Input onChange={e => setCredentials({ ...credentials, u: e.target.value })} className="input-user" />
                    <p className="pass-title">Contraseña</p>
                    <Input type="password" onChange={e => setCredentials({ ...credentials, p: e.target.value })} className="input-pass" />
                    <Button type="primary" className="login-btn" onClick={() => Object.values(credentials).includes("") ? alert("No puede dejar campos vacíos") : login()}> Iniciar sesión </Button>
                    {/* <Button type="primary" className="login-btn" onClick={register}> Registrar </Button> */}
                    {
                        loadingLogin ?
                            <div className="login-loading-container">
                                <Icon type="loading" />
                            </div>
                            : console.log()
                    }

                </div>
                {/* <button style={{ position: 'absolute', top: '0' }} onClick={() => console.log(state.userData)}>logout</button> */}
            </div >
            :
            <div />
    )
}

export default withRouter(Login)