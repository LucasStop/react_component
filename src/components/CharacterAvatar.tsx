import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useDNAStore } from '../store/dnaStore';
import ParticleEffect from './ParticleEffect';

const AvatarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const AvatarTitle = styled.h2`
  margin-bottom: 1rem;
  color: #61dafb;
`;

const AvatarFrame = styled.div`
  position: relative;
  width: 280px;
  height: 400px;
  border-radius: 16px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const AvatarSVG = styled(motion.svg)`
  width: 100%;
  height: 100%;
`;

const TraitsList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-top: 1.5rem;
  text-align: left;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 100%;
`;

const TraitItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const TraitLabel = styled.span`
  font-size: 0.8rem;
  color: #ccc;
`;

const TraitValue = styled(motion.span)`
  font-weight: bold;
  color: #61dafb;
`;

const EffectOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
`;

const CharacterAvatar: React.FC = () => {
  const traits = useDNAStore(state => state.traits);
  const mutations = useDNAStore(state => state.mutations);

  const [previousTraits, setPreviousTraits] = useState(traits);
  const [animatingTrait, setAnimatingTrait] = useState<string | null>(null);
  const [overlayEffect, setOverlayEffect] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [particleInfo, setParticleInfo] = useState({
    sourcePos: { x: 0, y: 0 },
    targetPos: { x: 0, y: 0 },
    baseType: 'A' as 'A' | 'T' | 'C' | 'G',
  });

  const hairControls = useAnimation();
  const eyesControls = useAnimation();
  const bodyControls = useAnimation();
  const overlayControls = useAnimation();

  // Refs para os elementos do avatar
  const avatarRef = useRef<HTMLDivElement>(null);

  // Detecção de mudanças nos traços para acionar animações
  useEffect(() => {
    const changedTraits: string[] = [];

    // Verificar quais traços mudaram
    Object.keys(traits).forEach(key => {
      if (previousTraits[key as keyof typeof traits] !== traits[key as keyof typeof traits]) {
        changedTraits.push(key);
      }
    });

    if (changedTraits.length > 0 && mutations.length > 0) {
      // Animar o traço que mudou
      setAnimatingTrait(changedTraits[0]);

      // Obter o efeito visual da última mutação
      let effectName = '';

      // Animar componentes específicos com base no traço alterado
      switch (changedTraits[0]) {
        case 'eyeColor':
          eyesControls.start({
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
            transition: { duration: 0.5 },
          });
          effectName = traits.eyeColor === 'blue' ? 'fade-pulse' : 'fade-pulse-reverse';
          setParticleInfo({
            sourcePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            targetPos: { x: window.innerWidth / 2, y: window.innerHeight / 3 },
            baseType: traits.eyeColor === 'blue' ? 'A' : 'G',
          });
          break;
        case 'hairColor':
          hairControls.start({
            y: [0, -10, 0],
            transition: { duration: 0.5 },
          });
          effectName = traits.hairColor === 'blonde' ? 'color-shift' : 'color-shift-reverse';
          setParticleInfo({
            sourcePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            targetPos: { x: window.innerWidth / 2, y: window.innerHeight / 4 },
            baseType: traits.hairColor === 'blonde' ? 'T' : 'C',
          });
          break;
        case 'skinTone':
          bodyControls.start({
            opacity: [1, 0.7, 1],
            transition: { duration: 0.7 },
          });
          effectName = 'tone-darken';
          setParticleInfo({
            sourcePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            targetPos: {
              x: window.innerWidth / 2,
              y: window.innerHeight / 2.5,
            },
            baseType: 'G',
          });
          break;
        case 'height':
          bodyControls.start({
            scaleY: [1, 1.1, 1],
            y: [0, -10, 0],
            transition: { duration: 0.7 },
          });
          effectName = 'grow-up';
          setParticleInfo({
            sourcePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            targetPos: {
              x: window.innerWidth / 2,
              y: window.innerHeight / 1.8,
            },
            baseType: 'T',
          });
          break;
        case 'bodyType':
          bodyControls.start({
            scaleX: [1, 1.1, 1],
            transition: { duration: 0.7 },
          });
          effectName = traits.bodyType === 'slim' ? 'stretch-vertical' : 'expand-width';
          setParticleInfo({
            sourcePos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            targetPos: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
            baseType: traits.bodyType === 'slim' ? 'A' : 'C',
          });
          break;
      }

      setOverlayEffect(effectName);

      // Mostrar o efeito de partículas
      setShowParticles(true);

      // Animação do overlay
      overlayControls.start({
        opacity: [0, 0.7, 0],
        scale: [0.95, 1.05, 1],
        transition: { duration: 1 },
      });

      // Atualizar os traços anteriores após a animação
      setTimeout(() => {
        setPreviousTraits(traits);
        setAnimatingTrait(null);
        setOverlayEffect(null);
        setShowParticles(false);
      }, 1000);
    }
  }, [
    traits,
    previousTraits,
    mutations,
    eyesControls,
    hairControls,
    bodyControls,
    overlayControls,
  ]);

  // Efeito para posicionar o elemento para o efeito de partículas
  useEffect(() => {
    if (avatarRef.current) {
      const targetElement = document.createElement('div');
      targetElement.className = 'avatar-target';
      targetElement.style.position = 'absolute';
      targetElement.style.top = '50%';
      targetElement.style.left = '50%';
      targetElement.style.width = '1px';
      targetElement.style.height = '1px';

      avatarRef.current.appendChild(targetElement);

      return () => {
        if (avatarRef.current && avatarRef.current.contains(targetElement)) {
          avatarRef.current.removeChild(targetElement);
        }
      };
    }
  }, []);

  // Renderizar diferentes overlays de efeito com base no efeito atual
  const renderOverlayEffect = () => {
    if (!overlayEffect) return null;

    switch (overlayEffect) {
      case 'fade-pulse':
        return (
          <EffectOverlay
            animate={overlayControls}
            style={{
              background:
                'radial-gradient(circle, rgba(33, 150, 243, 0.4) 0%, rgba(0, 0, 0, 0) 70%)',
            }}
          />
        );
      case 'fade-pulse-reverse':
        return (
          <EffectOverlay
            animate={overlayControls}
            style={{
              background:
                'radial-gradient(circle, rgba(121, 85, 72, 0.4) 0%, rgba(0, 0, 0, 0) 70%)',
            }}
          />
        );
      case 'color-shift':
        return (
          <EffectOverlay
            animate={overlayControls}
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 193, 7, 0.3), rgba(0, 0, 0, 0))',
            }}
          />
        );
      case 'color-shift-reverse':
        return (
          <EffectOverlay
            animate={overlayControls}
            style={{
              background: 'linear-gradient(to bottom, rgba(62, 39, 35, 0.3), rgba(0, 0, 0, 0))',
            }}
          />
        );
      case 'tone-darken':
        return (
          <EffectOverlay
            animate={overlayControls}
            style={{ background: 'rgba(161, 136, 127, 0.3)' }}
          />
        );
      case 'grow-up':
        return (
          <EffectOverlay
            animate={overlayControls}
            style={{
              background: 'linear-gradient(to top, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0))',
            }}
          />
        );
      case 'expand-width':
        return (
          <EffectOverlay
            animate={overlayControls}
            style={{
              background:
                'radial-gradient(ellipse, rgba(76, 175, 80, 0.2) 0%, rgba(0, 0, 0, 0) 70%)',
            }}
          />
        );
      case 'stretch-vertical':
        return (
          <EffectOverlay
            animate={overlayControls}
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 87, 34, 0.2), rgba(0, 0, 0, 0))',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AvatarContainer>
      <AvatarTitle>Fenótipo do Organismo</AvatarTitle>

      <AvatarFrame ref={avatarRef}>
        <AvatarSVG
          viewBox="0 0 200 300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Cabeça */}
          <motion.circle
            animate={bodyControls}
            cx="100"
            cy="70"
            r="50"
            fill={traits.skinTone === 'light' ? '#FFE0B2' : '#A1887F'}
          />

          {/* Olhos */}
          <motion.g animate={eyesControls}>
            <circle cx="75" cy="60" r="10" fill="white" stroke="#555" strokeWidth="1" />
            <circle cx="125" cy="60" r="10" fill="white" stroke="#555" strokeWidth="1" />

            {/* Íris dos olhos */}
            <circle
              cx="75"
              cy="60"
              r="5"
              fill={traits.eyeColor === 'blue' ? '#2196F3' : '#795548'}
            />
            <circle
              cx="125"
              cy="60"
              r="5"
              fill={traits.eyeColor === 'blue' ? '#2196F3' : '#795548'}
            />
          </motion.g>

          {/* Cabelo */}
          <motion.path
            animate={hairControls}
            d="M50,40 C50,20 80,10 100,10 C120,10 150,20 150,40 C150,60 120,30 100,30 C80,30 50,60 50,40 Z"
            fill={traits.hairColor === 'blonde' ? '#FFC107' : '#3E2723'}
          />

          {/* Corpo - varia de acordo com a altura e o tipo de corpo */}
          <motion.rect
            animate={bodyControls}
            x={traits.bodyType === 'slim' ? '85' : '80'}
            y="120"
            width={traits.bodyType === 'slim' ? '30' : '40'}
            height={traits.height / 2}
            fill={traits.skinTone === 'light' ? '#FFE0B2' : '#A1887F'}
            rx="10"
          />

          {/* Braços */}
          <motion.rect
            animate={bodyControls}
            x={traits.bodyType === 'slim' ? '60' : '50'}
            y="130"
            width="25"
            height="80"
            fill={traits.skinTone === 'light' ? '#FFE0B2' : '#A1887F'}
            rx="10"
            transform="rotate(-20, 60, 130)"
          />
          <motion.rect
            animate={bodyControls}
            x={traits.bodyType === 'slim' ? '115' : '125'}
            y="130"
            width="25"
            height="80"
            fill={traits.skinTone === 'light' ? '#FFE0B2' : '#A1887F'}
            rx="10"
            transform="rotate(20, 140, 130)"
          />

          {/* Pernas */}
          <motion.rect
            animate={bodyControls}
            x={traits.bodyType === 'slim' ? '85' : '80'}
            y={120 + traits.height / 2}
            width="15"
            height="100"
            fill="#303F9F"
            rx="5"
          />
          <motion.rect
            animate={bodyControls}
            x={traits.bodyType === 'slim' ? '100' : '105'}
            y={120 + traits.height / 2}
            width="15"
            height="100"
            fill="#303F9F"
            rx="5"
          />
        </AvatarSVG>

        {/* Overlay de efeitos visuais */}
        <AnimatePresence>{renderOverlayEffect()}</AnimatePresence>
      </AvatarFrame>

      <TraitsList>
        <TraitItem>
          <TraitLabel>Cor dos Olhos</TraitLabel>
          <TraitValue
            animate={{
              scale: animatingTrait === 'eyeColor' ? [1, 1.1, 1] : 1,
              color: traits.eyeColor === 'blue' ? '#2196F3' : '#795548',
            }}
            transition={{ duration: 0.5 }}
          >
            {traits.eyeColor === 'blue' ? 'Azul' : 'Castanho'}
          </TraitValue>
        </TraitItem>

        <TraitItem>
          <TraitLabel>Cor do Cabelo</TraitLabel>
          <TraitValue
            animate={{
              scale: animatingTrait === 'hairColor' ? [1, 1.1, 1] : 1,
              color: traits.hairColor === 'blonde' ? '#FFC107' : '#3E2723',
            }}
            transition={{ duration: 0.5 }}
          >
            {traits.hairColor === 'blonde' ? 'Loiro' : 'Preto'}
          </TraitValue>
        </TraitItem>

        <TraitItem>
          <TraitLabel>Tom de Pele</TraitLabel>
          <TraitValue
            animate={{
              scale: animatingTrait === 'skinTone' ? [1, 1.1, 1] : 1,
              color: traits.skinTone === 'light' ? '#FFE0B2' : '#A1887F',
            }}
            transition={{ duration: 0.5 }}
          >
            {traits.skinTone === 'light' ? 'Clara' : 'Escura'}
          </TraitValue>
        </TraitItem>

        <TraitItem>
          <TraitLabel>Altura</TraitLabel>
          <TraitValue
            animate={{
              scale: animatingTrait === 'height' ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {traits.height} cm
          </TraitValue>
        </TraitItem>

        <TraitItem>
          <TraitLabel>Tipo Físico</TraitLabel>
          <TraitValue
            animate={{
              scale: animatingTrait === 'bodyType' ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5 }}
          >
            {traits.bodyType === 'slim' ? 'Magro' : 'Musculoso'}
          </TraitValue>
        </TraitItem>
      </TraitsList>

      {/* Efeito de partículas */}
      {showParticles && (
        <ParticleEffect
          sourcePosition={particleInfo.sourcePos}
          targetPosition={particleInfo.targetPos}
          baseType={particleInfo.baseType}
          active={showParticles}
          onComplete={() => setShowParticles(false)}
        />
      )}
    </AvatarContainer>
  );
};

export default CharacterAvatar;
