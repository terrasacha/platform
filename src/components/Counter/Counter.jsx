import React, { Component } from 'react'
import { useDispatch, connect } from 'react-redux'
import { decrement, increment } from '../../_store/counterSliceReducer'

// const dispatch = new useDispatch()

const mapDispatchToProps = () => ({ 
  increment, 
  decrement
});

const mapStateToProps = state => ({
  counter: state.counter
});

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
                  onClick={() => this.props.dispatch(increment())}
                >
                  Increment
                </button>
                <span>{this.props.count}</span>
                <button
                  aria-label="Decrement value"
                  // onClick={() => this.state.dispatch(decrement())}
                >
                  Decrement
                </button>
              </div>
            </div>
          )
    }
}


export default connect(mapDispatchToProps, mapStateToProps)(Counter)