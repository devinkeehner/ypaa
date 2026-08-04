"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { EventCard, SiteContent } from "./site-content";

type Theme = "dark" | "light";
type TextScale = "default" | "large" | "largest";

const externalLabel = " (opens in a new tab)";

function ArrowIcon({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={direction === "left" ? "flip" : ""}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14 5h5v5M19 5l-8 8M18 13v6H5V6h6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function BrandMark() {
  return (
    <a className="brand" href="#top" aria-label="NECYPAA XXXVI home">
      <span className="brand-orbit" aria-hidden="true">
        <span>36</span>
      </span>
      <span className="brand-copy">
        <strong>NECYPAA</strong>
        <small>Hartford · 2026</small>
      </span>
    </a>
  );
}

function ActionLink({
  href,
  children,
  variant = "primary",
  external = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  external?: boolean;
}) {
  return (
    <a
      className={`button button-${variant}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      <span>{children}</span>
      {external ? <ExternalIcon /> : <ArrowIcon />}
      {external ? <span className="sr-only">{externalLabel}</span> : null}
    </a>
  );
}

function AccessibilityPanel({
  theme,
  textScale,
  contrast,
  onTheme,
  onTextScale,
  onContrast,
  onClose,
}: {
  theme: Theme;
  textScale: TextScale;
  contrast: boolean;
  onTheme: (theme: Theme) => void;
  onTextScale: (scale: TextScale) => void;
  onContrast: (value: boolean) => void;
  onClose: () => void;
}) {
  return (
    <aside className="access-panel" aria-labelledby="access-title">
      <div className="access-heading">
        <div>
          <p className="section-label">Display settings</p>
          <h2 id="access-title">Make this site easier to read</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close accessibility settings">
          <CloseIcon />
        </button>
      </div>

      <fieldset>
        <legend>Color theme</legend>
        <div className="segmented">
          <button type="button" aria-pressed={theme === "light"} onClick={() => onTheme("light")}>Light</button>
          <button type="button" aria-pressed={theme === "dark"} onClick={() => onTheme("dark")}>Dark</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>Text size</legend>
        <div className="segmented">
          <button type="button" aria-pressed={textScale === "default"} onClick={() => onTextScale("default")}>A</button>
          <button type="button" aria-pressed={textScale === "large"} onClick={() => onTextScale("large")}>A+</button>
          <button type="button" aria-pressed={textScale === "largest"} onClick={() => onTextScale("largest")}>A++</button>
        </div>
      </fieldset>

      <label className="toggle-row">
        <span>
          <strong>Extra contrast</strong>
          <small>Strengthen borders and text contrast</small>
        </span>
        <input type="checkbox" checked={contrast} onChange={(event) => onContrast(event.target.checked)} />
      </label>
      <p className="access-note">Motion also follows your device’s reduced-motion preference.</p>
    </aside>
  );
}

function getCountdown(target: string) {
  const difference = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(difference / 86_400_000),
    hours: Math.floor((difference / 3_600_000) % 24),
    minutes: Math.floor((difference / 60_000) % 60),
    seconds: Math.floor((difference / 1_000) % 60),
  };
}

function Countdown({ target }: { target: string }) {
  const [time, setTime] = useState(() => getCountdown(target));

  useEffect(() => {
    const interval = window.setInterval(() => setTime(getCountdown(target)), 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  const units = [
    [time.days, "days"],
    [time.hours, "hours"],
    [time.minutes, "minutes"],
    [time.seconds, "seconds"],
  ] as const;

  return (
    <div className="countdown-wrap">
      <div className="countdown-heading">
        <span>Convention begins in</span>
        <span className="countdown-target">5:00 PM ET · Dec 31</span>
      </div>
      <div className="countdown" aria-label={`${time.days} days, ${time.hours} hours, ${time.minutes} minutes until NECYPAA begins`}>
        {units.map(([value, unit]) => (
          <div className="time-unit" key={unit}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArtPanel({ label, palette, className = "" }: { label: string; palette: EventCard["palette"]; className?: string }) {
  return (
    <div className={`art-panel art-${palette} ${className}`} role="img" aria-label={label}>
      <div className="art-moon" />
      <div className="art-gate" />
      <div className="art-path" />
      <span className="art-caption">Imagery placeholder</span>
    </div>
  );
}

function EventCardView({ event }: { event: EventCard }) {
  return (
    <article className="past-card">
      <ArtPanel palette={event.palette} label={`Placeholder artwork for ${event.title}`} />
      <div className="past-card-copy">
        <p>{event.date}</p>
        <h3>{event.title}</h3>
        <span>{event.location}</span>
      </div>
    </article>
  );
}

export function SiteHome({ content }: { content: SiteContent }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const saved = window.localStorage.getItem("necypaa-theme");
    return saved === "light" ? "light" : "dark";
  });
  const [textScale, setTextScale] = useState<TextScale>(() => {
    if (typeof window === "undefined") return "default";
    const saved = window.localStorage.getItem("necypaa-text");
    return saved === "large" || saved === "largest" ? saved : "default";
  });
  const [contrast, setContrast] = useState(() =>
    typeof window !== "undefined" && window.localStorage.getItem("necypaa-contrast") === "true",
  );
  const [accessOpen, setAccessOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.localStorage.setItem("necypaa-theme", theme);
    window.localStorage.setItem("necypaa-text", textScale);
    window.localStorage.setItem("necypaa-contrast", String(contrast));
  }, [theme, textScale, contrast]);

  const siteClass = useMemo(
    () => `site theme-${theme} text-${textScale}${contrast ? " high-contrast" : ""}`,
    [theme, textScale, contrast],
  );

  const scrollRail = (direction: number) => {
    railRef.current?.scrollBy({ left: direction * 330, behavior: "smooth" });
  };

  return (
    <div className={siteClass} id="top">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="header-inner">
          <BrandMark />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {content.nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
          </nav>
          <div className="header-actions">
            <button className="access-button" type="button" onClick={() => setAccessOpen(true)} aria-haspopup="dialog" aria-expanded={accessOpen}>
              <span aria-hidden="true">Aa</span>
              <span className="access-label">Display</span>
            </button>
            <ActionLink href={content.convention.hotelUrl} variant="ghost">Book hotel</ActionLink>
            <ActionLink href={content.convention.registerUrl}>Register</ActionLink>
            <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        {menuOpen ? (
          <nav className="mobile-menu" aria-label="Mobile navigation">
            {content.nav.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
          </nav>
        ) : null}
      </header>

      {accessOpen ? (
        <div className="access-overlay" role="dialog" aria-modal="true" aria-label="Accessibility settings" onMouseDown={(event) => event.target === event.currentTarget && setAccessOpen(false)}>
          <AccessibilityPanel
            theme={theme}
            textScale={textScale}
            contrast={contrast}
            onTheme={setTheme}
            onTextScale={setTextScale}
            onContrast={setContrast}
            onClose={() => setAccessOpen(false)}
          />
        </div>
      ) : null}

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true">
            <div className="hero-orb orb-one" />
            <div className="hero-orb orb-two" />
            <div className="hero-tower tower-one" />
            <div className="hero-tower tower-two" />
            <div className="hero-portal" />
          </div>
          <div className="hero-content page-shell">
            <p className="hero-theme">{content.convention.theme}</p>
            <h1 id="hero-title">{content.convention.title}</h1>
            <p className="hero-location">{content.convention.location}</p>
            <p className="hero-meta">{content.convention.dateRange}<br />{content.convention.venue}</p>
            <div className="hero-actions">
              <ActionLink href={content.convention.registerUrl}>Register now</ActionLink>
              <ActionLink href={content.convention.hotelUrl} variant="secondary">Book a hotel room</ActionLink>
            </div>
            <Countdown target={content.convention.countdownIso} />
          </div>
          <a className="scroll-cue" href="#about">Discover the convention <ArrowIcon /></a>
        </section>

        <section className="about section-pad" id="about" aria-labelledby="about-title">
          <div className="page-shell about-grid">
            <ArtPanel className="about-art" palette="violet" label="Placeholder for toned-down Escaping the Mad Realm convention artwork" />
            <div className="about-copy">
              <p className="section-label">About NECYPAA</p>
              <h2 id="about-title">{content.about.heading}</h2>
              {content.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <ul className="experience-list">
                {content.about.experiences.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <a className="text-link" href="https://necypaa.org/about/" target="_blank" rel="noreferrer">Learn about NECYPAA <ExternalIcon /><span className="sr-only">{externalLabel}</span></a>
            </div>
          </div>
        </section>

        <section className="meeting section-pad" id="business-meeting" aria-labelledby="meeting-title">
          <div className="page-shell meeting-grid">
            <div className="meeting-main">
              <p className="section-label">Host committee</p>
              <h2 id="meeting-title">The convention gets built when people show up.</h2>
              <p>{content.meeting.description}</p>
              <div className="meeting-date">
                <div><span>Next meeting</span><strong>{content.meeting.date}</strong></div>
                <div><span>Time</span><strong>{content.meeting.time}</strong></div>
              </div>
              <ActionLink href={content.meeting.zoomUrl}>Join on Zoom</ActionLink>
            </div>
            <aside className="date-board" aria-labelledby="dates-title">
              <p className="section-label">On the horizon</p>
              <h3 id="dates-title">Important dates</h3>
              <ol>
                {content.meeting.importantDates.map((item) => (
                  <li key={`${item.date}-${item.label}`}><time>{item.date}</time><span>{item.label}</span></li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="featured section-pad" id="events" aria-labelledby="featured-title">
          <div className="page-shell featured-grid">
            <ArtPanel palette={content.featuredEvent.palette} label={`Placeholder event artwork for ${content.featuredEvent.title}`} />
            <div className="featured-copy">
              <p className="section-label">Coming up next</p>
              <h2 id="featured-title">{content.featuredEvent.title}</h2>
              <p>{content.featuredEvent.description}</p>
              <dl className="event-facts">
                <div><dt>Date</dt><dd>{content.featuredEvent.date}</dd></div>
                <div><dt>Place</dt><dd>{content.featuredEvent.location}</dd></div>
              </dl>
              <a className="text-link" href="https://www.necypaact.com/events" target="_blank" rel="noreferrer">Event details <ExternalIcon /><span className="sr-only">{externalLabel}</span></a>
            </div>
          </div>
        </section>

        <section className="past section-pad" aria-labelledby="past-title">
          <div className="page-shell">
            <div className="section-heading-row">
              <div>
                <p className="section-label">The road to Hartford</p>
                <h2 id="past-title">Past events</h2>
              </div>
              <div className="rail-controls">
                <button type="button" onClick={() => scrollRail(-1)} aria-label="Show previous events"><ArrowIcon direction="left" /></button>
                <button type="button" onClick={() => scrollRail(1)} aria-label="Show more events"><ArrowIcon /></button>
              </div>
            </div>
            <div className="event-rail" ref={railRef} tabIndex={0} aria-label="Past events carousel">
              {content.pastEvents.map((event) => <EventCardView key={event.title} event={event} />)}
            </div>
          </div>
        </section>

        <section className="ypaa section-pad" id="ypaa" aria-labelledby="ypaa-title">
          <div className="page-shell ypaa-grid">
            <div>
              <p className="section-label">Keep finding your people</p>
              <h2 id="ypaa-title">YPAA across the Northeast</h2>
              <p>Explore young people’s service and fellowship throughout the region. These links lead to independent A.A. service entities; a link does not imply affiliation or endorsement.</p>
            </div>
            <ul className="meeting-directory">
              {content.ypaaMeetings.map((meeting) => (
                <li key={`${meeting.state}-${meeting.name}`}>
                  <a href={meeting.href} target="_blank" rel="noreferrer">
                    <span><small>{meeting.state}</small>{meeting.name}</span>
                    <ExternalIcon /><span className="sr-only">{externalLabel}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer id="accessibility">
        <div className="page-shell footer-grid">
          <div>
            <BrandMark />
            <p>The Northeast Convention of Young People in Alcoholics Anonymous · Hartford, Connecticut · Dec 31, 2026–Jan 3, 2027.</p>
          </div>
          <div>
            <h2>Need help?</h2>
            <a href="mailto:info@necypaa.org">info@necypaa.org</a>
            <button type="button" className="footer-access" onClick={() => setAccessOpen(true)}>Accessibility settings</button>
          </div>
          <div>
            <h2>Anonymity & A.A.</h2>
            <p>Please protect your anonymity and the anonymity of others when sharing convention content publicly.</p>
          </div>
        </div>
        <div className="page-shell footer-bottom">
          <p>© 2026 NECYPAA XXXVI CT Host Committee</p>
          <p>Alcoholics Anonymous®, A.A.®, and The Big Book® are registered trademarks of Alcoholics Anonymous World Services, Inc.</p>
        </div>
      </footer>

      <div className="mobile-action-bar" aria-label="Convention actions">
        <ActionLink href={content.convention.hotelUrl} variant="secondary">Book hotel</ActionLink>
        <ActionLink href={content.convention.registerUrl}>Register</ActionLink>
      </div>
    </div>
  );
}
