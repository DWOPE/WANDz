import create from "zustand";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

export const useGlobalState = create(set => ({
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue) => set(() => ({ nativeCurrencyPrice: newValue })),
}));
