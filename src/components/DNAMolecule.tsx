import { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import DNABasePair from './DNABasePair';
import ParticleEffect from './ParticleEffect';
import { useDNAStore, DNABase } from '../store/dnaStore';

const DNAContainer = styled.div`
  position: relative;
  width: 400px;
  height: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DNAHelix = styled(motion.div)`
  position: relative;
  width: 350px;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
`;

const DNAStrand = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const BackboneLeft = styled(motion.div)`
  position: absolute;
  width: 10px;
  height: 350px;
  left: 70px;
  top: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  border-radius: 5px;
`;

const BackboneRight = styled(motion.div)`
  position: absolute;
  width: 10px;
  height: 350px;
  right: 70px;
  top: 0;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.1)
  );
  border-radius: 5px;
`;

const ControlPanel = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`;

const Button = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #61dafb;
  color: white;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #3bb7d9;
  }
`;

const SpeedControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const SpeedLabel = styled.span`
  color: white;
  font-size: 0.9rem;
`;

const DNAMolecule: React.FC = () => {
  const dnaSequence = useDNAStore(state => state.dnaSequence);
  const mutateDNA = useDNAStore(state => state.mutateDNA);
  const resetDNA = useDNAStore(state => state.resetDNA);

  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(20); // segundos por rotação
  const [particleEffect, setParticleEffect] = useState<{
    active: boolean;
    sourcePosition: { x: number; y: number };
    baseType: DNABase;
  } | null>(null);

  const avatarRef = useRef<HTMLDivElement>(null);

  // Função para lidar com a mutação do DNA
  const handleMutation = (pairId: number, newTop: DNABase, newBottom: DNABase) => {
    mutateDNA(pairId, newTop, newBottom);
  };

  // Função para lidar com o efeito de partículas
  const handleParticleEffect = (sourcePosition: { x: number; y: number }, baseType: DNABase) => {
    // Encontrar o alvo (avatar)
    if (avatarRef.current) {
      setParticleEffect({
        active: true,
        sourcePosition,
        baseType,
      });
    }
  };

  // Função para lidar com a conclusão do efeito de partículas
  const handleParticleComplete = () => {
    setParticleEffect(null);
  };

  // Animação para rotação contínua da hélice
  const rotateAnimation = {
    rotateY: isRotating ? 360 : 0,
  };

  // Obtenha a posição do avatar para o efeito de partículas
  const getAvatarPosition = () => {
    if (avatarRef.current) {
      const avatarRect = document.querySelector('.avatar-target')?.getBoundingClientRect();
      if (avatarRect) {
        return {
          x: avatarRect.left + avatarRect.width / 2,
          y: avatarRect.top + avatarRect.height / 2,
        };
      }
    }
    return { x: window.innerWidth / 2, y: window.innerHeight / 3 };
  };

  // Ajustar a velocidade de rotação
  const handleSpeedChange = (faster: boolean) => {
    setRotationSpeed(prev => {
      const newSpeed = faster ? Math.max(5, prev - 5) : Math.min(40, prev + 5);
      return newSpeed;
    });
  };

  return (
    <div>
      <DNAContainer>
        <DNAHelix
          animate={rotateAnimation}
          transition={{
            duration: rotationSpeed,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <BackboneLeft
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />

          <BackboneRight
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />

          <DNAStrand>
            {dnaSequence.map((pair, index) => (
              <DNABasePair
                key={pair.id}
                pair={pair}
                index={index}
                onMutate={handleMutation}
                triggerParticleEffect={handleParticleEffect}
              />
            ))}
          </DNAStrand>
        </DNAHelix>

        {/* Elemento de referência para o avatar */}
        <div
          ref={avatarRef}
          className="avatar-target"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            opacity: 0,
          }}
        />

        {/* Efeito de partículas */}
        {particleEffect && (
          <ParticleEffect
            sourcePosition={particleEffect.sourcePosition}
            targetPosition={getAvatarPosition()}
            baseType={particleEffect.baseType}
            active={particleEffect.active}
            onComplete={handleParticleComplete}
          />
        )}
      </DNAContainer>

      <ControlPanel>
        <Button
          onClick={() => setIsRotating(!isRotating)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isRotating ? 'Pausar Rotação' : 'Continuar Rotação'}
        </Button>

        <Button onClick={resetDNA} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Reiniciar DNA
        </Button>

        <SpeedControls>
          <SpeedLabel>Velocidade:</SpeedLabel>
          <Button
            onClick={() => handleSpeedChange(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            +
          </Button>
          <Button
            onClick={() => handleSpeedChange(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            -
          </Button>
        </SpeedControls>
      </ControlPanel>
    </div>
  );
};

export default DNAMolecule;
