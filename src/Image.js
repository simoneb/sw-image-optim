import React from 'react'
import { findDOMNode } from 'react-dom'

class Image extends React.Component {
  ref = React.createRef()
  id = Date.now()

  handler = event => {
    if(event.data && event.data.type === 'IMG_SIZE_QUERY') {
      if(event.data.id === this.id) {
      const node = findDOMNode(this.ref.current)

      const size = node.getBoundingClientRect()

      event.ports[0].postMessage(size)
      } else {
        event.ports[0].postMessage('')
      }
    }
  }

  componentWillMount() {
    navigator.serviceWorker.addEventListener('message', this.handler)
  }

  componentWillUnmount() {
    navigator.serviceWorker.removeEventListener('message', this.handler)
  }

  render()  {
    const { props, id } = this
  
    return (
      <img {...props} alt="alt" ref={this.ref} src={props.src + `?id=${id}`} />
    )
  }
}

export default Image
