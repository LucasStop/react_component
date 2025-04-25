import { create } from 'zustand';

// Definição dos tipos de bases do DNA
export type DNABase = 'A' | 'T' | 'C' | 'G';

// Representa um par de bases do DNA
export interface DNABasePair {
  id: number;
  top: DNABase;
  bottom: DNABase;
}

// Registro de uma mutação
export interface Mutation {
  id: number;
  pairId: number;
  oldTop: DNABase;
  oldBottom: DNABase;
  newTop: DNABase;
  newBottom: DNABase;
  timestamp: Date;
}

// Características controladas pelos genes
export interface CharacterTraits {
  eyeColor: string;
  hairColor: string;
  skinTone: string;
  height: number;
  bodyType: string;
}

// Estado da loja
interface DNAState {
  dnaSequence: DNABasePair[];
  mutations: Mutation[];
  traits: CharacterTraits;
  mutationCount: number;

  // Ações
  mutateDNA: (pairId: number, newTop: DNABase, newBottom: DNABase) => void;
  resetDNA: () => void;
}

// Função para garantir pares complementares de DNA
const getComplementaryBase = (base: DNABase): DNABase => {
  switch (base) {
    case 'A':
      return 'T';
    case 'T':
      return 'A';
    case 'C':
      return 'G';
    case 'G':
      return 'C';
  }
};

// Função para calcular os traços baseados na sequência de DNA
const calculateTraits = (sequence: DNABasePair[]): CharacterTraits => {
  // Simulação simplificada - na vida real seria muito mais complexo
  // Contamos a frequência de cada base para determinar traços
  const baseCounts = { A: 0, T: 0, C: 0, G: 0 };

  sequence.forEach(pair => {
    baseCounts[pair.top]++;
    baseCounts[pair.bottom]++;
  });

  // Determinamos traços baseados nas frequências
  return {
    eyeColor: baseCounts.A > baseCounts.G ? 'blue' : 'brown',
    hairColor: baseCounts.C > baseCounts.T ? 'black' : 'blonde',
    skinTone: baseCounts.G > baseCounts.C ? 'dark' : 'light',
    height: 150 + Math.floor((baseCounts.T / (sequence.length * 2)) * 50),
    bodyType: baseCounts.A > baseCounts.C ? 'slim' : 'muscular',
  };
};

// Criação da sequência inicial de DNA
const createInitialDNA = (): DNABasePair[] => {
  const bases: DNABase[] = ['A', 'T', 'C', 'G'];
  const sequence: DNABasePair[] = [];

  // Criamos 10 pares de bases aleatórios
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * 4);
    const topBase = bases[randomIndex] as DNABase;
    const bottomBase = getComplementaryBase(topBase);

    sequence.push({
      id: i,
      top: topBase,
      bottom: bottomBase,
    });
  }

  return sequence;
};

// Inicialização do estado
const initialDNA = createInitialDNA();
const initialTraits = calculateTraits(initialDNA);

// Criação da loja Zustand
export const useDNAStore = create<DNAState>((set, get) => ({
  dnaSequence: initialDNA,
  mutations: [],
  traits: initialTraits,
  mutationCount: 0,

  mutateDNA: (pairId, newTop, newBottom) => {
    set(state => {
      // Encontra o par de bases a ser mutado
      const pairIndex = state.dnaSequence.findIndex(pair => pair.id === pairId);
      if (pairIndex === -1) return state;

      const oldPair = state.dnaSequence[pairIndex];

      // Cria uma cópia da sequência atual
      const newSequence = [...state.dnaSequence];

      // Atualiza o par na posição correta
      newSequence[pairIndex] = {
        ...oldPair,
        top: newTop,
        bottom: newBottom,
      };

      // Registra a mutação
      const mutation: Mutation = {
        id: state.mutationCount,
        pairId,
        oldTop: oldPair.top,
        oldBottom: oldPair.bottom,
        newTop,
        newBottom,
        timestamp: new Date(),
      };

      // Calcula os novos traços baseados na sequência mutada
      const newTraits = calculateTraits(newSequence);

      return {
        dnaSequence: newSequence,
        mutations: [...state.mutations, mutation],
        traits: newTraits,
        mutationCount: state.mutationCount + 1,
      };
    });
  },

  resetDNA: () => {
    const resetDNA = createInitialDNA();
    const resetTraits = calculateTraits(resetDNA);

    set({
      dnaSequence: resetDNA,
      mutations: [],
      traits: resetTraits,
      mutationCount: 0,
    });
  },
}));
