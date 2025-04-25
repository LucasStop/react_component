import styled from 'styled-components';
import DNAMolecule from './components/DNAMolecule';
import CharacterAvatar from './components/CharacterAvatar';
import MutationLog from './components/MutationLog';

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h1`
  grid-column: 1 / -1;
  margin-bottom: 1rem;
  color: #61dafb;
  font-size: 2.5rem;
`;

function App() {
  return (
    <AppContainer>
      <Title>Simulador de Alterações Genéticas</Title>
      <DNAMolecule />
      <div>
        <CharacterAvatar />
        <MutationLog />
      </div>
    </AppContainer>
  );
}

export default App;
