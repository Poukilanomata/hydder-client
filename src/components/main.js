import React from "react";
import axios from "axios";

//import components
import Newpost from "./new_post";
import { addPosts } from "../app/content";
import params from "../variables";

// Import store
import { connect } from 'react-redux';

import Post from './utils/post';
import Tuto from './utils/tuto';

axios.defaults.withCredentials = true;

class Main extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            current_index: 0,
            isloading: false,
            end: false,

            posts: [],
            ids: []
        }

        this.container = React.createRef();
        this.handleScroll = this.handleScroll.bind(this);
        this.fetchNewPosts = this.fetchNewPosts.bind(this);

        window.addEventListener('scroll', this.handleScroll);
    }

    // DW bro this just fix some bugs
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentDidMount(){
        await this.setStateAsync({
            isloading: true,
        })

        await this.fetchNewPosts(this.props.post_id)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.post_id !== this.props.post_id) {
            this.setState({
                current_index: 0,
                isloading: false,
                end: false,

                posts: [],
                ids: []
            })
            window.scrollTo(0, 0);
            this.fetchNewPosts(this.props.post_id)
        }
    }

    async fetchNewPosts(post_id){
        if(!this.state.end){
            
            console.log("fetching new posts : "+this.state.current_index)

            axios.post(params.server+'/post/fetch_posts', {
                ids: this.state.ids,
                index: this.state.current_index,
                origin: 'root',
                id: post_id
            }).then(async (res) => {
                await this.setStateAsync({
                    isloading: false,
                })

                if(res.data.success === true && res.data.posts.length !== 0){
                    function shuffle(array, nb_posts) {
                        var saved
                        if(nb_posts === 0){
                            saved = array[0];
                            array = array.slice(1)
                        }else {
                            saved = null
                        }

                        let currentIndex = array.length,  randomIndex;
                      
                        // While there remain elements to shuffle...
                        while (currentIndex !== 0) {
                      
                          // Pick a remaining element...
                          randomIndex = Math.floor(Math.random() * currentIndex);
                          currentIndex--;
                      
                          // And swap it with the current element.
                          [array[currentIndex], array[randomIndex]] = [
                            array[randomIndex], array[currentIndex]];
                        }

                        if(saved){
                            array.unshift(saved)
                            console.log(array)
                            return array
                        }

                        return array
                    }
                    this.setState({
                        posts: [...this.state.posts, ...shuffle(res.data.posts, this.state.posts.length)],
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

    render(){

        return(
        <>
        {this.props.new_account?
        <Tuto/>
        :null}
        
        <div className="container-left" ref={this.container}>
            <Newpost />
            
            {this.props.newposts.slice(0).reverse().map((post) => {
                
                return(
                    <Post
                        key={post.id}
                        id={post.id}
                        post={post}
                        score={1}
                        user={this.props.user}
                        connected={true}
                        level={0}
                    />
                )
            })}

            {this.state.posts.map((post, index) => {
                return(
                    <>
                    <Post
                        key={post.id}
                        id={post.id}
                        post={post}
                        connected={this.props.user.isLoggedIn}
                        user={this.props.user}
                        level={0}
                    />

                    {this.props.shared && index === 0?
                        <div className="line-container">
                            <div className="line"/>
                            <span>See something new 🤠</span>
                            <div className="line"/>
                        </div>
                    :null}
                    </>
                )
            })}
        </div>
        </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        newposts: state.content.newposts,
        user: state.auth,
        new_account: state.auth.new_account,
    }
}


export default connect(mapStateToProps, null)(Main);