"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PackageSearch } from "lucide-react";
import { createTrackedService } from "@/service/tracked-service";
import { getMe } from "@/service/auth";
import { T } from "@/components/ui/T";
import type { TrackedServiceItem } from "@/types/tracked-service";

export function TrackServiceButton({
  slug,
}: {
  slug: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    setLoading(true);
    const me = await getMe();
    if (!me.success) {
      router.push("/login");
      setLoading(false);
      return;
    }
    const res = await createTrackedService({ serviceSlug: slug });
    setLoading(false);
    if (res.success && res.data) {
      const tracked = res.data as TrackedServiceItem;
      router.push(`/dashboard/applications/${tracked.id}`);
      router.refresh();
    } else {
      alert(res.message || "Failed to track service");
    }
  };

  return (
    <Button
      onClick={handleTrack}
      disabled={loading}
      className="w-full"
      icon={<PackageSearch className="h-4 w-4" aria-hidden="true" />}
    >
      {loading ? (
        <T bn="ট্র্যাক হচ্ছে…" en="Tracking…" />
      ) : (
        <T bn="এই সেবা ট্র্যাক করুন" en="Track this service" />
      )}
    </Button>
  );
}

export default TrackServiceButton;
