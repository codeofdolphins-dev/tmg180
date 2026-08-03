import WorkspaceSidebar from './WorkspaceSidebar';
import WorkspaceTopBar from './WorkspaceTopBar';

export default function WorkspaceLayout({
  portalLabel,
  activeItem,
  lowerNavItems,
  bottomNavItems,
  showParticipantsPlaceholder,
  newEntryPosition,
  topBar = false,
  searchPlaceholder,
  avatar,
  showSearch,
  children,
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <WorkspaceSidebar
        portalLabel={portalLabel}
        activeItem={activeItem}
        lowerNavItems={lowerNavItems}
        bottomNavItems={bottomNavItems}
        showParticipantsPlaceholder={showParticipantsPlaceholder}
        newEntryPosition={newEntryPosition}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        {topBar && (
          <WorkspaceTopBar
            searchPlaceholder={searchPlaceholder}
            avatar={avatar}
            showSearch={showSearch}
          />
        )}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
