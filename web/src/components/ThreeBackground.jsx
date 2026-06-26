import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

// INTERACTIVE 3D CYBERPUNK BACKGROUND
// Visible ONLY behind hero section
export default function ThreeBackground() {
  const containerRef = useRef()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    // CYBERPUNK COLORS
    const colors = [0x00f5ff, 0xff00ff, 0xffff00]
    
    // ELITE GEOMETRY - Icosahedron particles
    const geometry = new THREE.IcosahedronGeometry(0.5, 0)
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00f5ff,
      wireframe: true
    })
    
    const particles = []
    for (let i = 0; i < 100; i++) {
      const mesh = new THREE.Mesh(geometry, material.clone())
      mesh.scale.setScalar(Math.random() * 2)
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      )
      scene.add(mesh)
      particles.push(mesh)
    }

    // ANIMATION
    let frame = requestAnimationFrame(function animate() {
      frame = requestAnimationFrame(animate)
      
      particles.forEach((p, i) => {
        p.rotation.x += 0.005
        p.rotation.y += 0.01
        p.position.y += Math.sin(Date.now() * 0.001 + i) * 0.005
      })
      
      renderer.render(scene, camera)
    })

    // CLEANUP
    return () => {
      cancelAnimationFrame(frame)
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  )
}
