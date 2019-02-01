import React from 'react'

import Image from './Image'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Image src="dog.jpg" style={{ width: '80vw' }} alt="dog" />
        <Image src="sample.jpg" width="600" alt="sample" />
      </header>
    </div>
  )
}

export default App
