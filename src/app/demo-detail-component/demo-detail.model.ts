export interface DemoDetails {
    id?: string;
    name?: string;
    banner?: string;
    description?: string;
    tagline?: string;
    meta?: {
        lastUpdate: string;
        version: string;
        contact: {
            name: string;
            email: string;
        };
        preview?: string;
        archive?: string;
        supportedAppBuilder?: string;
        postInstallationMsg?: string;
        exceptionHost?: string[];
        widgetDependencies?: WidgetDependencyDescription[];
        acceleratorDependencies?: WidgetDependencyDescription[];
        forceUpgrade: boolean;
    };
    assets?: {
        images: string[];
        videos: string[];
        media: string[];
    };
    comingSoon?: boolean;
    underMaintenance?: boolean;
}

export interface WidgetDependencyDescription {
    id: string;
    title: string;
    repository: string;
    link?: string;
    fileName: string;
    binaryLink?: string;
    requiredPlatformVersion?: string;
}