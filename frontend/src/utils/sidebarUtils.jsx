// filepath: src/utils/sidebarUtils.js
import * as Icons from "@mui/icons-material";

export const getIcon = (iconName) => {
  if (!iconName) return null;
  const IconComponent = Icons[iconName];
  return IconComponent ? <IconComponent color="primary" /> : <Icons.HelpOutline color="error" />;
};