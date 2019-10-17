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
                if (credentials.u.toLowerCase() === "admin") {
                    // let userData = await API.graphql(graphqlOperation(queries.getUser, { id: res.username }))
                    // let userObj = userData.data.getUser;
                    await actions({
                        type: "setState",
                        payload: {
                            ...state,
                            userData: {
                                ...state.userData,
                                username: "admin"
                            }
                        }
                    })
                    // if (role[0].toLowerCase() === "red") {
                    //     props.history.push('formred')
                    // } else { props.history.push('formcommon') }
                    props.history.push('splash')
                } else if (role[0].toLowerCase() === "ev") {
                    let evalData = await API.graphql(graphqlOperation(`
                        query {
                            getUser(id: "${res.username}"){
                                id name evaluated
                            }
                        }
                    `))
                    let evalObj = evalData.data.getUser;
                    // console.log("ID =>=>=> ", evalObj.id)
                    await actions({
                        type: "setState",
                        payload: {
                            ...state,
                            evalData: {
                                id: evalObj.id,
                                name: evalObj.name,
                                evaluated: evalObj.evaluated
                            }
                        }
                    })

                    setLoadingLogin(false)
                    props.history.push('splash')
                } else {
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
                }

            })
            .catch(error => {
                alert("Las Credenciales son Invalidas")
                console.log(error)
                setLoadingLogin(false)
            })
    }

    const checkCurrentSession = async () => {
        try {
            let current = await Auth.currentAuthenticatedUser()
            console.log()
            if (current.username.split("_")[0] !== "EV") props.history.push('splash')
            else {
                let evalData = await API.graphql(graphqlOperation(`
                        query {
                            getUser(id: "${current.username}"){
                                id name evaluated
                            }
                        }
                    `))
                let evalObj = evalData.data.getUser;
                actions({
                    type: "setState",
                    payload: {
                        ...state,
                        evalData: {
                            id: evalObj.id,
                            name: evalObj.name,
                            evaluated: evalObj.evaluated
                        }
                    }
                })
            } props.history.push('splash')
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