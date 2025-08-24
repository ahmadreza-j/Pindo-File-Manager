import {
  type Dispatch,
  type FC,
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { AppState, FSAction } from "./fsTypes";
import { fsReducer } from "./fsReducer";
import { getInitialFSState } from "./storage";

interface FSContextType {
  state: AppState;
  dispatch: Dispatch<FSAction>;
}

const FSContext = createContext<FSContextType | undefined>(undefined);

interface FSProviderProps {
  children: ReactNode;
}

export const FSProvider: FC<FSProviderProps> = ({ children }) => {
  const initialFSState = getInitialFSState();
  const initialAppState: AppState = {
    ...initialFSState,
    toasts: [],
  };

  const [state, dispatch] = useReducer(fsReducer, initialAppState);

  // Hydrate from storage on mount
  useEffect(() => {
    const storedState = getInitialFSState();
    dispatch({ type: "HYDRATE_FROM_STORAGE", payload: storedState });
  }, []);

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <FSContext.Provider value={contextValue}>{children}</FSContext.Provider>
  );
};

export const useFS = (): FSContextType => {
  const context = useContext(FSContext);
  if (context === undefined) {
    throw new Error("useFS must be used within a FSProvider");
  }
  return context;
};
