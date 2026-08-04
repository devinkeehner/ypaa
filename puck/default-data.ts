import type { NECYPAAData } from "./types";

export const defaultPageData: NECYPAAData = {
  root: { props: { title: "NECYPAA XXXVI" } },
  content: [
    {
      type: "HeroCountdown",
      props: {
        id: "hero",
        eyebrow: "Escaping the Mad Realm",
        heading: "NECYPAA XXXVI",
        body: "Four days of recovery, fellowship, service, and celebration in Hartford, Connecticut.",
        eventDate: "December 31, 2026 – January 3, 2027",
        eventLocation: "Hartford Marriott Downtown",
        countdownTarget: "2026-12-31T17:00:00-05:00",
        registerLabel: "Register",
        registerUrl: "https://register.necypaact.com/en/register",
        hotelLabel: "Book a hotel room",
        hotelUrl: "https://www.necypaact.com/hotel",
      },
    },
    {
      type: "About",
      props: {
        id: "about",
        eyebrow: "About NECYPAA",
        heading: "Four days. One fellowship. A way out of the ordinary.",
        body: "NECYPAA brings young people in Alcoholics Anonymous together from across the Northeast for speakers, workshops, dancing, service, and the kind of connection that makes recovery feel possible. Young means young at heart—whether this is your first sober event or your fiftieth convention, you are welcome here.",
        advisoryHeading: "Anonymity matters",
        advisoryBody: "Please help protect personal anonymity when sharing photos or stories from convention spaces.",
      },
    },
    {
      type: "MeetingInfo",
      props: {
        id: "business-meeting",
        eyebrow: "Host committee",
        heading: "Business meeting",
        body: "See how the convention is built through committee work, updates, votes, and fellowship. No title or commitment is required—just show up.",
        date: "Sunday, August 16, 2026",
        time: "2:00 PM Eastern",
        location: "Online via Zoom",
        actionLabel: "Join on Zoom",
        actionUrl: "https://www.necypaact.com/service",
        importantDates: "Aug 16 — Host committee business meeting\nAug 22 — Three Frogs on a Log workshop\nDec 31 — Convention opens at 5:00 PM\nJan 3 — Convention closes",
      },
    },
    {
      type: "Events",
      props: {
        id: "events",
        eyebrow: "Gather with us",
        heading: "Upcoming and past events",
        upcomingLabel: "Next up",
        upcomingTitle: "Three Frogs on a Log",
        upcomingBody: "A Step Two and Three workshop with four mini-speakers and a live Q&A.",
        upcomingDate: "Saturday, August 22, 2026",
        upcomingLocation: "Online via Zoom",
        pastEvents: "The Ultimate Cool Down — April 25, 2026\nZombie Prom — February 13, 2026\nNew Year’s Eve Bonfire — December 31, 2025\nCardboard Masquerade — May 30, 2025",
      },
    },
    {
      type: "MeetingDirectory",
      props: {
        id: "ypaa",
        eyebrow: "Across the Northeast",
        heading: "YPAA meetings near you",
        body: "Find young people’s meetings and committees throughout the region.",
        meetings: "Connecticut YPAA — Connecticut\nMaine YPAA — Maine\nMassachusetts YPAA — Massachusetts\nNew Hampshire YPAA — New Hampshire\nNew Jersey YPAA — New Jersey\nNew York YPAA — New York\nPennsylvania YPAA — Pennsylvania\nRhode Island YPAA — Rhode Island\nVermont YPAA — Vermont",
      },
    },
    {
      type: "CallToAction",
      props: {
        id: "register",
        eyebrow: "See you in Hartford",
        heading: "Ready for NECYPAA XXXVI?",
        body: "Register for the convention and reserve your room while space is available.",
        primaryLabel: "Register",
        primaryUrl: "https://register.necypaact.com/en/register",
        secondaryLabel: "Book a hotel room",
        secondaryUrl: "https://www.necypaact.com/hotel",
      },
    },
  ],
  zones: {},
};
