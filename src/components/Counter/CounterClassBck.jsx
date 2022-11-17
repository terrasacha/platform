import React, { Component } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { decrement, increment } from '../../_store/counterSliceReducer'

// const dispatch = new useDispatch()

export default class Counter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            count: new useSelector((state) => state.counter.value),
            dispatch: new useDispatch()
        }
    }

    render() {
        return (
            <div>
              <div>
                <button
                  aria-label="Increment value"
                  onClick={() => this.state.dispatch(increment())}
                >
                  Increment
                </button>
                <span>{this.state.count}</span>
                <button
                  aria-label="Decrement value"
                  onClick={() => this.state.dispatch(decrement())}
                >
                  Decrement
                </button>
              </div>
            </div>
          )
    }
}
