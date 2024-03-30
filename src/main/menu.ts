import { BrowserWindow, Menu, MenuItem } from "electron";

/**
 * Filters the reload menu items from the default menu and updates the application menu.
 * @param defaultMenuTemplate The default menu to filter.
 */
export const filterReloadMenu = () => {
  const defaultMenuTemplate = Menu.getApplicationMenu();
  if (!defaultMenuTemplate) return;

  const viewMenu = defaultMenuTemplate.items.find(
    (item) => item.label === "View"
  );

  // Filter out the reload menu items
  if (viewMenu && viewMenu.submenu) {
    const filteredItems = viewMenu.submenu.items.filter(
      (item) =>
        !["Reload", "Toggle Developer Tools", "Force Reload"].includes(
          item.label
        )
    );

    // Rebuild menu
    const newSubmenu = Menu.buildFromTemplate(
      filteredItems.map((item) => {
        if (item.type === "separator") {
          return { type: "separator" };
        }

        return {
          label: item.label,
          click: (
            menuItem: MenuItem,
            browserWindow?: BrowserWindow,
            event?: Electron.KeyboardEvent
          ) => {
            if (item.click) {
              item.click(menuItem, browserWindow, event);
            }
          },
        };
      })
    );

    // Include new view menu
    const newViewMenu = {
      ...viewMenu,
      submenu: newSubmenu,
    };

    // Create Menu Template
    const newMenuTemplate = defaultMenuTemplate.items.map((item) =>
      item.label === "View" ? newViewMenu : item
    );

    // Set New Menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(newMenuTemplate));
  }
};
