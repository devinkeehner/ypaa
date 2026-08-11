import config from "../payload.config";
import { getPayload } from "payload";

type LayoutBlock = Record<string, unknown> & { blockType: string };

const pages: Array<{ title: string; slug: string; description: string; layout: LayoutBlock[] }> = [
  {
    title: "Events",
    slug: "events",
    description: "Fundraisers, fellowship nights, and workshops on the road to NECYPAA XXXVI.",
    layout: [
      { blockType: "About", eyebrow: "On the road to Hartford", heading: "Good things happen when we get together.", body: "Every fundraiser, workshop, and late-night coffee has helped carry this convention forward. Come through, bring a friend, and stay connected.", advisoryHeading: "Coming up", advisoryBody: "Details change as plans come together, so check back before you head out.", image: null },
      { blockType: "IssueCards", heading: "What’s coming up", intro: "A few places to plug in before the convention.", variant: "cards", cards: [
        { label: "Next up", heading: "Three Frogs on a Log", body: "A Step Two and Three workshop with four short speakers and time for questions. Bring a newcomer, a sponsee, or just yourself.", linkLabel: "Join on Zoom", linkUrl: "https://zoom.us/j/82907227031" },
        { label: "August 22, 2026", heading: "Saturday night workshop", body: "Online, 8:30–10:30 PM Eastern. Zoom ID 829 0722 7031, passcode 647178.", linkLabel: "Add it to your calendar", linkUrl: "https://necypaact.com/en/events" },
      ] },
      { blockType: "IssueCards", heading: "Recent nights", intro: "A look back at the events that brought people together.", variant: "cards", cards: [
        { label: "July 11, 2026", heading: "Abducted by Sobriety", body: "Italian dinner, a speaker meeting, and a dance at Pathfinders Club in Manchester. Alien costumes were optional; fellowship was not." },
        { label: "April 25, 2026", heading: "The Ultimate Cool Down", body: "Ice cream, speed fellowship, and a room full of people who were glad to be there." },
        { label: "February 13, 2026", heading: "Zombie Prom", body: "A meeting, a dance, and a very good reason to get dressed up with friends." },
      ] },
      { blockType: "CallToAction", eyebrow: "Stay in the loop", heading: "Want the next date first?", body: "Pre-register for NECYPAA XXXVI and keep an eye on the calendar as more events are announced.", primaryLabel: "Pre-register", primaryUrl: "#", secondaryLabel: "Contact the committee", secondaryUrl: "mailto:info@necypaa.org", image: null },
    ],
  },
  {
    title: "Our Journey",
    slug: "journey",
    description: "The fundraisers, meetings, and friendships that are carrying NECYPAA XXXVI to Hartford.",
    layout: [
      { blockType: "About", eyebrow: "The road here", heading: "The journey is the point.", body: "NECYPAA XXXVI did not appear overnight. It has been built one meeting, one fundraiser, and one new friendship at a time.", advisoryHeading: "What we are keeping", advisoryBody: "The memories matter, but so do the people who showed up to make them." , image: null },
      { blockType: "IssueCards", heading: "A few stops along the way", intro: "Every event added a little more momentum—and a lot more fellowship.", variant: "editorial", cards: [
        { label: "2026", heading: "Abducted by Sobriety", body: "A dinner, a speaker meeting, and a dance in Manchester that reminded us how much fun sober fellowship can be." },
        { label: "2026", heading: "The Ultimate Cool Down", body: "An ice cream social at CCAR with speed fellowship, laughter, and room for new faces." },
        { label: "2026", heading: "Zombie Prom", body: "A packed night in Enfield: meeting first, dancing after, and plenty of people staying until the lights came on." },
        { label: "2025", heading: "Cardboard Masquerade", body: "Masks, board games, pizza, and a reminder that service can be both meaningful and a little ridiculous." },
        { label: "2025", heading: "Game Night & Pajama Party", body: "A Tradition Five meeting followed by games, fellowship, and a relaxed night at Pathfinders Club." },
        { label: "2024", heading: "Rave: Halloween 2.0", body: "One night of fright was not enough. The event helped get the bid moving and gave people a reason to come back." },
      ] },
      { blockType: "QuoteBlock", heading: "Why it matters", quote: "Every event on this timeline brought people together. That is the whole point.", attribution: "NECYPAA XXXVI host committee", role: "Hartford, Connecticut", image: null },
    ],
  },
  {
    title: "Accessibility & Inclusion",
    slug: "accessibility",
    description: "Accessibility information and accommodation support for NECYPAA XXXVI.",
    layout: [
      { blockType: "About", eyebrow: "Everyone belongs here", heading: "Accessibility is part of the plan, not an afterthought.", body: "We want NECYPAA XXXVI to be welcoming online and in person. If something would make it easier for you to take part, please let us know.", advisoryHeading: "Need something specific?", advisoryBody: "Reach out early when you can. We will do our best to help with interpretation, mobility, food needs, and other accommodations.", image: null },
      { blockType: "IssuesSection", eyebrow: "Our approach", heading: "Clear, practical access.", body: "We are building the convention with the people who will use it in mind.", issues: [
        { icon: "01", title: "Digital access", body: "Readable text, keyboard navigation, visible focus states, captions where possible, and controls that respect reduced-motion settings." },
        { icon: "02", title: "At the venue", body: "We are planning for accessible entrances, restrooms, quiet space, and food options that account for common dietary needs." },
        { icon: "03", title: "Communication", body: "ASL interpretation and other support can be requested. The sooner we hear from you, the more options we have." },
      ] },
      { blockType: "IssueCards", heading: "Tell us what would help", intro: "There is no wrong question. Start with the option that feels easiest.", variant: "cards", cards: [
        { label: "Accommodations", heading: "Request support", body: "Tell us about interpretation, mobility, dietary, sensory, or other needs for the convention.", linkLabel: "Email the committee", linkUrl: "mailto:info@necypaa.org?subject=NECYPAA%20XXXVI%20accommodation%20request" },
        { label: "Website feedback", heading: "Report an access problem", body: "If something on this site gets in the way, please tell us. Anonymous feedback is welcome.", linkLabel: "Send feedback", linkUrl: "mailto:info@necypaa.org?subject=Website%20accessibility%20feedback" },
      ] },
    ],
  },
  {
    title: "ASL Resources",
    slug: "asl",
    description: "American Sign Language interpretation and accessibility resources for NECYPAA XXXVI.",
    layout: [
      { blockType: "About", eyebrow: "ASL at NECYPAA", heading: "We are working toward full access.", body: "The committee is coordinating American Sign Language interpretation for main speakers and key events. Plans are still taking shape, and we will keep this page current as details are confirmed.", advisoryHeading: "Need interpretation?", advisoryBody: "Please include that in your registration or email the committee directly. Early requests help us plan well.", image: null },
      { blockType: "ActionTabs", heading: "What to expect", intro: "We will share final interpreter and program information here as it is confirmed.", tabs: [
        { label: "Main events", description: "We are actively planning ASL interpretation for main speakers and key convention moments." },
        { label: "Your request", description: "Let us know what would make the weekend more accessible for you. We will follow up about what we can provide." },
      ] },
      { blockType: "CallToAction", eyebrow: "Let’s plan together", heading: "Have a question about access?", body: "Send us a note. We would rather talk it through than have you wonder whether the convention can work for you.", primaryLabel: "Email accessibility support", primaryUrl: "mailto:info@necypaa.org?subject=ASL%20support%20at%20NECYPAA%20XXXVI", secondaryLabel: "Read accessibility information", secondaryUrl: "/accessibility", image: null },
    ],
  },
  {
    title: "Al-Anon & Alateen",
    slug: "alanon",
    description: "Resources for friends and family of alcoholics attending NECYPAA XXXVI.",
    layout: [
      { blockType: "About", eyebrow: "Friends and family", heading: "You are welcome here, too.", body: "This page is for friends and family members affected by someone else’s drinking. Al-Anon and Alateen meetings will be part of NECYPAA XXXVI, with more program details to come.", advisoryHeading: "A quick note", advisoryBody: "NECYPAA is not affiliated with Al-Anon Family Groups, Inc. These are independent resources offered for anyone looking for support.", image: null },
      { blockType: "IssueCards", heading: "Start where you are", intro: "A few good places to learn more or find a meeting.", variant: "cards", cards: [
        { label: "Al-Anon", heading: "Is Al-Anon for me?", body: "A short self-assessment for people wondering whether Al-Anon might be a helpful place to start.", linkLabel: "Visit Al-Anon", linkUrl: "https://al-anon.org/newcomers/self-quiz/" },
        { label: "Alateen", heading: "Support for teens", body: "Alateen is a fellowship for young people whose lives have been affected by someone else’s drinking.", linkLabel: "Learn about Alateen", linkUrl: "https://al-anon.org/newcomers/teen-corner-alateen/" },
        { label: "Meetings", heading: "Find a meeting", body: "Search for Al-Anon meetings near you or online. Online meetings can make support easier to reach across the Northeast.", linkLabel: "Find Al-Anon meetings", linkUrl: "https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/" },
      ] },
      { blockType: "CallToAction", eyebrow: "At the convention", heading: "More program details are on the way.", body: "We will post Al-Anon and Alateen meeting information as it is finalized. In the meantime, reserve your room and keep in touch.", primaryLabel: "Book a hotel room", primaryUrl: "#", secondaryLabel: "Contact the committee", secondaryUrl: "mailto:info@necypaa.org", image: null },
    ],
  },
  {
    title: "Member States & Local Resources",
    slug: "states",
    description: "AA resources, intergroups, and young people’s meetings across the NECYPAA region.",
    layout: [
      { blockType: "About", eyebrow: "Across the region", heading: "Find recovery close to home.", body: "NECYPAA is connected to young people and local service bodies across New England, the Mid-Atlantic, and Washington, D.C. Use these starting points to find meetings and local resources.", advisoryHeading: "Tradition Six", advisoryBody: "These are resource links, not affiliations. Each site is maintained by its local service body or committee.", image: null },
      { blockType: "ResultsStats", heading: "A wide circle", intro: "The convention is rooted in Connecticut and connected across the region.", stats: [
        { value: "11", label: "states and D.C.", detail: "Local meetings, intergroups, and YPAA communities across the NECYPAA region." },
        { value: "12", label: "young people’s groups", detail: "A growing network of meetings with a young-person focus." },
        { value: "1", label: "shared purpose", detail: "To make recovery and fellowship easier to find." },
      ] },
      { blockType: "IssueCards", heading: "Regional starting points", intro: "Choose a nearby area, then follow local resources from there.", variant: "cards", cards: [
        { label: "New England", heading: "Maine, New Hampshire, Vermont, Massachusetts, Rhode Island, and Connecticut", body: "Look for local intergroups, central offices, and young people’s meetings in your area.", linkLabel: "Search AA meetings", linkUrl: "https://www.aa.org/find-aa" },
        { label: "Mid-Atlantic", heading: "New York, New Jersey, Pennsylvania, Delaware, Maryland, and D.C.", body: "Many areas offer both local listings and online meeting options.", linkLabel: "Search AA meetings", linkUrl: "https://www.aa.org/find-aa" },
        { label: "Have a resource to share?", heading: "Help keep this list useful.", body: "If you know a meeting or resource that belongs here, send it to the committee and we will take a look.", linkLabel: "Send a resource", linkUrl: "mailto:info@necypaa.org?subject=Regional%20resource%20suggestion" },
      ] },
    ],
  },
  {
    title: "Stories from the Road",
    slug: "blog",
    description: "Experience, strength, and hope from the road to NECYPAA XXXVI.",
    layout: [
      { blockType: "About", eyebrow: "NECYBLOG", heading: "Stories from the road to Hartford.", body: "A few honest notes from people doing the work: service, friendship, recovery, and the occasional very late night. Take what helps and leave the rest.", advisoryHeading: "Want to contribute?", advisoryBody: "More stories are coming as the road to NECYPAA XXXVI continues.", image: null },
      { blockType: "IssueCards", heading: "Recent notes", intro: "Written by people on the committee, in their own voices.", variant: "editorial", cards: [
        { label: "March 15, 2026", heading: "A Complaint I Can’t Seem to Make", body: "I keep looking for something to grumble about, but service has left my life fuller than it was before. The annoying part is that I am grateful." },
        { label: "March 10, 2026", heading: "Placed Where I’m Needed", body: "A hard weekend softened when someone needed help. Being useful pulled me out of my own head and reminded me why service matters." },
        { label: "March 5, 2026", heading: "A Life Beyond My Wildest Dreams", body: "Being part of this committee has brought more love and joy into my life than I knew how to ask for." },
        { label: "March 1, 2026", heading: "YPAA Saved My Life", body: "From a first young people’s meeting at twenty-four hours sober to a life that includes service, friendship, and a place to belong." },
      ] },
      { blockType: "QuoteBlock", heading: "From the committee", quote: "The best part of this work is watching people find a place in it—and then helping someone else find theirs.", attribution: "A host committee member", role: "NECYPAA XXXVI", image: null },
    ],
  },
];

async function seed() {
  const payload = await getPayload({ config });

  for (const page of pages) {
    const existing = await payload.find({ collection: "pages", limit: 1, depth: 0, where: { slug: { equals: page.slug } }, overrideAccess: true });
    const data = { title: page.title, slug: page.slug, layout: page.layout, meta: { title: page.title, description: page.description }, _status: "published" as const };

    if (existing.docs[0]) {
      await payload.update({ collection: "pages", id: existing.docs[0].id, data, depth: 0, draft: false, overrideAccess: true });
    } else {
      await payload.create({ collection: "pages", data, depth: 0, draft: false, overrideAccess: true });
    }
  }

  console.log(`Created or updated ${pages.length} archive pages.`);
}

await seed();
process.exit(0);
