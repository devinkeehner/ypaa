import type { NECYPAAData } from "./types";
import { ctMeetingSchedule } from "./ct-meeting-schedule-data";

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
        registerUrl: "/register",
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
        importantDates: [
          { date: "Aug 16", label: "Host committee business meeting" },
          { date: "Aug 22", label: "Three Frogs on a Log workshop" },
          { date: "Dec 31", label: "Convention opens at 5:00 PM" },
          { date: "Jan 3", label: "Convention closes" },
        ],
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
        upcomingEvents: [],
        pastEvents: [
          { title: "The Ultimate Cool Down", date: "April 25, 2026" },
          { title: "Zombie Prom", date: "February 13, 2026" },
          { title: "New Year’s Eve Bonfire", date: "December 31, 2025" },
          { title: "Cardboard Masquerade", date: "May 30, 2025" },
        ],
      },
    },
    {
      type: "MeetingDirectory",
      props: {
        id: "ypaa",
        eyebrow: "Across the Northeast",
        heading: "YPAA meetings near you",
        body: "Find young people’s meetings and committees throughout the region.",
        meetings: [
          { name: "Connecticut YPAA", location: "Connecticut" },
          { name: "Maine YPAA", location: "Maine" },
          { name: "Massachusetts YPAA", location: "Massachusetts" },
          { name: "New Hampshire YPAA", location: "New Hampshire" },
          { name: "New Jersey YPAA", location: "New Jersey" },
          { name: "New York YPAA", location: "New York" },
          { name: "Pennsylvania YPAA", location: "Pennsylvania" },
          { name: "Rhode Island YPAA", location: "Rhode Island" },
          { name: "Vermont YPAA", location: "Vermont" },
        ],
      },
    },
    {
      type: "CTMeetingSchedule",
      props: {
        id: "ct-meeting-schedule",
        heading: "Young People's Meetings in Connecticut",
        introduction: "Click any meeting name for the CT-AA details. Use the arrow to expand the address and meeting types.",
        meetings: ctMeetingSchedule,
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
        primaryUrl: "/register",
        secondaryLabel: "Book a hotel room",
        secondaryUrl: "https://www.necypaact.com/hotel",
      },
    },
  ],
  zones: {},
};
