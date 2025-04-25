# Simulador de Alterações Genéticas

Um aplicativo interativo que simula como alterações no DNA podem afetar as características físicas de um organismo. Este projeto foi desenvolvido como um Trabalho de Desenvolvimento Educacional (TDE) para demonstrar conceitos básicos de genética e biologia molecular de forma visual e interativa.

## Funcionalidades

- Visualização 3D de uma molécula de DNA
- Simulação de mutações genéticas com animações
- Avatar interativo que muda com base nas alterações genéticas
- Registro de todas as mutações realizadas
- Interface responsiva e amigável

## Tecnologias Utilizadas

- React 18
- TypeScript
- Styled Components
- Framer Motion (para animações)
- Zustand (gerenciamento de estado)
- Vite (para build e desenvolvimento)

## Como Usar

### Requisitos

- Node.js 14.x ou superior
- npm ou yarn

### Instalação

1. Clone este repositório
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Acesse `http://localhost:3000` no seu navegador

## Como Funciona

O aplicativo cria uma sequência aleatória de DNA (representada pelos pares de bases A-T e C-G) e permite que você clique em qualquer base para alterar seu valor. Sempre que uma base é alterada:

1. O par complementar é automaticamente atualizado (A sempre pareia com T, e C sempre pareia com G)
2. O avatar do personagem é atualizado para refletir as novas características genéticas
3. A mutação é registrada no histórico

### Entendendo as Características

O fenótipo do personagem (características físicas) é determinado pela frequência de cada tipo de base no DNA:

- **Cor dos olhos**: Determinada pela relação entre Adenina (A) e Guanina (G)
- **Cor do cabelo**: Determinada pela relação entre Citosina (C) e Timina (T)
- **Tom de pele**: Determinado pela relação entre Guanina (G) e Citosina (C)
- **Altura**: Calculada com base na quantidade de Timina (T)
- **Tipo físico**: Determinado pela relação entre Adenina (A) e Citosina (C)

## Estrutura de Pastas

```
src/
  ├── components/         # Componentes da UI
  │   ├── DNAMolecule.tsx # Molécula de DNA completa
  │   ├── DNABasePair.tsx # Componente de par de bases
  │   ├── CharacterAvatar.tsx # Avatar que muda com o DNA
  │   └── MutationLog.tsx # Registro de mutações
  ├── store/              # Gerenciamento de estado
  │   └── dnaStore.ts     # Estado global usando Zustand
  ├── assets/             # Imagens e outros recursos
  ├── App.tsx             # Componente principal
  └── main.tsx            # Ponto de entrada da aplicação
```

## Créditos

Este projeto foi desenvolvido como uma ferramenta educacional. O código está disponível para fins educacionais e pode ser modificado e distribuído livremente.

## Licença

MIT