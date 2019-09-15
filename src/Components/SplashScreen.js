import React, { useState, useEffect, useContext } from 'react'
import '../Styles/Spash.css'
import Context from '../GlobalState/context'
import { withRouter } from 'react-router-dom'

const Spash = props => {

    const { state, actions } = useContext(Context)
    const [showSpash, setShowSplash] = useState(true)

    useEffect(() => {
        changeScreen()
    }, [])

    const changeScreen = () => {
        setTimeout(() =>
            state.userData.username.split("_")[0] !== "RED"
                ? props.history.push('formcommon')
                : props.history.push('formred')
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