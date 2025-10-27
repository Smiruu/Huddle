import {create} from "zustand";

const applyTheme = (theme) => {
    if (typeof window !== 'undefined' && window.document) {
        const root = window.document.documentElement;

        if (theme === 'dark'){
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        window.localStorage.setItem('theme', theme);
    }
};

const getInitialTheme = () => {
    let theme = 'light';
    if (typeof window !== 'undefined' && window.localStorage){
        const storedPref = window.localStorage.getItem('theme');
        if (storedPref) {
            theme = storedPref;
        } else {
            const userMedia = windo.matchMedia('(prefers-color-scheme: dark)');
            if (userMedia.matches) {
                theme = 'dark';
            }
        }
    }

    applyTheme(theme);
    return theme;
}

export const useThemeStore = create((set) => ({
    theme: getInitialTheme(),

    toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        return {theme: newTheme};
    })
}))