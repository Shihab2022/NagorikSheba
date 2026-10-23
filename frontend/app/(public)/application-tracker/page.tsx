import type { Metadata } from "next";
import { TrackerView } from "./TrackerView";

export const metadata: Metadata = {
  title: "Application Tracker",
  description: "Track where your government application stands — demo UI showing how live status tracking will work.",
};

export default function TrackerPage() {
  return <TrackerView />;
}

