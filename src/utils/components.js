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


export function Confirm (props) {

  const handleConfirm = () => {
      // execute the function passed in as props.onConfirm
      props.onConfirm();
      // return to the parent component
      props.onClose()
  }

  return (
      <div className="confirm_my_choice">
          <>
              {props.children}
          </>
          <span className="cancel" onClick={() => props.onClose()}>Nop</span>
          <span className="confirm" onClick={() => handleConfirm()}>Confirm</span>
      </div>
  )
}

export const RequireLoggedIn = connect(mapStateToProps)(requireLoggedIn);