import { DNABase } from '../store/dnaStore';

export interface MutationEffect {
  name: string;
  description: string;
  affectedTrait: 'eyeColor' | 'hairColor' | 'skinTone' | 'height' | 'bodyType';
  visualEffect: string;
}

export const basePairEffects: Record<DNABase, MutationEffect[]> = {
  A: [
    {
      name: 'Olhos Azuis',
      description: 'A adenina em concentração elevada está associada à pigmentação azul da íris.',
      affectedTrait: 'eyeColor',
      visualEffect: 'fade-pulse',
    },
    {
      name: 'Corpo Magro',
      description: 'A presença dominante de adenina promove metabolismo acelerado.',
      affectedTrait: 'bodyType',
      visualEffect: 'stretch-vertical',
    },
  ],
  T: [
    {
      name: 'Cabelo Loiro',
      description: 'A timina dominante está relacionada à menor produção de melanina capilar.',
      affectedTrait: 'hairColor',
      visualEffect: 'color-shift',
    },
    {
      name: 'Altura Elevada',
      description:
        'Altas concentrações de timina estão associadas ao crescimento ósseo prolongado.',
      affectedTrait: 'height',
      visualEffect: 'grow-up',
    },
  ],
  C: [
    {
      name: 'Cabelo Escuro',
      description: 'A citosina dominante favorece maior produção de melanina capilar.',
      affectedTrait: 'hairColor',
      visualEffect: 'color-shift-reverse',
    },
    {
      name: 'Corpo Musculoso',
      description: 'A citosina em altas concentrações está ligada ao desenvolvimento muscular.',
      affectedTrait: 'bodyType',
      visualEffect: 'expand-width',
    },
  ],
  G: [
    {
      name: 'Olhos Castanhos',
      description: 'A guanina dominante promove maior produção de melanina na íris.',
      affectedTrait: 'eyeColor',
      visualEffect: 'fade-pulse-reverse',
    },
    {
      name: 'Pele Escura',
      description: 'Altas concentrações de guanina favorecem maior produção de melanina na pele.',
      affectedTrait: 'skinTone',
      visualEffect: 'tone-darken',
    },
  ],
};

export const getEffectForMutation = (oldBase: DNABase, newBase: DNABase): MutationEffect | null => {
  if (oldBase === newBase) return null;

  // Retorna o efeito mais relevante para a nova base
  return basePairEffects[newBase][0]; // Pegamos o primeiro efeito como exemplo
};

export const getVisualEffectClassName = (effect: MutationEffect): string => {
  return effect?.visualEffect || 'none';
};
