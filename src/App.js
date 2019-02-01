import React from 'react'

import Image from './Image'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Image src="nf.jpg" style={{ width: '80vw' }} alt="nf" />
        <Image src="dog.jpg" style={{ width: '80vw' }} alt="dog" />
      </header>
    </div>
  )
}

export default App
