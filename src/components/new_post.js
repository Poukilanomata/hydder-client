import React from "react"

//import utils
import params from "../variables"
import { RequireLoggedIn } from "../utils/components"

//import svg
import { ReactComponent as Loader } from '../svg/loader-infinite.svg'
import { ReactComponent as Cross } from '../svg/cross-sign.svg'
import { ReactComponent as Send } from '../svg/send.svg'

import { MdImage } from "react-icons/md"

//import components
import TextareaAutosize from 'react-textarea-autosize'

import axios from "axios";

//import store
import { connect } from 'react-redux'
import { newPost } from '../app/content'

axios.defaults.withCredentials = true

// Components
class Newpost extends React.Component {

    constructor(props) {
        super(props)
        this.handleTextarea = this.handleTextarea.bind(this);
        this.state = {
            text: '',
            formdata: new FormData(),
            original_file: null,
            final_file: null,
            final_filename: null,

            processing_image: false,
            sendable: true,
        }

        //ref
        this.textarea = React.createRef();
        this.file = React.createRef();
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
        // 5 Mo
        if(image && image.size < 5242880){
            this.handleImage(image)
        }
    }

    handleDrop = (evt) => {
        this.removeImage()
        evt.preventDefault();
        evt.stopPropagation();
  
        if(evt.dataTransfer.items) {
          var file = evt.dataTransfer.items[0].getAsFile();
            
          if(file.size < 5242880){
            this.handleImage(file)
          }
        }
      }

    
      handleTextarea = (evt) => {
        this.setState({text: evt.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.state.formdata.delete('text')
        this.state.formdata.append('text', this.state.text)

        this.state.formdata.delete('origin')
        this.state.formdata.append('origin', 'root')
        

        if(this.state.text.length > 0 && this.state.sendable === true && this.props.user.isLoaded){

            this.setState({
                sendable: false
            })

            axios.post(params.server+'/post/new_post', this.state.formdata).then(
                (res) => {
                    this.setState({
                        sendable: true
                    })

                    if(res.data.success) {
                        this.props.newPost({
                            content:{
                                text: this.state.text,
                                image: res.data.content.image
                            },
                            auth:  this.props.user.user,
                            id: res.data.id
                        })

                        this.setState({
                            text: '',
                            original_file: null,
                            final_file: null,
                            final_filename: null,
                            sendable: true
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

    removeImage = () => {
        this.setState({
            original_file: null,
            final_file: null,
            final_filename: null,
            processing_image: false
        })

        this.state.formdata.delete('imagepost')
    }

    render() {
        return(
            <div 
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
            } className="newpost">
                <div className="left">
                    <input
                        type="file"
                        name="image"
                        id="image"
                        accept=".jpg, .jpeg, .png, .gif, .webp, .tiff, .jfif"
                        onChange={(e) => this.handleImageUpload(e)}
                        style={{display: 'none'}}
                        ref={this.file}
                    />
                    <label htmlFor="image">
                        <MdImage />
                    </label>
                </div>
                

                <TextareaAutosize 
                    ref={this.textarea}
                    minRows={4} 
                    maxRows={10} 
                    maxLength={1000}
                    placeholder='Enter the story 👑 ...'
                    style={{overflow: "hidden"}}
                    onChange={this.handleTextarea}
                    autoFocus
                />
                <output>
                    {this.state.final_filename ? 
                        <>
                        <img src={this.state.final_filename} alt=""/>
                        <Cross onClick={this.removeImage} className='close'/>
                        </>
                    : null}

                    {this.state.processing_image ? <Loader className='loader'/> : null}
                </output>
                <RequireLoggedIn>
                    <div className="submit" onClick={this.handleSubmit}>
                        <span>Let's go !</span>
                        <Send />
                    </div>
                </RequireLoggedIn>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth
    }
}

// connect to redux
const mapDispatchToProps = {
    newPost
}

export default connect(mapStateToProps, mapDispatchToProps)(Newpost);