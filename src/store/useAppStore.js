import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
    persist(
        (set, get) => ({
            // Business Profiles
            businesses: [],
            selectedBusinessId: null,

            // UI State
            isLoading: false,
            toast: null,

            // Card Creation State
            cardCreation: {
                businessId: null,
                format: 'square',
                festivalImage: null,
                festivalImageFile: null,
                bannerStyle: 'classic',
                bannerPosition: 'bottom',
                bannerColors: {
                    background: '#FF6B35',
                    text: '#FFFFFF',
                },
                imageTransform: { scale: 1, x: 0, y: 0 },
                editingCardId: null, // Track which card is being edited
            },

            // Actions - Business Profiles
            addBusiness: (business) => set((state) => ({
                businesses: [...state.businesses, { ...business, id: business.id || crypto.randomUUID() }]
            })),

            updateBusiness: (id, updates) => set((state) => ({
                businesses: state.businesses.map((b) =>
                    b.id === id ? { ...b, ...updates } : b
                )
            })),

            deleteBusiness: (id) => set((state) => ({
                businesses: state.businesses.filter((b) => b.id !== id),
                selectedBusinessId: state.selectedBusinessId === id ? null : state.selectedBusinessId
            })),

            selectBusiness: (id) => set({ selectedBusinessId: id }),

            getSelectedBusiness: () => {
                const state = get()
                return state.businesses.find((b) => b.id === state.selectedBusinessId)
            },

            // Actions - UI State
            setLoading: (isLoading) => set({ isLoading }),

            showToast: (message, type = 'success') => set({
                toast: { message, type, id: Date.now() }
            }),

            hideToast: () => set({ toast: null }),

            // Actions - Card Creation
            setCardFormat: (format) => set((state) => ({
                cardCreation: { ...state.cardCreation, format }
            })),

            setFestivalImage: (festivalImage) => set((state) => ({
                cardCreation: { ...state.cardCreation, festivalImage }
            })),

            setBannerStyle: (bannerStyle) => set((state) => ({
                cardCreation: { ...state.cardCreation, bannerStyle }
            })),

            setBannerPosition: (bannerPosition) => set((state) => ({
                cardCreation: { ...state.cardCreation, bannerPosition }
            })),

            setBannerColors: (bannerColors) => set((state) => ({
                cardCreation: { ...state.cardCreation, bannerColors }
            })),

            updateCardCreation: (updates) => set((state) => ({
                cardCreation: { ...state.cardCreation, ...updates }
            })),

            resetCardCreation: () => set({
                cardCreation: {
                    businessId: null,
                    format: 'square',
                    festivalImage: null,
                    festivalImageFile: null,
                    bannerStyle: 'classic',
                    bannerPosition: 'bottom',
                    bannerColors: {
                        background: '#FF6B35',
                        text: '#FFFFFF',
                    },
                    imageTransform: { scale: 1, x: 0, y: 0 },
                    editingCardId: null,
                }
            }),
        }),
        {
            name: 'festiva-storage',
            partialize: (state) => ({
                businesses: state.businesses,
                selectedBusinessId: state.selectedBusinessId,
            }),
        }
    )
)
