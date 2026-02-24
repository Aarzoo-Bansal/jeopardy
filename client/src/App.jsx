import { useState } from 'react'
import JeopardyGame from './components/JeopardyGame'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div>
      <JeopardyGame />
     </div>
    </>
  )
}

export default App
