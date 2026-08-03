import GovernanceSidebar from './GovernanceSidebar';
import GovernanceTopBar from './GovernanceTopBar';

export default function GovernanceLayout({
  portalLabel,
  activeItem,
  navItems,
  bottomItems,
  showSupportPortal,
  logo,
  showLogo,
  uppercaseLabel,
  activeStyle,
  breadcrumb,
  pageTitle,
  searchPlaceholder,
  showHelp,
  showSupport,
  showGrid,
  children,
}) {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-800">
      <GovernanceSidebar
        portalLabel={portalLabel}
        activeItem={activeItem}
        navItems={navItems}
        bottomItems={bottomItems}
        showSupportPortal={showSupportPortal}
        logo={logo}
        showLogo={showLogo}
        uppercaseLabel={uppercaseLabel}
        activeStyle={activeStyle}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <GovernanceTopBar
          breadcrumb={breadcrumb}
          pageTitle={pageTitle}
          searchPlaceholder={searchPlaceholder}
          showHelp={showHelp}
          showSupport={showSupport}
          showGrid={showGrid}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
