import { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { DNABase, DNABasePair as DNABasePairType } from '../store/dnaStore';
import { getEffectForMutation } from '../data/mutations';

interface Props {
  pair: DNABasePairType;
  index: number;
  onMutate: (pairId: number, newTop: DNABase, newBottom: DNABase) => void;
  triggerParticleEffect?: (position: { x: number; y: number }, baseType: DNABase) => void;
}

// Mapeamento de cores para as bases do DNA
const baseColors = {
  A: '#FF5722', // Adenina - Laranja
  T: '#2196F3', // Timina - Azul
  C: '#4CAF50', // Citosina - Verde
  G: '#FFC107', // Guanina - Amarelo
};

// Opções de bases para substituição
const baseOptions: DNABase[] = ['A', 'T', 'C', 'G'];

const BasePairContainer = styled(motion.div)<{ index: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  width: 120px;
  transform-origin: center;
  transform: rotate(${props => props.index * 36}deg) translateX(150px);
`;

const BaseConnection = styled.div`
  width: 60px;
  height: 4px;
  background-color: #e0e0e0;
  margin: 3px 0;
`;

const BaseCircle = styled(motion.div)<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
`;

const BaseMenu = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

const BaseOption = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const MutationTooltip = styled(motion.div)`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  width: 180px;
  pointer-events: none;
  z-index: 20;

  &::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
`;

const DNABasePair: React.FC<Props> = ({ pair, index, onMutate, triggerParticleEffect }) => {
  const [activeBase, setActiveBase] = useState<'top' | 'bottom' | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({ title: '', description: '' });
  const topBaseRef = useRef<HTMLDivElement>(null);
  const bottomBaseRef = useRef<HTMLDivElement>(null);

  const handleBaseClick = (position: 'top' | 'bottom') => {
    setActiveBase(activeBase === position ? null : position);
  };

  const handleBaseChange = (position: 'top' | 'bottom', newBase: DNABase) => {
    // Obtém o base complementar
    let complementaryBase: DNABase;
    switch (newBase) {
      case 'A':
        complementaryBase = 'T';
        break;
      case 'T':
        complementaryBase = 'A';
        break;
      case 'C':
        complementaryBase = 'G';
        break;
      case 'G':
        complementaryBase = 'C';
        break;
      default:
        complementaryBase = 'A';
    }

    // Determina qual par deve ser atualizado
    const topBase = position === 'top' ? newBase : pair.top;
    const bottomBase = position === 'bottom' ? newBase : pair.bottom;

    // Verifica se houve alteração
    const oldBase = position === 'top' ? pair.top : pair.bottom;
    if (oldBase !== newBase) {
      // Obtém informações sobre o efeito da mutação
      const effect = getEffectForMutation(oldBase, newBase);
      if (effect) {
        setTooltipContent({
          title: effect.name,
          description: effect.description,
        });
        setShowTooltip(true);

        // Oculta o tooltip após 3 segundos
        setTimeout(() => {
          setShowTooltip(false);
        }, 3000);
      }

      // Dispara o efeito de partículas se a função for fornecida
      if (triggerParticleEffect) {
        const baseRef = position === 'top' ? topBaseRef : bottomBaseRef;
        if (baseRef.current) {
          const rect = baseRef.current.getBoundingClientRect();
          const position = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
          triggerParticleEffect(position, newBase);
        }
      }
    }

    // Chama a função de mutação
    onMutate(pair.id, topBase, bottomBase);

    // Fecha o menu
    setActiveBase(null);
  };

  // Animações para o menu
  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  // Animações para os círculos das bases
  const baseVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <BasePairContainer
      index={index}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Base superior */}
      <BaseCircle
        ref={topBaseRef}
        color={baseColors[pair.top]}
        onClick={() => handleBaseClick('top')}
        whileHover="hover"
        whileTap="tap"
        variants={baseVariants}
      >
        {pair.top}
      </BaseCircle>

      {/* Conexão entre as bases */}
      <BaseConnection />

      {/* Base inferior */}
      <BaseCircle
        ref={bottomBaseRef}
        color={baseColors[pair.bottom]}
        onClick={() => handleBaseClick('bottom')}
        whileHover="hover"
        whileTap="tap"
        variants={baseVariants}
      >
        {pair.bottom}
      </BaseCircle>

      {/* Menu de seleção para a base superior */}
      <AnimatePresence>
        {activeBase === 'top' && (
          <BaseMenu
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            style={{ top: '-180px', left: '50%', transform: 'translateX(-50%)' }}
          >
            {baseOptions.map(base => (
              <BaseOption
                key={base}
                color={baseColors[base]}
                onClick={() => handleBaseChange('top', base)}
              >
                {base}
              </BaseOption>
            ))}
          </BaseMenu>
        )}
      </AnimatePresence>

      {/* Menu de seleção para a base inferior */}
      <AnimatePresence>
        {activeBase === 'bottom' && (
          <BaseMenu
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            style={{ bottom: '-180px', left: '50%', transform: 'translateX(-50%)' }}
          >
            {baseOptions.map(base => (
              <BaseOption
                key={base}
                color={baseColors[base]}
                onClick={() => handleBaseChange('bottom', base)}
              >
                {base}
              </BaseOption>
            ))}
          </BaseMenu>
        )}
      </AnimatePresence>

      {/* Tooltip com informações sobre a mutação */}
      <AnimatePresence>
        {showTooltip && (
          <MutationTooltip
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              top: '-100px',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <strong>{tooltipContent.title}</strong>
            <p>{tooltipContent.description}</p>
          </MutationTooltip>
        )}
      </AnimatePresence>
    </BasePairContainer>
  );
};

export default DNABasePair;
