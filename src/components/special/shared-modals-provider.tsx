import React from "react";
import DownloadSpecificResourceModal from "@/components//modals/download-specific-resource-modal";
import AddAuthServerModal from "@/components/modals/add-auth-server-modal";
import AlertResourceDependencyModal from "@/components/modals/alert-resource-dependency-modal";
import CopyOrMoveModal from "@/components/modals/copy-or-move-modal";
import DeleteInstanceDialog from "@/components/modals/delete-instance-alert-dialog";
import DownloadModpackModal from "@/components/modals/download-modpack-modal";
import DownloadResourceModal from "@/components/modals/download-resource-modal";
import ExtensionInfoModal from "@/components/modals/extension-info-modal";
import GenericConfirmDialog from "@/components/modals/generic-confirm-dialog";
import ImportModpackModal from "@/components/modals/import-modpack-modal";
import LaunchProcessModal from "@/components/modals/launch-process-modal";
import NotifyNewVersionModal from "@/components/modals/notify-new-version-modal";
import ReLoginPlayerModal from "@/components/modals/relogin-player-modal";
import SpotlightSearchModal from "@/components/modals/spotlight-search-modal";
import { SharedModalContextProvider } from "@/contexts/shared-modal";
import { useSharedModals } from "@/contexts/shared-modal";

const modals: Record<string, React.FC<any>> = {
  "add-auth-server": AddAuthServerModal,
  "alert-resource-dependency": AlertResourceDependencyModal,
  "copy-or-move": CopyOrMoveModal,
  "delete-instance-alert": DeleteInstanceDialog,
  "download-modpack": DownloadModpackModal,
  "download-resource": DownloadResourceModal,
  "download-specific-resource": DownloadSpecificResourceModal,
  "extension-info": ExtensionInfoModal,
  "generic-confirm": GenericConfirmDialog,
  "import-modpack": ImportModpackModal,
  launch: LaunchProcessModal,
  "notify-new-version": NotifyNewVersionModal,
  relogin: ReLoginPlayerModal,
  "spotlight-search": SpotlightSearchModal,
};

const SharedModalEntry = React.memo<{
  state: { isOpen: boolean; params: any; modalKey: string; order: number };
  close: (key: string) => void;
  isTop: boolean;
}>(({ state, close, isTop }) => {
  const SpecModal = modals[state.modalKey];
  if (!SpecModal) return null;

  return (
    <SpecModal
      isOpen={state.isOpen}
      {...state.params}
      zIndex={1400 + state.order}
      trapFocus={isTop}
      closeOnEsc={isTop}
      closeOnOverlayClick={isTop}
      blockScrollOnMount={isTop}
      onClose={() => close(state.modalKey)}
    />
  );
});
SharedModalEntry.displayName = "SharedModalEntry";

const SharedModalsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SharedModalContextProvider>
      <SharedModals>{children}</SharedModals>
    </SharedModalContextProvider>
  );
};

const SharedModals: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { modalStates, closeSharedModal } = useSharedModals();

  return (
    <>
      {children}

      {(() => {
        const topEntry = Object.entries(modalStates).reduce<
          [string, (typeof modalStates)[string]] | undefined
        >((current, entry) => {
          if (!current || entry[1].order > current[1].order) return entry;
          return current;
        }, undefined);
        if (!topEntry) return null;
        const [instanceKey, state] = topEntry;
        return (
          <SharedModalEntry
            key={instanceKey}
            state={state}
            close={closeSharedModal}
            isTop
          />
        );
      })()}
    </>
  );
};

export default SharedModalsProvider;
