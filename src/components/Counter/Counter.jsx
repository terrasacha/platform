import React, { Component } from 'react';
import { connect } from 'react-redux';
import { decrement, increment } from '../../_store/counterSliceReducer';

// const dispatch = new useDispatch()

const mapDispatchToProps = {
    increment, 
    decrement
};

const mapStateToProps = state => {
  return{
    counter: state.counter.value
  }
};

class Counter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: null,
            dispatch: null
        }
    }

    // RENDER
    render() {
        return (
            <div>
              <div>
                <button
                  aria-label="Increment value"
                  onClick={() => this.props.increment()}
                >
                  Increment
                </button>
                <span>{this.props.counter}</span>
                <button
                  aria-label="Decrement value"
                  onClick={() => this.props.decrement()}
                >
                  Decrement
                </button>
              </div>
            </div>
          )
    }
}


export default connect(mapStateToProps, mapDispatchToProps )(Counter)