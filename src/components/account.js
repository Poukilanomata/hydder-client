import React from 'react';
import Cookies from 'js-cookie';
import Post from './utils/post';
import Right from './utils/right'
import {
    Navigate
} from "react-router-dom"

import { connect } from 'react-redux';
import { update_pp, update_surname } from '../app/auth';

import { getPP, toastAll } from '../utils/functions'

import {isMobile} from 'react-device-detect';
import axios from 'axios';
import params from '../variables';

import { toast } from 'react-toastify';

import { ReactComponent as Loader } from '../svg/loader-infinite.svg'

axios.defaults.withCredentials = true;

class AccountComponent extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            owner: null,
            user: null,

            
            current_index: 0,
            isloading: false,
            end: false,

            posts: [],
            ids: [],

            redirect: false,
            pp: this.props.user? this.props.user.profile_picture: 'false'
        }

        this.handleScroll = this.handleScroll.bind(this);
        this.fetchNewPosts = this.fetchNewPosts.bind(this);
        this.updatePosts = this.updatePosts.bind(this);
        this.logout = this.logout.bind(this);
        this.upload_image = this.upload_image.bind(this)
        this.handle_surname_change = this.handle_surname_change.bind(this)
        this.handle_surname_submit = this.handle_surname_submit.bind(this)

        window.addEventListener('scroll', this.handleScroll);

    }

    // DW bro this just fix some bugs
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    getUser(){
        if(this.props.user._id === this.props.id){
            document.title = this.props.user.surname + ' | Hydder'
        }else{
            axios.post(params.server+"/auth/fetch_user", {
                userid: this.props.id
            }).then(
                (res) => {
                    if(res.data.success){
                        this.setState({
                            user: res.data.user
                        })
                        document.title = res.data.user.surname + ' | Hydder'
                    }
                }
            )
        }
    }

    componentDidMount(){
        window.scrollTo(0, 0)
        if(this.props.user){
            
            this.setState({
                owner: this.props.user._id === this.props.id
            })
            
            this.getUser()
        }

        this.fetchNewPosts(this.props.id)
    }

    async updatePosts(){
        await this.setStateAsync({
            posts: [],
            ids: [],
            current_index: 0,
            end: false,
            isloading: false
        })
        this.fetchNewPosts(this.props.id)
    }

    componentDidUpdate(prevProps){

        if(prevProps.id !== this.props.id){
            window.scrollTo(0, 0)
            this.updatePosts()
            //reset state
            if(this.props.user){
                this.getUser()
                this.setState({
                    owner: this.props.user._id === this.props.id,
                    pp: this.props.user.profile_picture
                })
            }
        }

        if(this.props.user !== prevProps.user && this.props.user){
            this.setState({
                owner: this.props.user._id === this.props.id,
                pp: this.props.user.profile_picture
            })
            this.getUser()
        }
    }

    async fetchNewPosts(userid){
        if(!this.state.end && userid && !this.state.isloading){

            axios.post(params.server+'/post/fetch_posts_by_user', {
                ids: this.state.ids,
                index: this.state.current_index,
                userid: userid
            }).then(async (res) => {
                await this.setStateAsync({
                    isloading: false,
                })

                if(res.data.success && res.data.posts.length !== 0){
                    
                    this.setState({
                        posts: [...this.state.posts, ...res.data.posts],
                        ids: [...res.data.posts.map(post => post.id), ...this.state.ids]
                    })

                    await this.setStateAsync({
                        current_index: this.state.current_index + 1,
                    })

                } else {
                    if(res.data.posts.length === 0){
                        await this.setStateAsync({
                            end: true
                        })
                    } else {
                        console.log(res.data.message);
                    }
                }
            })
        }
    }

    async handleScroll(e) {
        let scrollTop = window.scrollY;
        let scrollHeight = document.body.scrollHeight;
        let clientHeight = document.body.clientHeight;

        let heightLeft = scrollHeight - (scrollTop + clientHeight);
        if(heightLeft < 1000 && !this.state.isloading){
            await this.setStateAsync({
                isloading: true,
            })
            await this.fetchNewPosts()
        }
    }

    async logout(){
        this.setState({
            redirect: true
        })
    }

    upload_image(e) {
        let file = e.target.files[0]

        if(file.size < 5242880) {
            let formdata = new FormData()
            formdata.append('pp', file)

            axios.post(params.server+'/auth/update_profile_picture', formdata)
            .then(
                res => {
                    if(res.data.success) {
                        this.props.update_pp(res.data.pp)
                        toast.success('Profile picture updated successfully !', {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        })
                    } else {
                        toastAll(res.data.message, res.status)
                    }
                }
            )
        }
    }

    handle_surname_change(e){
        this.setState({
            surname: e.target.value
        })
    }

    handle_surname_submit(e){
        if(e.charCode === 13){
            axios.post(params.server+'/auth/update_surname', {
                surname: this.state.surname
            }).then(
                res => {
                    if(res.data.success) {
                        this.props.update_surname(res.data.surname)
                        toast.success('Surname updated successfully !', {
                            position: "bottom-center",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                        })
                    } else {
                        toastAll(res.data.message)
                    }
                }
            )
        }
    }

    render(){
        if(!Cookies.get('connected')){
            return(
                <Navigate to='/login' />
            )
        }
        try{
            return(
                <>
                {this.state.redirect ? <Navigate to='/login' /> : null}
                <div className='main-account'>
                    <div className='top'>
                        <div className='container-0'>

                            {this.state.owner?
                            <>
                                <input onChange={this.upload_image} type={'file'} accept=".jpg, .jpeg, .png, .tiff, .gif, .webp" id='image-account'/>
                                <label htmlFor='image-account' className='img-container'>
                                    <img src={getPP(this.state.pp)} alt=''/>
                                </label>
                            </>
                            :
                            <div className='img-container'>
                                <img src={getPP(this.props.user.profile_picture)} alt=''/>
                            </div>
                            }
                        </div>
                    </div>
                    <div className='center'>
                        {this.state.owner?
                        <>
                            <div className='basic-info'>
                                <input className='surname' onChange={this.handle_surname_change} onKeyPress={this.handle_surname_submit} defaultValue={this.props.user.surname} />
                                <span className='name'>@{this.props.user.name}</span>
                                {!isMobile? <span className='logout' onClick={this.logout}>Logout</span> :null}
                                
                            </div>
                            <div className='global'>
                                <span className='rank'>Rank : #{this.props.user.rank}</span>
                                <span className='rank'>Hype : {this.props.user.ranking.score}🔥</span>
                                {isMobile?<span className='logout' onClick={this.logout}>Logout</span>:null}
                            </div>
                        </>
                        :<>
                        {this.state.user?
                        <>
                        <div className='basic-info'>
                            <span className='surname'>{this.state.user.surname}</span>
                            <span className='name'>@{this.state.user.name}</span>
                            
                        </div>
                        <div className='global'>
                            <span className='rank'>Rank : #{this.state.user.rank}</span>
                            <span className='rank'>Hype : {this.state.user.ranking.score}🔥</span>
                        </div>
                        </>
                        :null} 
                    </>}
                    </div>

                    <div className='bottom'>
                        <div className='post-container'>
                            {this.state.posts.map((post) => {
                                return(
                                    <>
                                    <Post
                                        key={post.id+'account'}
                                        id={post.id}
                                        post={post}
                                        connected={true}
                                        user={this.props.b_user}
                                        level={0}
                                    />
                                    </>
                                )
                            })}
                        </div>
                        {!isMobile?
                            <Right />
                        :null}
                        
                    </div>
                </div>
                </>
            )
        }catch(e){
            return(
                <div className='main-account'>
                    <Loader/>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => {
    return {
        b_user: state.auth,
        user: state.auth.user,
        isLoaded: state.auth.isLoaded,
        isLoggedIn: state.auth.isLoggedIn,
    }
}

export default connect(mapStateToProps, {update_pp, update_surname})(AccountComponent);