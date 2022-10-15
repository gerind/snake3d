import React, { useEffect, useRef, useState } from 'react'
import { World } from './World/World'

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fps, setFps] = useState(0)

  useEffect(() => {
    const world = new World(containerRef.current!)

    world.fpsHandler = setFps

    world.start()
  }, [])

  return <div className="container" ref={ containerRef }>
    <div className="fps">FPS: {fps}</div>
    <div className="shadow_info">Press E to turn shadows on/off</div>
    <div className="texture_info">Press T to turn textures on/off</div>
  </div>
}

export default App
