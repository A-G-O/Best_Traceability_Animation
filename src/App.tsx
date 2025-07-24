import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { supplyChainNodes } from './data/supplyChain';
import { AnimationState, AnimationSpeed } from './types';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const mapRef = useRef<any>(null);
  const [animationState, setAnimationState] = useState<AnimationState>({
    currentStage: 0,
    isAnimating: false,
    isPaused: false,
    speed: 1,
    stageStartTime: 0,
    stageDuration: 4000
  });

  const startJourney = () => {
    setAnimationState(prev => ({
      ...prev,
      isAnimating: true,
      currentStage: 0,
      stageStartTime: Date.now()
    }));
    
    // Start the animation sequence
    animateToStage(0);
  };

  const animateToStage = (stageIndex: number) => {
    if (stageIndex >= supplyChainNodes.length) {
      // Journey complete
      setAnimationState(prev => ({ ...prev, isAnimating: false }));
      return;
    }

    const node = supplyChainNodes[stageIndex];
    
    // Fly to location
    if (mapRef.current) {
      mapRef.current.flyTo(node.coordinates, 6, { duration: 2 });
    }

    // Update current stage
    setAnimationState(prev => ({ ...prev, currentStage: stageIndex }));

    // Schedule next stage
    setTimeout(() => {
      animateToStage(stageIndex + 1);
    }, animationState.stageDuration / animationState.speed);
  };

  const resetJourney = () => {
    setAnimationState(prev => ({
      ...prev,
      isAnimating: false,
      isPaused: false,
      currentStage: 0
    }));
    
    if (mapRef.current) {
      mapRef.current.setView([20, 40], 3);
    }
  };

  return (
    <div className="app">
      {/* Title Card */}
      <motion.div 
        className="title-card glass-panel"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="gradient-text">Global T-Shirt Supply Chain</h1>
        <p>From Farm to Store</p>
      </motion.div>

      {/* Map Container */}
      <MapContainer
        ref={mapRef}
        center={[20, 40]}
        zoom={3}
        className="map-container"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          className="custom-tiles"
        />
        
        {/* Supply Chain Markers */}
        {supplyChainNodes.map((node, index) => (
          <Marker
            key={node.id}
            position={node.coordinates}
            icon={new Icon({
              html: `
                <div class="supply-marker ${index <= animationState.currentStage ? 'active' : ''}" 
                     style="background: ${index <= animationState.currentStage ? node.color : '#fff'}">
                  <span class="marker-icon">${node.icon}</span>
                </div>
              `,
              className: 'custom-marker',
              iconSize: [50, 50],
              iconAnchor: [25, 25]
            })}
          />
        ))}

        {/* Connection Lines */}
        {supplyChainNodes.slice(0, -1).map((node, index) => (
          <Polyline
            key={`line-${index}`}
            positions={[node.coordinates, supplyChainNodes[index + 1].coordinates]}
            color={index < animationState.currentStage ? supplyChainNodes[index + 1].color : 'rgba(255,255,255,0.3)'}
            weight={index < animationState.currentStage ? 4 : 2}
            opacity={index < animationState.currentStage ? 0.8 : 0.3}
          />
        ))}
      </MapContainer>

      {/* Control Panel */}
      <motion.div 
        className="control-panel glass-panel"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {!animationState.isAnimating ? (
          <motion.button 
            className="btn btn-primary"
            onClick={startJourney}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Journey
          </motion.button>
        ) : (
          <motion.button 
            className="btn btn-secondary"
            onClick={resetJourney}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        )}
        
        <div className="speed-control">
          <span>Speed: {animationState.speed}x</span>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        className="progress-container glass-panel"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
            animate={{ 
              width: `${((animationState.currentStage + 1) / supplyChainNodes.length) * 100}%` 
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="progress-text">
          {Math.round(((animationState.currentStage + 1) / supplyChainNodes.length) * 100)}%
        </span>
      </motion.div>

      {/* Flow Panel */}
      <motion.div 
        className="flow-panel glass-panel"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {supplyChainNodes.map((node, index) => (
          <motion.div
            key={node.id}
            className={`flow-item ${
              index === animationState.currentStage ? 'active' : 
              index < animationState.currentStage ? 'completed' : 'pending'
            }`}
            animate={{
              x: index === animationState.currentStage ? 10 : 0
            }}
          >
            <div className="flow-icon" style={{ color: node.color }}>
              {node.icon}
            </div>
            <div className="flow-content">
              <h4>{node.name}</h4>
              <p>{node.location}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Tier Display */}
      <AnimatePresence>
        {animationState.isAnimating && (
          <motion.div
            className="tier-display glass-panel"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ delay: 1.5 }}
          >
            <h3>Tier {supplyChainNodes[animationState.currentStage]?.tier}</h3>
            <p>{supplyChainNodes[animationState.currentStage]?.name}</p>
            <p>{supplyChainNodes[animationState.currentStage]?.location}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;