// config/sidebar-list.js
import routes from "../routes/routes";

const sidebarItem = (routesList, parentPath = "") =>
  routesList
    .filter(r => r.showInSidebar !== false)            // hanya yg showInSidebar === true
    .map(r => {
      const fullPath = `${parentPath}/${r.path}`.replace(/\/+/g, "/");
      return {
        path: fullPath,
        title: r.title ?? r.component,                  // pastikan kamu sudah tambahkan field `title` di routes jika perlu
        icon: r.icon,
        children: r.children
          ? sidebarItem(r.children, fullPath)
          : undefined,
      };
    });

export default sidebarItem(routes);
