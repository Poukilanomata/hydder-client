import React from "react";

import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";

import { connect } from "react-redux";

import { getPP } from "../utils/functions";

import {ReactComponent as Search} from '../svg/search.svg';

import { HiHome } from "react-icons/hi";

class Header extends React.Component{
    render() {
        return(
            <div className="header">
                <div className="header-left">
                    {this.props.user?
                        <Link to={'/account/'+this.props.user._id}>
                            <img src={getPP(this.props.user.profile_picture)} alt=""/>
                        </Link>
                    :null}
                    <Link to='/'>
                        <HiHome/>
                    </Link>
                    
                </div>
                <div className="search">
                    <input type="text" placeholder="Search for the best..." maxLength={50} minLength={1}/>
                    <div className="container">
                        <Search />
                    </div>
                </div>
                <div className="header-right">
                    {!this.props.isLoggedIn?
                        <Link to={'/login'}>
                            <span>Login !</span>
                        </Link>
                    :
                        null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
        user: state.auth.user
    }
}

export default connect(mapStateToProps)(Header);

