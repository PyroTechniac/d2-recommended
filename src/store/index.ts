import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface AppState {}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useStore = create<AppState>()(devtools((_set) => ({})));

export default useStore;
