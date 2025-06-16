import { create } from 'zustand';
import { Equipe } from '../types/equipe';
import { persist } from 'zustand/middleware';

interface EquipeState {
  equipes: Equipe[];
  addEquipe: (eq: Equipe) => void;
  updateEquipe: (id: string, eq: Partial<Equipe>) => void;
  deleteEquipe: (id: string) => void;
}

export const useEquipeStore = create<EquipeState>()(
  persist(
    (set) => ({
      equipes: [],
      addEquipe: (eq) => set((state) => ({ equipes: [...state.equipes, eq] })),
      updateEquipe: (id, eq) =>
        set((state) => ({
          equipes: state.equipes.map((e) => (e.id === id ? { ...e, ...eq } : e))
        })),
      deleteEquipe: (id) => set((state) => ({ equipes: state.equipes.filter((e) => e.id !== id) }))
    }),
    { name: 'equipe-store' }
  )
);
