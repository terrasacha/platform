import React, { Component } from "react";
import s from  "./Button.module.css";

class Button extends Component {
        constructor(props) {
        super(props)
        this.state = {
            isActive: false
        }
    }
    
    handleClick = () => {
        this.props.handleButtonClick(this.props.id);
    };
    componentDidMount(){
    }
    componentDidUpdate(prevProps){
        if(prevProps.activeButton !== this.props.activeButton){
            const isActive = this.props.activeButton === this.props.id;
            if(isActive){
                console.log('active true')
                return this.setState({isActive: true})
            }else{
                return this.setState({isActive: false})
            }
        }
    }
    render(){
        return(
            <button
                className={this.state.isActive ? s.active : s.normal}
                onClick={() => this.props.handleButtonClick(this.props.id)}
            >
                {this.props.label}
            </button>
        )
    }
  }

export default Button
  