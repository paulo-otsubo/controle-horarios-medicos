import { create } from 'zustand';
import { Registro } from '../types/registro';
import { persist } from 'zustand/middleware';
import { db } from '../lib/firebase';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface RegistroState {
  registros: Registro[];
  addRegistro: (reg: Registro) => Promise<void>;
  updateRegistro: (id: string, reg: Partial<Registro>) => Promise<void>;
  deleteRegistro: (id: string) => Promise<void>;
  setRegistros: (regs: Registro[]) => void;
}

export const useRegistroStore = create<RegistroState>()(
  persist(
    (set) => ({
      registros: [],
      addRegistro: async (reg) => {
        set((state) => ({ registros: [...state.registros, reg] }));
        try {
          await setDoc(doc(db, 'registros', reg.id as string), reg);
        } catch (e) {
          console.error('Erro ao salvar no Firestore', e);
          set((state) => ({ registros: state.registros.filter((r) => r.id !== reg.id) }));
          throw e;
        }
      },
      updateRegistro: async (id, reg) => {
        set((state) => ({
          registros: state.registros.map((r) => (r.id === id ? { ...r, ...reg } : r))
        }));
        try {
          await updateDoc(doc(db, 'registros', id), reg as Partial<Registro>);
        } catch (e) {
          console.error('Erro ao atualizar no Firestore', e);
        }
      },
      deleteRegistro: async (id) => {
        set((state) => ({ registros: state.registros.filter((r) => r.id !== id) }));
        try {
          await deleteDoc(doc(db, 'registros', id));
        } catch (e) {
          console.error('Erro ao deletar no Firestore', e);
        }
      },
      setRegistros: (regs) => set({ registros: regs })
    }),
    {
      name: 'registro-store'
    }
  )
);
