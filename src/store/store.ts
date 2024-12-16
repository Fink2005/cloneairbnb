import FavoriteRooms from "@/app/(public)/Dashboard/FavoriteRooms";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Define types for the calendar and customers
interface CalendarType {
  from: Date | undefined;
  to: Date | undefined;
}

export interface CustomerType {
  adults: number;
  children: number;
  babies: number;
  pets: number;
}

interface UserProfile {
  avatar: string;
  birthday: string;
  gender: boolean; // Gender, typically `true` for male and `false` for female, or you can use `enum` for more clarity
  email: string;
  id: number; // Unique identifier for the user
  name: string; // User's name
  password: string; // User's password (empty string if not set)
  phone: string;
  role: "USER" | "ADMIN";
}

interface AppState {
  NextStep: number;
  total: number;
  dataStoreDestination: any;
  dataStoreDestination2: any;
  dataApiListRoom: any;
  dataCalendar: CalendarType;
  customers: CustomerType;
  customerDetails: any;
  resultSearch: any;
  star: any;
  getUserData: UserProfile;
  dataLocation: any;
  headerTotal: any;
  fetchDataStore: boolean;
  removeDataHeader: boolean;
  favorite: number[];
  setStar: (newStar: any) => void;
  setDataLocation: (newLocation: any) => void;
  setSearch: () => void;
  setDataApiListRoom: (newDataApiListRoom: any) => void;
  setNextStep: (newStep: number) => void;
  setDataStoreDestination: (newDestination: any) => void;
  setDataStoreDestination2: (newDestination2: any) => void;
  setDataCalendar: (newCalendar: any) => void;
  setCustomers: (newCustomers: CustomerType) => void;
  setCustomerDetails: (newCustomerDetails: any) => void;
  increment: (category: keyof CustomerType) => void;
  decrement: (category: keyof CustomerType) => void;
  setFetchDataStore: () => void;
  resetCustomers: () => void;
  resetDataCalendar: () => void;
  setGetUserData: (userData: UserProfile) => void;
  setHeaderTotal: (newHeaderTotal: number) => void;
  setRemoveDataHeader: () => void;
  resetQuickSearch: () => void;
  clearStorageUser: () => void;
  setFavorite: (newFavorite: number) => any;
  setRemoveFavorite: (newRemoveFavorite: number) => any;
}

export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        star: 0,
        favorite: [],
        removeDataHeader: false,
        headerTotal: 0,
        fetchDataStore: false,
        customerDetails: 0,
        dataLocation: "",
        customers: {
          adults: 1,
          children: 0,
          babies: 0,
          pets: 0,
        },
        getUserData: {
          avatar: "",
          birthday: "",
          email: "",
          gender: false,
          id: 0,
          name: "",
          password: "",
          phone: "",
          role: "USER",
        },
        total: 1,
        resultSearch: [],
        dataStoreDestination: 0,
        dataStoreDestination2: "",
        NextStep: 0,
        dataApiListRoom: [],
        dataCalendar: {
          from: undefined,
          to: undefined,
        },
        setRemoveFavorite: (newRemoveFavorite) => {
          set((state) => {
            let cloneFavorite: number[] = [...state.favorite];
            let filterFavorite = cloneFavorite.filter(
              (item) => item != newRemoveFavorite
            );
            return {
              favorite: filterFavorite,
            };
          });
        },
        setFavorite: (newFavorite: number): any =>
          set((state): any => {
            let cloneFavorite: number[] = [...state.favorite];
            let filterFavorite = cloneFavorite.filter(
              (item) => item === newFavorite
            );
            if (filterFavorite.length === 0) {
              cloneFavorite.push(newFavorite);
              return {
                favorite: cloneFavorite,
              };
            }

            return { favorite: cloneFavorite };
          }),
        setDataLocation: (newLocation) => set({ dataLocation: newLocation }),
        setNextStep: (newStep) => set({ NextStep: newStep }),
        setStar: (newStar) => set({ star: newStar }),
        setDataStoreDestination: (newDestination) =>
          set({ dataStoreDestination: newDestination }),
        setDataStoreDestination2: (newDestination2) =>
          set({ dataStoreDestination2: newDestination2 }),
        setDataApiListRoom: (newDataApiListRoom) => {
          set({ dataApiListRoom: newDataApiListRoom });
        },

        setDataCalendar: (newCalendar) => set({ dataCalendar: newCalendar }),
        setCustomers: (newCustomers) => set({ customers: newCustomers }),
        setSearch: () => {
          set((state) => {
            let cloneDataApiListRoom = [...state.dataApiListRoom];

            let cloneDataStoreDestination = state.dataStoreDestination;
            // localStorage.setItem("storeTotal", resultTotal.toString());
            if (cloneDataStoreDestination !== 0) {
              let filterListRooms = cloneDataApiListRoom.filter(
                (item) =>
                  item.maViTri === cloneDataStoreDestination &&
                  item.khach >= state.headerTotal
              );
              return {
                resultSearch: filterListRooms,
                total: state.headerTotal,
              };
            }
            let filterListRooms = cloneDataApiListRoom.filter(
              (item) => item.khach >= state.headerTotal
            );
            return { resultSearch: filterListRooms, total: state.headerTotal };
          });
        },
        setCustomerDetails: (newCustomerDetails: any) =>
          set({ customerDetails: newCustomerDetails }),
        increment: (category: keyof CustomerType) =>
          set((state) => {
            if (category === "pets" && state.customers.pets < 3) {
              return {
                customers: {
                  ...state.customers,
                  pets: state.customers.pets + 1,
                },
              };
            } else if (category === "babies" && state.customers.babies < 4) {
              return {
                customers: {
                  ...state.customers,
                  babies: state.customers.babies + 1,
                },
              };
            } else if (
              category == "adults" &&
              state.customers.adults < state.customerDetails &&
              state.total < state.customerDetails
            ) {
              const newTotal =
                state.customers.adults + state.customers.children + 1;
              return {
                customers: {
                  ...state.customers,
                  [category]: state.customers[category] + 1,
                },
                total: newTotal,
              };
            } else if (
              category == "children" &&
              state.customers.children < state.customerDetails &&
              state.total < state.customerDetails
            ) {
              const newTotal =
                state.customers.adults + state.customers.children + 1;
              return {
                customers: {
                  ...state.customers,
                  [category]: state.customers[category] + 1,
                },
                total: newTotal,
              };
            }
            return state;
          }),

        decrement: (category: keyof CustomerType) =>
          set((state) => {
            if (category == "adults" && state.customers.adults > 1) {
              let totalCustomer = state.total - 1;
              return {
                total: totalCustomer,
                customers: {
                  ...state.customers,
                  [category]: state.customers[category] - 1,
                },
              };
            } else if (category == "children" && state.customers.children > 0) {
              let totalCustomer = state.total - 1;
              return {
                total: totalCustomer,
                customers: {
                  ...state.customers,
                  [category]: state.customers[category] - 1,
                },
              };
            } else if (category != "adults" && state.customers[category] > 0) {
              return {
                customers: {
                  ...state.customers,
                  [category]: state.customers[category] - 1,
                },
              };
            }
            return state;
          }),
        resetCustomers: () =>
          set({
            customers: {
              adults: 1,
              children: 0,
              babies: 0,
              pets: 0,
            },
            total: 1,
          }),
        resetDataCalendar: () => {
          set({
            dataCalendar: {
              from: undefined,
              to: undefined,
            },
          });
        },
        resetQuickSearch: () => {
          set({
            dataCalendar: {
              from: undefined,
              to: undefined,
            },
            dataStoreDestination2: "",
            dataStoreDestination: "",
            customers: {
              adults: 1,
              children: 0,
              babies: 0,
              pets: 0,
            },
            headerTotal: 0,
          });
        },
        clearStorageUser: () => {
          set((state) => {
            // Reset the user data to its default value (empty object or some default)
            let defaultData = { ...state.getUserData }; // Adjust this to your default user data structure
            return { getUserData: defaultData }; // Reset user data
          });

          // Remove persisted storage
          localStorage.removeItem("app-state"); // Remove app-state from localStorage
        },
        setHeaderTotal: (newHeaderTotal) =>
          set({ headerTotal: newHeaderTotal }),
        setFetchDataStore: () =>
          set((state) => ({ fetchDataStore: !state.fetchDataStore })),
        setGetUserData: (userData: UserProfile) =>
          set({ getUserData: userData }),
        setRemoveDataHeader: () => {
          set((state) => ({
            removeDataHeader: !state.removeDataHeader,
          }));
        },
      }),

      {
        name: "app-state", // Name for the persisted state
        partialize: (state) =>
          Object.fromEntries(
            Object.entries(state).filter(
              ([key]) =>
                ![
                  "headerTotal",
                  "dataStoreDestination",
                  "dataStoreDestination2",
                  "NextStep",
                  "removeDataHeader",
                ].includes(key)
            )
          ),
        version: 1,
      }
    )
  )
);
