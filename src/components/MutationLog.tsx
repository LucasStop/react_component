import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useDNAStore, Mutation, DNABase } from '../store/dnaStore';

const LogContainer = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

const LogTitle = styled.h2`
  margin-bottom: 1rem;
  color: #61dafb;
`;

const ScrollableLog = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;

  /* Estilizando a barra de rolagem */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #61dafb;
    border-radius: 4px;
  }
`;

const LogEntry = styled(motion.div)`
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.05);
  border-left: 4px solid #61dafb;
  text-align: left;
`;

const MutationTime = styled.div`
  font-size: 0.8rem;
  color: #ccc;
  margin-bottom: 0.5rem;
`;

const MutationDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BaseChange = styled.div`
  display: flex;
  align-items: center;
`;

const BaseCircle = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 0.9rem;
  margin: 0 4px;
`;

const Arrow = styled.div`
  margin: 0 8px;
  color: #ccc;
`;

const EmptyLog = styled.div`
  padding: 2rem;
  text-align: center;
  color: #ccc;
`;

// Mapeamento de cores para as bases do DNA
const baseColors = {
  A: '#FF5722', // Adenina - Laranja
  T: '#2196F3', // Timina - Azul
  C: '#4CAF50', // Citosina - Verde
  G: '#FFC107', // Guanina - Amarelo
};

const MutationLog: React.FC = () => {
  const mutations = useDNAStore(state => state.mutations);

  // Função para formatar a data
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  };

  return (
    <LogContainer>
      <LogTitle>Registro de Mutações</LogTitle>

      <ScrollableLog>
        <AnimatePresence>
          {mutations.length === 0 ? (
            <EmptyLog>
              Nenhuma mutação realizada ainda. Clique em uma base do DNA para alterar.
            </EmptyLog>
          ) : (
            mutations
              .slice()
              .reverse()
              .map(mutation => (
                <LogEntry
                  key={mutation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MutationTime>
                    {formatDate(mutation.timestamp)} - Par #{mutation.pairId + 1}
                  </MutationTime>

                  <MutationDetails>
                    <BaseChange>
                      <BaseCircle color={baseColors[mutation.oldTop]}>{mutation.oldTop}</BaseCircle>
                      <BaseCircle color={baseColors[mutation.oldBottom]}>
                        {mutation.oldBottom}
                      </BaseCircle>
                    </BaseChange>

                    <Arrow>→</Arrow>

                    <BaseChange>
                      <BaseCircle color={baseColors[mutation.newTop]}>{mutation.newTop}</BaseCircle>
                      <BaseCircle color={baseColors[mutation.newBottom]}>
                        {mutation.newBottom}
                      </BaseCircle>
                    </BaseChange>
                  </MutationDetails>
                </LogEntry>
              ))
          )}
        </AnimatePresence>
      </ScrollableLog>
    </LogContainer>
  );
};

export default MutationLog;
