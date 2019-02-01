import React from 'react'
import { findDOMNode } from 'react-dom'

import ID from './ID'

class Image extends React.Component {
  ref = React.createRef()
  id = ID()

  state = {}

  messageHandler = event => {
    if (event.data) {
      switch (event.data.type) {
        case 'IMG_SIZE_QUERY': {
          if (event.data.id === this.id) {
            const node = findDOMNode(this.ref.current)

            const size = node.getBoundingClientRect()

            event.ports[0].postMessage(size)
          } else if (!event.data.id) {
            event.ports[0].postMessage(null)
          }
          break
        }
        case 'IMG_QUERY':
          if (event.data.id === this.id) {
            this.setState({ ...event.data })
          }
          break
        case 'IMG_QUERY_SUCCESS':
          if (event.data.id === this.id) {
            this.setState({ status: 'success' })
          }
          break
        case 'IMG_QUERY_FAILURE':
          if (event.data.id === this.id) {
            this.setState({ status: 'failure' })
          }
          break
        default:
          break
      }
    }
  }

  componentWillMount() {
    navigator.serviceWorker.addEventListener('message', this.messageHandler)
  }

  componentWillUnmount() {
    navigator.serviceWorker.removeEventListener('message', this.messageHandler)
  }

  render() {
    const { props, id } = this
    const {
      originalUrl,
      resolvedUrl,
      width,
      detectedWidth,
      status
    } = this.state

    const src = `${props.src}${
      props.src.indexOf('?') !== -1 ? '&' : '?'
    }__id=${id}`

    return (
      <figure>
        <img alt="" {...props} ref={this.ref} src={src} />
        <figcaption>
          <ul>
            <li>Original url: {originalUrl}</li>
            <li>Resolved url: {resolvedUrl}</li>
            <li>Detected width: {detectedWidth}</li>
            <li>Requested width: {width}</li>
            <li>Status: {status}</li>
          </ul>
        </figcaption>
      </figure>
    )
  }
}

export default Image
