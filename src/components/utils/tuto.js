import React from 'react';

import logo from '../../image/logo_5.jpg'
import { connect } from 'react-redux';

import { isNewAccount } from '../../app/auth'

class TutoComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    changeNewAccountStatus = () => {
        this.props.isNewAccount(false)
    }

    render() {
        return (
            <>
            <div id='main-tuto'>
                <div className='tuto-content'>
                    <div className='top'>
                        <h1>Welcome to Hydder !</h1>
                        <h2>Only the best ! (dw ur already the best)</h2>
                    </div>
                    <div className='img-container'> 
                        <img src={logo} alt='logo'/>
                    </div>
                    <div className='tips'>
                        <ul>
                            <li>🤠 Post your best memes and let out your creativity </li>
                            <li>😱 Each season 42% of the posts simply ✨ disappear ✨</li>
                            <li>🔥 And only the cream of the crop stays on the platform</li>
                        </ul>
                    </div>
                    <div className='button-container'>
                        <div className='button' onClick={this.changeNewAccountStatus}>
                            <span>Give me the best !</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
        )
    }
}

const Tuto = connect(null, { isNewAccount })(TutoComponent) 



export default Tuto