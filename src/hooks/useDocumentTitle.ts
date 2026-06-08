import { useEffect } from "react";
import { useSettings } from "@/src/context/SettingsContext";

export function useDocumentTitle(title: string) {
  const { settings } = useSettings();
  
  useEffect(() => {
    const websiteName = settings?.website_name || "MINIMAL";
    document.title = title ? `${title} | ${websiteName}` : websiteName;
  }, [title, settings?.website_name]);
}
