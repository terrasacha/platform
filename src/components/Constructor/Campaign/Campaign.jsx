import React from 'react'
import { useParams } from 'react-router'
export default function Campaign() {
    const {id} = useParams();
  return (
    <div>Campaign {id}</div>
  )
}
