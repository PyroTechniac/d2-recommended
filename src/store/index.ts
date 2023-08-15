import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface AppState { }

export const useStore = create<AppState>()(
    devtools((_set) => ({}))
);

export default useStore;