import React from "react";
import axios from "axios";
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'react-toastify';

import {
    Link
} from "react-router-dom";

import  { ReactComponent as Arrow } from '../../svg/arrow.svg'
import { ReactComponent as Send } from '../../svg/send.svg'
import { ReactComponent as Cross } from '../../svg/cross-sign.svg'

import { MdImage } from "react-icons/md"
import { IoMdShareAlt } from "react-icons/io"

import { getPP } from "../../utils/functions";
import { RequireLoggedIn, Confirm} from "../../utils/components";

import params from "../../variables";

axios.defaults.withCredentials = true;

class Text extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            displayed_link: this.props.content,
            tt_carachter: 0,
        }

        this.ytb_match = /[\r\n]+youtu.be\/|[\r\n]+youtube.com\/|youtu.be\/|youtube.com\/|[\r\n]+https:\/\/youtu.be\/|[\r\n]+https:\/\/youtube.com\/|https:\/\/youtu.be\/|https:\/\/youtube.com\//g
    }

    handle_words(word) {
        if(word.match(this.ytb_match)){
            let video_id = word.split("=")[1] || word.split("/")[word.split('/').length -1]
            return(
                <>
                <a href={'https://youtu.be/'+video_id} target="_blank" rel="noopener noreferrer">
                    {'youtu.be/'+video_id}
                </a>
                <span>
                    {' '}
                </span>
                </>
            )
        }else if(word.match(/[\r\n]+https:\/\/|https:\/\/|[\r\n]+http:\/\/|http:\/\//g) ) {
            return(
                <>
                <a href={word} target="_blank" rel="noopener noreferrer">
                    {word}
                </a>
                <span>
                    {' '}
                </span>
                </>
            )
        }else {
            return(
                <span>{word+" "}</span>
            )
        }
    }

    render() {
        return(
            <>
            {this.props.text !== "null"?
                this.props.text.split(/ |[\r]/).map((word, index) => {
                    return(
                        <span key={index}>
                            {this.handle_words(word)}
                        </span>
                    )
                })
            :<></>}
            </>
        )
    }
}

class Reply extends React.Component {
    constructor(props) {
        super(props);
        
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleTextarea = this.handleTextarea.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchNewReplies = this.fetchNewReplies.bind(this);


        this.state = {
            text: '',
            formdata: new FormData(),
            sendable: true,
            final_filename: null,

            ids: [],
            posts: [],
            current_index: 0,
            isloading: false,
            end: false,
            loadnew: true,

            newposts: [],
        }

        this.textarea = React.createRef();
        this.file = React.createRef();
    }

    // DW bro this just fix some bugs
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async fetchNewReplies() {
        console.log(this.state)
        if(!this.state.end && !this.state.isloading && this.state.loadnew) {
            console.log('fetching')
            await this.setStateAsync({
                isloading: true,
                loadnew: false
            })
            
            axios.post(params.server+'/post/fetch_posts', {
                ids: this.state.ids,
                index: this.state.current_index,
                origin: this.props.id,
            }).then(async (res) => {
                await this.setStateAsync({
                    isloading: false,
                })

                if(res.data.success === true && res.data.posts.length !== 0){
                    this.setState({
                        ids: [...res.data.posts.map(post => post.id), ...this.state.ids],
                        posts: [...this.state.posts, ...res.data.posts],
                    })

                    await this.setStateAsync({
                        current_index: this.state.current_index + 1,
                        loadnew: true,
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

    handleTextarea(e) {
        let a = e.target.value;
        a = a.replace(/\n/g, '<br/>');
        this.setState({text: a});
    }
    
    handleImage(image){
        this.state.formdata.delete('image')
        this.state.formdata.append('image', image)

        this.setState({
            final_filename: URL.createObjectURL(image)
        })
    }

    handleImageUpload(e){
        e.preventDefault();
        const image = e.target.files[0]
        if(image){
            this.handleImage(image)
        }
    }

    handleDrop = (evt) => {
        this.removeImage()
        evt.preventDefault();
        evt.stopPropagation();
  
        if(evt.dataTransfer.items) {
          var file = evt.dataTransfer.items[0].getAsFile();
  
          this.handleImage(file)
        }
    }

    removeImage = () => {
        this.setState({
            original_file: null,
            final_file: null,
            final_filename: null,
            processing_image: false
        })

        this.state.formdata.delete('imagepost')
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.state.formdata.delete('text')
        this.state.formdata.append('text', this.state.text)

        this.state.formdata.delete('origin')
        this.state.formdata.append('origin', this.props.id)
        

        if(this.state.text.length > 0 && this.state.sendable === true){

            this.setState({
                sendable: false
            })

            axios.post(params.server+'/post/new_post', this.state.formdata).then(
                (res) => {
                    this.setState({
                        sendable: true
                    })

                    if(res.data.success) {

                        var post = {
                            id: res.data.id,
                            content: {
                                text: this.state.text,
                                image: res.data.content.image
                            },
                            last_vote: {
                                up: true,
                                down: false
                            },
                            score: 1,
                            auth: this.props.user.user,
                            time_ago: 0
                        }
                        this.setState({
                            original_file: null,
                            final_file: null,
                            final_filename: null,
                            sendable: true,
                            text: '',
                            newposts: [post, ...this.state.newposts],
                        })
    
                        this.textarea.current.value = '';
                        this.file.current.value = null;
    
                        this.state.formdata.delete('image')
                        this.state.formdata.delete('text')
                        
                    }else{
                        console.log(res.data.message)
                    }
                }
            )

            

            /*Axios.post('http://localhost:5000/api/v2/posts', this.state.formdata)
            .then(res => {
                handleResponse(res)
            })*/
        }else{
            this.setState({
                sendable: true
            })
        }
        // Display the values
        for (var value of this.state.formdata.values()) {
            console.log(value);
        }

        
    }

    componentDidMount() {
        this.fetchNewReplies()
    }

    render(){
        return(
            <>
                <div 
                    id={this.props.id+"reply"}
                    onDragOver={
                        (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                    onDrop={               
                        (e) => {
                            e.preventDefault();
                            this.handleDrop(e)
                        }
                    }
                    
                    className="reply-input">

                    <label htmlFor={this.props.id+'image_input'}>
                        <MdImage/>
                    </label>

                    <input type='file' accept=".jpg, .jpeg, .png, .gif, .webp, .tiff, .jfif" style={{
                        display: "none"
                    }} ref={this.file} onChange={this.handleImageUpload} id={this.props.id+'image_input'} />

                    <TextareaAutosize
                        ref={this.textarea}
                        minRows={1}
                        maxRows={7}
                        maxLength={250}
                        placeholder="Pretty cool, right ?"
                        style={{overflow: "hidden"}}
                        onChange={this.handleTextarea}
                        id={this.props.id+'textarea'}
                    />

                    <output>
                        {this.state.final_filename ?
                        <>
                            <img src={this.state.final_filename} alt=""/>
                            <Cross onClick={this.removeImage} className='close'/>
                        </>
                        :null}
                    </output>
                    <RequireLoggedIn>
                        <div className="submit" id={this.props.id+"submit"} onClick={this.handleSubmit}>
                            <Send />
                        </div>
                    </RequireLoggedIn>
                </div>

                {this.state.newposts.length > 0 || this.state.posts.length > 0?
                <>
                    <div className="line"/>
                    <div className="main-reply">
                    {this.state.newposts.slice(0).reverse().map((post) => {
                        return(
                            <Post
                                key={post.id}
                                id={post.id}
                                post={post}
                                connected={true}
                                level={this.props.level + 1}
                                user={this.props.user}
                                redirect={(this.props.level +1) % 2 === 0? true : false}
                            />
                        )
                    })}
                    {this.state.posts.map((post) => {
                        return(
                            <Post
                                key={post.id}
                                id={post.id}
                                post={post}
                                connected={this.props.connected}
                                level={this.props.level + 1}
                                user={this.props.user}
                                redirect={(this.props.level +1) % 2 === 0? true : false}
                            />
                        )
                    })}
                    </div>
                    {!this.state.end?
                    <span className="see-more" onClick={
                        () => {
                            this.fetchNewReplies()
                        }
                    }>See more</span>
                    :null}
                    
                </>
                :
                null}
            </>
        )
    }
}

class Post extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            up: this.props.post.last_vote.up,
            down: this.props.post.last_vote.down,
            score: this.props.post.score,
            intergration: null,
            show_reply: (this.props.show_reply ||  Math.random() > 0.8) && this.props.level === 0? true : false,

            replies: [],
            post_class: this.props.level > 0 ? "post reply" : "post",
            deleted: false,
            popup: false,
        }

        this.vote = this.vote.bind(this);
        this.show_reply = this.show_reply.bind(this);
        this.HandleIntegration = this.HandleIntegration.bind(this);
        this.Content = this.Content.bind(this);
        this.delete_post = this.delete_post.bind(this);
        this.close_popup = this.close_popup.bind(this);

        this.reply = React.createRef();

        this.ytb_match = /[\r\n]+youtu.be\/|[\r\n]+youtube.com\/|youtu.be\/|youtube.com\/|[\r\n]+https:\/\/youtu.be\/|[\r\n]+https:\/\/youtube.com\/|https:\/\/youtu.be\/|https:\/\/youtube.com\//g
    }

    show_reply() {
        this.setState({
            show_reply: !this.state.show_reply
        })
    }

    vote(action) {
        let up = this.state.up;
        let down = this.state.down;
        let score = this.state.score;
        if(this.props.connected){
            if(action === true){
                if(!up && !down){
                    this.setState({
                        score: score + 1
                    })
                }else if(up && !down){
                    this.setState({
                        score: score - 1,
                    })
                } else if(!up && down){
                    this.setState({
                        score: score + 2,
                    })
                }
    
                this.setState({
                    up: !this.state.up,
                    down: false,
                })
    
            } else{
                if(!up && !down){
                    this.setState({
                        score: score - 1
                    })
                }else if(up && !down){
                    this.setState({
                        score: score - 2,
                    })
                } else if(!up && down){
                    this.setState({
                        score: score + 1,
                    })
                }
    
                this.setState({
                    down: !this.state.down,
                    up: false
                })
            }
    
            axios.post(params.server+"/post/vote", {
                postid: this.props.id,
                vote: action,
            }).then(res => {
                console.log(res.data);
            })
        }
    }

    async HandleIntegration(text){

        if(this.state.intergration === null){
            if(this.props.post.content.image[0] !== null){
                let image_url = params.server+"/regular/image/post/"+this.props.post.content.image[0]
                this.setState({
                    intergration: <img src={image_url} alt="post" />
                })
            } else {
                let words = text.split(/ |[\r]/);
                console.log(words);
                words.forEach(word => {
                    if(word.match(this.ytb_match)){
                        
                        let video_id = word.split("=")[1] || word.split("/")[word.split('/').length -1]
                        let video_url = "https://www.youtube.com/embed/"+video_id;

                        this.setState({
                            intergration: <iframe 
                            title={'Youtube video'}
                            src={video_url} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen={true}/>
                        })      
                        return

                    }
                })
            }
        }
    }

    componentDidMount() {
        this.HandleIntegration(this.props.post.content.text);
    }

    // Change time to readable format
    time_format(diff){
        
        let week = 604800000;
        let day = 86400000;
        let hour = 3600000;
        let minute = 60000;

        let weeks = Math.floor(diff/week);
        let days = Math.floor(diff/day);
        let hours = Math.floor(diff/hour);
        let minutes = Math.floor(diff/minute);


        if(weeks > 0){
            return weeks + " weeks ago";
        }else if(days > 0){
            return days + " days ago";
        } else if(hours > 0){
            return hours + " hours ago";
        } else if(minutes > 0){
            return minutes + " minutes ago";
        } else {
            return "Just now";
        }
    }

    delete_post(){
        axios.post(params.server+"/post/delete_post", 
        {
            id: this.props.id,
        }).then(res => {
            this.setState({
                deleted: true
            })
        })
    }

    Content(){
        return(
            <div className="content" onClick={() => this.show_reply()}>
                        
                <div className="text">
                    {this.props.text !== "null"?
                        <p>
                            <Text text={this.props.post.content.text} />
                        </p>
                    :<></>}
                </div>
                
                {this.state.intergration?
                    <div className='integration'>
                        {this.state.intergration}
                    </div>
                :<></>}
            </div>
        )
    }

    close_popup(){
        this.setState({
            popup: false
        })
    }

    render(){
            return(
                <>
                {!this.state.deleted?
                <div className={this.state.post_class} onDoubleClick={() => this.vote(true)} >
                    <div className="post-header">
                        <img className="account" src={getPP(this.props.post.auth.profile_picture)} alt='profil'/>
                        <span className="surname">{this.props.post.auth.surname}</span>
                        <Link to={'/account/'+this.props.post.auth._id} className='name'>
                            @{this.props.post.auth.name}
                        </Link>
                        <span className="time-ago">{this.time_format(this.props.post.time_ago)}</span>
                        <span className="score unsafe">{this.props.post.auth.ranking.score}🔥</span>
                    </div>
                    {this.props.redirect?
                    <Link to={'/post/'+this.props.id}>
                        <this.Content />
                    </Link>
                    :
                        <this.Content />
                    }
                    <div className='interaction'>
                        <div className="fame">
                            <RequireLoggedIn>
                                <div className="arrows">
                                    <Arrow className={'up '+this.state.up} onClick={() => this.vote(true)}/>
                                    <Arrow className={"down "+this.state.down} onClick={() => this.vote(false)}/>
                                </div>
                            </RequireLoggedIn>
                            <span className="score">{this.state.score}</span> 
                        </div>
                        
                    </div>
                    <div className="interaction-bottom">
                            <IoMdShareAlt onClick={() => {
                            toast.success('Link copied to clipboard !', {
                                position: "bottom-center",
                                autoClose: 1300,
                                hideProgressBar: true,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                            });
                            navigator.clipboard.writeText("https://www.hydder.com/"+this.props.id)}} />

                            {this.props.self? 
                            <>  
                                <div className="delete">
                                    <span className="delete" onClick={() => this.setState({
                                        popup: true
                                    })}>delete</span>
                                </div>
                                
                                {this.state.popup?
                                    <Confirm
                                        onClose={() => this.close_popup()}
                                        onConfirm={() => this.delete_post()} 
                                    >
                                        <div>
                                            <p className="confirm_delete">Are you sure you want to delete this post?</p>
                                        </div>
                                    </Confirm>
                                :null}
                            </>
                            :null}
                    </div>
                    {this.state.show_reply && this.props.connected?
                        <Reply user={this.props.user} connected={this.props.connected}  ref={this.reply} id={this.props.id} key={this.props.id + "reply"} level={this.props.level} />
                    :null}

                </div>
                :null}
                </>
            )
        }
}

/*
catch(err){
            console.log(err)
            return(
                <div className="post-error">
                    <span className="error">Post deleted ... 😢</span>
                </div>
            )
        }
    }
*/
export default Post;