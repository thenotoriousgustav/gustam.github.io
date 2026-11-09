"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Payload Live Preview: when this page is open in the admin's preview iframe,
 * re-render it each time the document is saved. Visitors get nothing.
 */
export default function LivePreviewRefresh() {
  const router = useRouter();
  // The admin runs on the same origin as the page it previews.
  const [origin, setOrigin] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- window is only known after mount
    if (window.self !== window.top) setOrigin(window.location.origin);
  }, []);
  if (!origin) return null;
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={origin} />;
}
