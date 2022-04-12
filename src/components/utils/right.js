import React from "react";
import Countdown from 'react-countdown';
import params from '../../variables';

import variables from '../../style/variables.scss'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { IoMdShareAlt } from "react-icons/io"

import axios from 'axios';
import { connect } from 'react-redux';
import {
    Link 
} from "react-router-dom";
import ReactTooltip from 'react-tooltip';

import { getPP } from '../../utils/functions';

axios.defaults.withCredentials = true;

function Share(props) {

    return(
        <>
            <div className="share" onClick={() => {
                navigator.clipboard.writeText("https://hydder.com")
                toast.success('Link copied to clipboard !', {
                    position: "bottom-center",
                    autoClose: 1200,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    toastId: "site_copied",
                });
            }}>
                
                <div className="button" data-tip data-for="share-page">
                    <span>Share</span>
                    <div className="share" >
                        <IoMdShareAlt />
                    </div>
                    <ReactTooltip className="share-page" backgroundColor={variables.font_color_3} id="share-page" effect="solid">
                        <span>Click to copy link</span>
                    </ReactTooltip>
                </div>
            </div>
        </>
    )
}

function User(props) {
    return (
        <Link to={'/account/'+props.id} className="user">
            <span className="rank">{"#"+props.rank}</span>
            <img src={getPP(props.profile_picture)} alt="profil" />
            <span className="surname">{props.surname}</span>
            <span className="score">{+props.score}🔥</span>
        </Link>
    )
}

class Rank extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isloaded: false,
            users: []
        }
    }

    get_top_users() {
        axios.post(params.server+"/auth/get_top_users").then(res => {
            if(res.data.success) {
                this.setState({
                    users: res.data.users
                })
            }
        })
    }

    componentDidMount() {
        this.get_top_users()
    }

    render() {
        return (
            <div className="rank" >
                <div className="title">
                    <span className="title">Leaderboard</span>
                    <span className="players">79.6k players !</span>
                </div>
                <div className="users">
                    {this.state.users.map((user, index) => {
                        return (
                            <User key={index} id={user._id} profile_picture={user.profile_picture} name={user.name} surname={user.surname} score={user.ranking.score} rank={index+1} />
                        )
                    })}
                </div>
                <Share />
            </div>
        )
    }
}

class TopHead extends React.Component{

    render(){

        const renderer = ({ days, hours, minutes, seconds, completed }) => {
            const Completionist = () => {return(<>Timer will be back soon</>)}
            if (completed) {
              // Render a completed state
              return <Completionist />;
            } else {
              // Render a countdown
              return <span>{days}d {hours}:{minutes}:{seconds}</span>;
            }
        };

        return(
            <>{
                this.props.user?
                <div className="top-head">
                    <div className="account">
                        <img src={getPP(this.props.user.profile_picture)} alt="account"/>
                        <span className="surname">{this.props.user.name}</span>
                        <div>
                            <Link to={'/account/'+this.props.user._id} className="name">@{this.props.user.name}</Link>
                            <span className="score">{this.props.user.ranking.score}🔥</span>
                        </div>
                    </div>

                    <div className="timer">
                        <span className="title">Season ends in :</span>
                        <span className="time"><Countdown date={Date.now() + 100000000} renderer={renderer} /></span>
                        
                        <span className="rank">Rank - #{this.props.user.ranking.rank}</span>
                    </div>
                    
                </div>
                :null
            }
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    }
}

const Top = connect(mapStateToProps)(TopHead)




export default class Main extends React.Component {
    render() {
        return (
        <div className="container-right">
            <Top />
            <Rank/>
        </div>
        );
    }
}