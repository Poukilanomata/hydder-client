import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';

import axios from 'axios'

import Post from './utils/post';

import params from '../variables'

axios.defaults.withCredentials = true;

class MainPost extends React.Component{
    constructor(props){
        this.state = {
            post: null
        }
    }

    fetchPost(){
        axios.post(params.server+'/post/fetch_unique_post', {
            id: this.props.id
        }).then((res) => {
            if(res.data.success === true){
                this.setState({
                    post: res.data.post
                })
            }
        })
    }
    
    componentDidMount(){

    }

    render(){
        return(   
            <>
                {this.state.post ? 
                    <Post
                        key={this.state.post.id}
                        id={this.state.post.id}
                        connected={this.props.auth.isLoggedIn}
                        user={this.props.user}
                        level={0}
                    />
                : null}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        newposts: state.content.newposts,
        posts: state.content.posts,
        ids: state.content.ids,
        auth: state.auth,
        new_account: state.auth.new_account,
    }
}


export default connect(mapStateToProps, null)(MainPost);