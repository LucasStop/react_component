import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { DNABase } from '../store/dnaStore';

interface Props {
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  baseType: DNABase;
  active: boolean;
  onComplete: () => void;
}

// Mapeamento de cores para as bases do DNA
const baseColors = {
  A: '#FF5722', // Adenina - Laranja
  T: '#2196F3', // Timina - Azul
  C: '#4CAF50', // Citosina - Verde
  G: '#FFC107', // Guanina - Amarelo
};

const ParticleContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
`;

const Particle = styled(motion.div)<{ color: string }>`
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${props => props.color};
  box-shadow:
    0 0 10px ${props => props.color},
    0 0 20px ${props => props.color};
`;

// Adicionar algumas partículas secundárias para efeito visual
const SecondaryParticle = styled(motion.div)<{ color: string; size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background-color: ${props => props.color};
  box-shadow: 0 0 5px ${props => props.color};
  opacity: 0.7;
`;

const ParticleEffect: React.FC<Props> = ({
  sourcePosition,
  targetPosition,
  baseType,
  active,
  onComplete,
}) => {
  const controls = useAnimation();
  const secondaryControls = useAnimation();
  const [secondaryParticles, setSecondaryParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    if (active) {
      // Criar partículas secundárias aleatórias
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50, // Deslocamento aleatório em x
        y: Math.random() * 100 - 50, // Deslocamento aleatório em y
        size: Math.random() * 6 + 3, // Tamanho aleatório
        delay: Math.random() * 0.3, // Atraso aleatório
      }));
      setSecondaryParticles(newParticles);

      // Animação principal
      controls
        .start({
          x: targetPosition.x,
          y: targetPosition.y,
          transition: {
            duration: 1,
            ease: 'easeOut',
          },
        })
        .then(onComplete);

      // Animação das partículas secundárias
      secondaryControls.start({
        opacity: [0, 1, 0],
        scale: [0.2, 1, 0.2],
        transition: { duration: 1.5 },
      });
    }
  }, [active, sourcePosition, targetPosition, controls, secondaryControls, onComplete]);

  if (!active) return null;

  return (
    <ParticleContainer>
      <Particle
        color={baseColors[baseType]}
        initial={{
          x: sourcePosition.x,
          y: sourcePosition.y,
          scale: 0.5,
          opacity: 0.8,
        }}
        animate={controls}
        transition={{
          type: 'spring',
          stiffness: 100,
          duration: 1,
        }}
      />

      {secondaryParticles.map(particle => (
        <SecondaryParticle
          key={particle.id}
          color={baseColors[baseType]}
          size={particle.size}
          initial={{
            x: sourcePosition.x,
            y: sourcePosition.y,
            scale: 0.2,
            opacity: 0,
          }}
          animate={{
            x: sourcePosition.x + particle.x,
            y: sourcePosition.y + particle.y,
            opacity: [0, 0.8, 0],
            scale: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 0.8,
            delay: particle.delay,
          }}
        />
      ))}
    </ParticleContainer>
  );
};

export default ParticleEffect;
