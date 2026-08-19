import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useLauncherConfig } from "@/contexts/config";

interface SharedModalContextType {
  openSharedModal: (key: string, params?: any) => void;
  closeSharedModal: (key: string) => void;
  openGenericConfirmDialog: (params?: any) => void;
  modalStates: Record<
    string,
    { isOpen: boolean; params: any; modalKey: string; order: number }
  >;
}

export const SharedModalContext = createContext<
  SharedModalContextType | undefined
>(undefined);

export const SharedModalContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [modalStates, setModalStates] = useState<
    Record<
      string,
      { isOpen: boolean; params: any; modalKey: string; order: number }
    >
  >({});
  const modalOrder = useRef(0);
  const { config } = useLauncherConfig();

  const openSharedModal = useCallback((key: string, params: any = {}) => {
    const order = ++modalOrder.current;
    const instanceKey = `${key}@${order}`;
    setModalStates((prev) => ({
      ...prev,
      [instanceKey]: { isOpen: true, params, modalKey: key, order },
    }));
    logger.info("Opened shared modal:", key, params);
  }, []);

  const closeSharedModal = useCallback((key: string) => {
    setModalStates((prev) => {
      const matching = Object.entries(prev)
        .filter(([, state]) => state.modalKey === key)
        .sort(([, a], [, b]) => b.order - a.order);
      const instanceKey = matching[0]?.[0] || key;
      const { [instanceKey]: _, ...newStates } = prev;
      return newStates;
    });
  }, []);

  const openGenericConfirmDialog = useCallback(
    (params?: any) => {
      // If the user has previously selected "Don't show again", skip the dialog and call the OK callback directly
      if (
        params.suppressKey &&
        config.suppressedDialogs?.includes(params.suppressKey)
      ) {
        params?.onOKCallback?.();
        return;
      }
      openSharedModal("generic-confirm", {
        ...params,
      });
    },
    [config.suppressedDialogs, openSharedModal]
  );

  return (
    <SharedModalContext.Provider
      value={{
        openSharedModal,
        closeSharedModal,
        openGenericConfirmDialog,
        modalStates,
      }}
    >
      {children}
    </SharedModalContext.Provider>
  );
};

export const useSharedModals = (): SharedModalContextType => {
  const context = useContext(SharedModalContext);
  if (!context) {
    throw new Error(
      "useSharedModals must be used within a SharedModalContextProvider"
    );
  }
  return context;
};
