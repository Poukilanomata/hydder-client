import React from 'react'
import Wave from 'react-wavify';
import Particles from "react-tsparticles";
import axios from 'axios'
import * as Validator from 'validatorjs';
import Cookies from 'js-cookie';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    Navigate,
    Link
} from 'react-router-dom';
import { connect } from 'react-redux';
import { changeStatus, isNewAccount, logout } from '../app/auth';

import params from '../variables';
import variables from '../style/variables.scss'

import {isMobile} from 'react-device-detect';

axios.defaults.withCredentials = true;

class LoginComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            action: true,
            email: '',
            login: '',
            pwd1: '',
            pwd2: '',
            check: false,
            redirect: false
        }

        this.handle_input = this.handle_input.bind(this)
        this.handle_submit = this.handle_submit.bind(this)
        this.handle_checkbox = this.handle_checkbox.bind(this)
    }

    handle_input(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handle_submit(e) {
        var rules, validation

        function toastAll(e){
            for (const [key, value] of Object.entries(e)) {

                value.forEach(element => {

                    toast.error(element, {
                        position: "bottom-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                })
            }
        }

        if(this.state.action && this.state.pwd1 === this.state.pwd2 && this.state.check) {
            rules = {
                username: 'required|string|between:5,20',
                password: 'required|string|between:5,30',
                email: 'required|email|between:5,50'
            }
            validation = new Validator({username: this.state.login, password: this.state.pwd1, email: this.state.email}, rules);
            
            if(!validation.fails() && this.state.pwd1 === this.state.pwd2){
                axios.post(params.server+"/auth/new_user", {
                    username: this.state.login,
                    password: this.state.pwd1,
                    email: this.state.email
                }).then(
                    (response) => {
                        if(response.data.success){
                            this.props.changeStatus(true)
                            this.props.isNewAccount(true)
                            this.setState({
                                redirect: true
                            })
                        } else {
                            toast.error(response.data.message, {
                                position: "bottom-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            })
                        }
                    }
                )
            } else {
                toastAll(validation.errors.all())
            }

        }else if(!this.state.action){
            rules = {
                username: 'required|string|between:2,20',
                password: 'required|string|between:5,30'
            }
            validation = new Validator({username: this.state.login, password: this.state.pwd1}, rules);

            if(!validation.fails()){
                axios.post(params.server+"/auth/login", {
                    username: this.state.login,
                    password: this.state.pwd1
                }).then(
                    (response) => {
                        if(response.data.success){
                            this.props.changeStatus(true)
                            this.setState({
                                redirect: true
                            })
                        }else {
                            toast.error(response.data.message, {
                                position: "bottom-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            })
                        }
                    }
                )
            } else {
                toastAll(validation.errors.all())  
            }
        } else {
            if(this.state.pwd1 !== this.state.pwd2){
                toast.error("Passwords don't match", {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            } else if(!this.state.check){
                toast.error("You must conscent terms and conditions", {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
        }
    }

    handle_checkbox(e) {
        
        this.setState({
            check: !this.state.check
        })
    }

    componentDidMount() {
        
        this.props.logout()
        Cookies.remove('connected');
        axios.post(params.server+'/auth/logout', {})
    }

    render() {
        return (
            <>
                <div className='main'>
                    <h3>{this.state.action? "Join the community 🔥": "Welcome back ! 👑"}</h3>
                    {this.state.action ?
                        <input onChange={this.handle_input} autoFocus placeholder='Email' type={"email"} name='email' />
                    :null}
                    <input onChange={this.handle_input} placeholder='Amazing username' type={"text"} name='login' />
                    <input onChange={this.handle_input} placeholder='Secret password' type={"password"} name='pwd1' />
                    {this.state.action ?
                        <input onChange={this.handle_input} placeholder='Confirm your password (just in case)' type={"password"} name='pwd2' />
                    :null}
                    <div className='button' onClick={this.handle_submit}>
                        <span>{this.state.action ? 'Sign up' : 'Login'}</span>
                    </div>
                    <div className='bottom'>
                        {this.state.action ?
                            <div className='checkbox'>
                                <input type='checkbox' onChange={this.handle_checkbox} id='checkbox'/>
                                <Link to={'/terms_and_conditions'} target='_blank'><span>I consent terms and conditions</span></Link>
                            </div>
                        :null}
                        <span className='change' onClick={() => this.setState({action: !this.state.action})}>{
                            this.state.action ? "It's not my fist time in here" : 'Need to create an account ?'
                        }</span>
                    </div>
                    
                </div>
                <div className='background'>
                    {isMobile?
                        <Wave 
                            paused={false}
                            className='wave'
                            fill={variables.main_color}
                            options={{
                                amplitude: 100,
                                height: 50,
                                speed: 0.15,
                                points: 2,
                            }}
                        />
                    :
                        <Wave 
                            paused={false}
                            className='wave'
                            fill={variables.main_color}
                            options={{
                                amplitude: 100,
                                height: 50,
                                speed: 0.15,
                                points: 4,
                            }}
                        />
                    }

                    <Particles
                        className='background-particules'
                        width='100%'
                        height='100vh'
                        params={
                            {"particles": {
                            "number": {
                                "value": 70,
                                "density": {
                                    "enable": true,
                                    "value_area": 800
                                }
                            },
                            "color": {
                                "value": variables.main_color
                            },
                            "shape": {
                                "type": "circle",
                                "stroke": {
                                "width": 0,
                                "color": "#f86ecf"
                                },
                                "polygon": {
                                "nb_sides": 5
                                }
                            },
                            "opacity": {
                                "value": 0.8,
                                "random": false,
                                "anim": {
                                "enable": false,
                                "speed": 1,
                                "opacity_min": 0.3,
                                "sync": false
                                }
                            },
                            "size": {
                                "value": 3,
                                "random": true,
                                "anim": {
                                "enable": false,
                                "speed": 40,
                                "size_min": 0.1,
                                "sync": false
                                }
                            },
                            "line_linked": {
                                "enable": false,
                                "distance": 100,
                                "color": "#b1a8a8",
                                "opacity": 0.4,
                                "width": 1
                            },
                            "move": {
                                "enable": true,
                                "speed": 1,
                                "direction": "top",
                                "random": false,
                                "straight": false,
                                "out_mode": "out",
                                "bounce": false,
                                "attract": {
                                "enable": false,
                                "rotateX": 600,
                                "rotateY": 1200
                                }
                            }
                            },
                            "interactivity": {
                            "detect_on": "canvas",
                            "events": {
                                "onhover": {
                                    "enable": true,
                                    "mode": "push"
                                },
                                "onclick": {
                                    "enable": true,
                                    "mode": "push"
                                },
                                "resize": true
                            },
                            "modes": {
                                "grab": {
                                "distance": 400,
                                "line_linked": {
                                    "opacity": 1
                                }
                                },
                                "bubble": {
                                    "distance": 400,
                                    "size": 40,
                                    "duration": 2,
                                    "opacity": 100,
                                    "speed": 3
                                },
                                    "repulse": {
                                    "distance": 200,
                                    "duration": 0.4
                                },
                                    "push": {
                                    "particles_nb": 5
                                },
                                "remove": {
                                    "particles_nb": 2
                                }
                            }
                        },
                        "retina_detect": true
                    }}
                />
                    
                </div>
                {this.state.redirect? <Navigate to='/' /> : null}
            </>
        )
    }
}

const Login = connect(null, { changeStatus, isNewAccount, logout })(LoginComponent)

export default Login