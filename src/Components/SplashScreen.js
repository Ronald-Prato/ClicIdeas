import React, { useState, useEffect, useContext } from 'react'
import '../Styles/Spash.css'
import Context from '../GlobalState/context'
import { withRouter } from 'react-router-dom'
import { Auth } from 'aws-amplify'

const Spash = props => {

    const { state, actions } = useContext(Context)
    const [showSpash, setShowSplash] = useState(true)

    useEffect(() => {
        changeScreen()
    }, [])

    const changeScreen = async () => {
        let user = await Auth.currentAuthenticatedUser()
        setTimeout(() =>
            user.username.split("_")[0] === "RED"
                ? props.history.push('formred')
                : user.username.split("_")[0] === "EV"
                    ? props.history.push('eval')
                    : user.username === "admin"
                        ? props.history.push('admin')
                        : props.history.push('formcommon')
            , 1500)
    }

    return (
        showSpash ?
            <div className='splash-container'>
                <h2> Bienvenido </h2>
                <img width="200" src={require('../Assets/cliclogo.png')} alt="Clic Ideas" />
            </div>
            :
            <div />
    )
}

export default withRouter(Spash)