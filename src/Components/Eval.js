import React, { useState, useEffect, useContext } from 'react'
import Context from '../GlobalState/context'
import { Auth, graphqlOperation, Storage, API } from 'aws-amplify'
import { Button } from 'antd'
import '../Styles/Eval.css'
import { onCreateFormCommon } from '../graphql/subscriptions'
import { withRouter } from 'react-router-dom'


const Eval = props => {

    const { state, actions } = useContext(Context)
    const [progreso, setProgreso] = useState([])
    useEffect(() => {
        getCustomData()
        const subscription = API.graphql(graphqlOperation(onCreateFormCommon)).subscribe({
            next: () => getCustomData()
        })
        return () => subscription.unsubscribe()
    }, [])


    const getCustomData = async () => {
        let response = await API.graphql(graphqlOperation(`
            query {
                getUser(id:"${state.currentIed}") {
                    nombreie referencia 
                }
            }
        `))
        await console.log(response)
        setProgreso(
            [response.data.getUser]
        )
    }

    const LogOut = async () => {
        await Auth.signOut()
        await props.history.push('/')
    }


    return (
        <div className='eval-container'>
            <Button style={{ position: "absolute", right: "2%", top: "2%" }} type="primary" onClick={LogOut} >Salir</Button>
            <div className="scroll-screen">
                {
                    progreso.map((item, i) =>
                        <div className="single-row" key={i}>
                            <p>{item.nombreie}</p>
                            {
                                item.referencia === "nula" ?
                                    <p style={{ color: "tomato" }}>Sin Postulación</p>
                                    :
                                    <p style={{ color: "steelblue", cursor: 'pointer ' }}>Revisar</p>
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default withRouter(Eval)