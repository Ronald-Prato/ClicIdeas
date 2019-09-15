import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify'
import config from './aws-exports'
import 'antd/dist/antd.css'
import 'filepond/dist/filepond.min.css';
import useGlobalState from './GlobalState/useGlobalState'
import Context from './GlobalState/context'

Amplify.configure(config, {
    Auth: {
        mandatorySignId: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID,
        userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    Storage: {
        AWSS3: {
            bucket: 'clicideas-bucket-ideas',//Your bucket name;
            region: 'us-east-2'//Specify the region your bucket was created in;
        }
    }

})



const Index = () => {
    const store = useGlobalState();
    return (
        <Context.Provider value={store}>
            <App />
        </Context.Provider>
    )
}

ReactDOM.render(<Index />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
