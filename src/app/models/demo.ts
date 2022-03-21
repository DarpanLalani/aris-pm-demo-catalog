export interface DemoModel {
  name: string,
  link: string,
  thumbnail: string,
  description?: string,
  comingSoon?: boolean,
  underMaintenance?: boolean,
  detailPage?: string
}

export interface VersionInfo {
  updateAvailable?: string;
  updateURL?: string;
  fileName?: string;
}