import React from 'react';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom"

// import redux for function
import { connect } from 'react-redux';

class requireLoggedIn extends React.Component {
  render() {
    if (this.props.isLoggedIn) {
      return this.props.children;
    } else {
    const clones = React.Children.map(this.props.children, child => {
        return React.cloneElement(child, { style: {pointerEvents: 'none'} });
    });
      return(
          <Link to={'/login'}>
              {clones}
          </Link>
      )
    }
  }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    };
}

export const RequireLoggedIn = connect(mapStateToProps)(requireLoggedIn);