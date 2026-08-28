import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const TechStackPhysics = () => {
  const sceneRef = useRef(null);
  const [pillPositions, setPillPositions] = useState([]);

  const techItems = [
    'React 18', 'React Router', 'Custom CSS', 
    'Context API', 'localStorage', 'Wikipedia API', 
    'NASA APOD', 'Datepicker'
  ];

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: 400,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    });

    const width = sceneRef.current.clientWidth;
    const height = 400;
    const wallOptions = { isStatic: true, render: { visible: false } };
    
    // Walls to keep them in the TV screen area mostly
    const ground = Matter.Bodies.rectangle(width / 2, height + 30, width, 60, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-30, height / 2, 60, height, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 30, height / 2, 60, height, wallOptions);

    const bodies = techItems.map((text) => {
      const x = Math.random() * (width - 150) + 75;
      const y = -Math.random() * 500 - 50;
      
      return Matter.Bodies.rectangle(x, y, 140, 40, {
        chamfer: { radius: 20 },
        restitution: 0.7,
        friction: 0.1,
        label: text,
        render: {
          fillStyle: 'rgba(56, 189, 248, 0.1)',
          strokeStyle: '#38bdf8',
          lineWidth: 1
        }
      });
    });

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    render.mouse = mouse;

    Matter.World.add(engine.world, [ground, leftWall, rightWall, ...bodies, mouseConstraint]);

    const runner = Matter.Runner.create();
    
    // --- RESPAWN LOGIC START ---
    Matter.Events.on(engine, 'afterUpdate', () => {
      const centerX = width / 2;
      const centerY = height / 2;
      const respawnThreshold = 600; // Distance from center to trigger respawn

      bodies.forEach(body => {
        const dist = Math.hypot(body.position.x - centerX, body.position.y - centerY);
        
        // If thrown too far OR fell below the ground significantly
        if (dist > respawnThreshold || body.position.y > height + 100) {
          // Reset position to top of screen
          Matter.Body.setPosition(body, {
            x: Math.random() * (width - 150) + 75,
            y: -50
          });
          
          // Reset velocity and angle so it falls nicely again
          Matter.Body.setVelocity(body, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(body, 0);
          Matter.Body.setAngle(body, 0);
        }
      });

      // Update React state for rendering text labels
      const positions = bodies.map(body => ({
        id: body.label,
        x: body.position.x,
        y: body.position.y,
        angle: body.angle
      }));
      setPillPositions(positions);
    });
    // --- RESPAWN END ---

    Matter.Engine.run(engine);
    Matter.Render.run(render);
    Matter.Runner.run(runner, engine);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      if (render.canvas) render.canvas.remove();
    };
  }, []);

  return (
    <div ref={sceneRef} style={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden' }}>
      {pillPositions.map((pos) => (
        <div
          key={pos.id}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            transform: `translate(-50%, -50%) rotate(${pos.angle}rad)`,
            pointerEvents: 'none',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.85rem',
            color: '#e2e8f0',
            whiteSpace: 'nowrap',
            fontWeight: 600,
            userSelect: 'none',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {pos.id}
        </div>
      ))}
    </div>
  );
};

export default TechStackPhysics;