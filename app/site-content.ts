export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type EventCard = {
  title: string;
  date: string;
  location: string;
  description?: string;
  palette: "violet" | "cyan" | "ember" | "midnight";
};

export type SiteContent = {
  nav: LinkItem[];
  convention: {
    title: string;
    theme: string;
    location: string;
    venue: string;
    dateRange: string;
    countdownIso: string;
    registerUrl: string;
    hotelUrl: string;
  };
  about: {
    heading: string;
    paragraphs: string[];
    experiences: string[];
  };
  meeting: {
    date: string;
    time: string;
    description: string;
    zoomUrl: string;
    importantDates: { date: string; label: string }[];
  };
  featuredEvent: EventCard;
  pastEvents: EventCard[];
  ypaaMeetings: { state: string; name: string; href: string }[];
};

// This object is intentionally CMS-shaped. A future Payload global or Puck data
// adapter can replace it without changing the presentational components.
export const siteContent: SiteContent = {
  nav: [
    { label: "About", href: "#about" },
    { label: "Meetings", href: "#business-meeting" },
    { label: "Events", href: "#events" },
    { label: "YPAA near you", href: "#ypaa" },
    { label: "Accessibility", href: "#accessibility" },
  ],
  convention: {
    title: "NECYPAA XXXVI",
    theme: "Escaping the Mad Realm",
    location: "Hartford, Connecticut",
    venue: "Hartford Marriott Downtown",
    dateRange: "December 31, 2026 – January 3, 2027",
    countdownIso: "2026-12-31T17:00:00-05:00",
    registerUrl: "https://reg.necypaact.com",
    hotelUrl: "https://www.necypaact.com/hotel",
  },
  about: {
    heading: "Four days. One fellowship. A way out of the ordinary.",
    paragraphs: [
      "NECYPAA brings young people in Alcoholics Anonymous together from across the Northeast for speakers, workshops, dancing, service, and the kind of connection that makes recovery feel possible.",
      "Young means young at heart. Whether this is your first sober event or your fiftieth convention, you are welcome here.",
    ],
    experiences: [
      "AA speakers and workshops",
      "24-hour meetings and fellowship",
      "New Year’s Eve celebration",
      "Dances, events, and service",
    ],
  },
  meeting: {
    date: "Sunday, August 16, 2026",
    time: "2:00 PM Eastern",
    description:
      "See how the convention is built through committee work, updates, votes, and fellowship. No title or commitment is required—just show up.",
    zoomUrl: "https://www.necypaact.com/service",
    importantDates: [
      { date: "Aug 16", label: "Host committee business meeting" },
      { date: "Aug 22", label: "Three Frogs on a Log online workshop" },
      { date: "Dec 31", label: "Convention opens at 5:00 PM" },
      { date: "Jan 3", label: "Convention closes" },
    ],
  },
  featuredEvent: {
    title: "Three Frogs on a Log",
    date: "Saturday, August 22, 2026",
    location: "Online via Zoom",
    description:
      "A Step Two and Three workshop with four mini-speakers and a live Q&A.",
    palette: "cyan",
  },
  pastEvents: [
    {
      title: "The Ultimate Cool Down",
      date: "April 25, 2026",
      location: "Willimantic, CT",
      palette: "cyan",
    },
    {
      title: "Zombie Prom",
      date: "February 13, 2026",
      location: "Enfield, CT",
      palette: "ember",
    },
    {
      title: "New Year’s Eve Bonfire",
      date: "December 31, 2025",
      location: "Connecticut",
      palette: "violet",
    },
    {
      title: "Cardboard Masquerade",
      date: "May 30, 2025",
      location: "Farmington, CT",
      palette: "midnight",
    },
  ],
  ypaaMeetings: [
    { state: "Connecticut", name: "CT Young People in AA", href: "https://ct-aa.org/" },
    { state: "Maine", name: "Maine YPAA", href: "https://necypaa.org/" },
    { state: "Massachusetts", name: "Massachusetts YPAA", href: "https://necypaa.org/" },
    { state: "New Hampshire", name: "New Hampshire YPAA", href: "https://necypaa.org/" },
    { state: "New Jersey", name: "New Jersey YPAA", href: "https://necypaa.org/" },
    { state: "New York", name: "New York YPAA", href: "https://necypaa.org/" },
    { state: "Pennsylvania", name: "Pennsylvania YPAA", href: "https://necypaa.org/" },
    { state: "Rhode Island", name: "Rhode Island YPAA", href: "https://aainri.com/" },
    { state: "Vermont", name: "Vermont YPAA", href: "https://aavt.org/" },
    { state: "Northeast", name: "NECYPAA Advisory", href: "https://necypaa.org/" },
  ],
};
