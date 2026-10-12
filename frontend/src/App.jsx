
import { useEffect, useRef, useState } from "react";
import "./App.css";
import PhoneField from "./PhoneField.jsx";
import ThankYou from "./ThankYou.jsx";
import { submitEnquiry } from "./submitEnquiry.js";
import heroBackground from "./assets/BG green overlay.png";
import brandLogo from "./assets/Logo.png";
import masterBedroom from "./assets/Bedroom.png";
import kitchen from "./assets/Model kitchen.png";
import livingRoom from "./assets/Living Room.png";
import secondBedroom from "./assets/Second bedroom.png";
import homeTheatre from "./assets/Home theatre.png";
import towerImage from "./assets/Modular kitchen.png";

import poolPhoto from "./assets/PHOTO · Swimming pool (replace fill with image).png";
import gamesPhoto from "./assets/PHOTO · Indoor game area (replace fill with image).png";
import gymPhoto from "./assets/PHOTO · Health club (replace fill with image).png";
import theatrePhoto from "./assets/PHOTO · Home theatre (replace fill with image).png";
import clubIcon from "./assets/Icon (3).png";
import chargingIcon from "./assets/Icon (4).png";
import parkingIcon from "./assets/Icon (5).png";
import liftIcon from "./assets/Icon (6).png";

const amenities = [
  { image: poolPhoto, title: "Rooftop Swimming Pool", description: "Swimming pool on the terrace floor.", icon: "M3 7h18M3 12c3-3 3 3 6 0s3 3 6 0 3 3 6 0M3 17c3-3 3 3 6 0s3 3 6 0 3 3 6 0" },
  { image: gamesPhoto, title: "Indoor Games", description: "Carrom, table tennis and more.", icon: "M9 3a6 6 0 0 0 0 12h2l6 6 3-3-6-6V9a6 6 0 0 0-5-6ZM6 5l7 7" },
  { image: gymPhoto, title: "Health Club", description: "A health club for your daily workout.", icon: "M8 12h8M4 7v10M7 5v14M17 5v14M20 7v10M4 12h3M17 12h3" },
  { image: theatrePhoto, title: "Home Theatre", description: "Private home theatre on the terrace level.", icon: "M3 4h18v13H3ZM8 21h8M12 17v4" },
];
const includedAmenities = [
  { icon: clubIcon, title: "Club House", description: "Space to meet, celebrate and unwind." },
  { icon: chargingIcon, title: "EV Charging", description: "EV charging point for the future-ready home." },
  { icon: parkingIcon, title: "Covered Parking", description: "Covered car parking in basement and ground floor." },
  { icon: liftIcon, title: "Modern Lifts", description: "Two automatic modern passenger lifts." },
];

import visitBackground from "./assets/Scrim.png";

const nearbyPlaces = [
  { title: "Connect", subtitle: "Daily essentials around you", symbol: "📍", places: [
    [1, "District Hospital", "500 m"], [2, "Civil Station", "960 m"], [3, "Mission School", "1.8 km"],
    [4, "Head Post Office", "2.2 km"], [5, "Chandranagar", "2.2 km"], [6, "Victoria College", "2.9 km"],
  ] },
  { title: "Travel", subtitle: "Getting around is easy", symbol: "🚌", places: [
    [7, "KSRTC Bus Stand", "900 m"], [8, "Stadium Bus Stand", "1 km"], [9, "Kochi – Salem Highway (NH 544)", "2 km"],
    [10, "Town Railway Station", "2.2 km"], [11, "Olavakkode Railway Station", "5.2 km"], [12, "Airport", "45 km"],
  ] },
];

const LOGO_URL = brandLogo;
const HERO_URL = heroBackground;

function App() {
  const [logoMissing, setLogoMissing] = useState(false);
  const [heroMissing, setHeroMissing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: ""
  });

  const [status, setStatus] = useState("");
  const [visitStatus, setVisitStatus] = useState("");
  const [submitting, setSubmitting] = useState("");
  const submissionLock = useRef(false);
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const updateRoute = (event) => {
      const nextRoute = window.location.hash;
      setRoute(nextRoute);
      if (nextRoute.startsWith("#/thank-you") || event.oldURL.includes("#/thank-you")) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("hashchange", updateRoute);
    return () => window.removeEventListener("hashchange", updateRoute);
  }, []);

  useEffect(() => {
    document.title = route.startsWith("#/thank-you") ? "Thank you | Hanco Fort Heights" : "Hanco Fort Heights";
  }, [route]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event, kind) => {
    event.preventDefault();
    const element = event.currentTarget;
    if (submissionLock.current) return;
    for (const field of element.elements) {
      if (field.required && field.type !== "email" && field.type !== "tel") {
        field.setCustomValidity(field.value.trim() ? "" : "Please fill in this field.");
      }
    }
    if (!element.reportValidity()) return;
    const setFeedback = kind === "visit" ? setVisitStatus : setStatus;
    submissionLock.current = true;
    setSubmitting(kind);
    setFeedback("");
    try {
      await submitEnquiry(new FormData(element), kind);
      window.location.hash = "/thank-you?type=" + kind;
    } catch (error) {
      setFeedback(error.message);
    } finally {
      submissionLock.current = false;
      setSubmitting("");
    }
  };

  const scrollToForm = () => {
    document.getElementById("site-visit-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  };

  if (route.startsWith("#/thank-you")) return <ThankYou visit={route.includes("type=visit")} logo={brandLogo} />;

  return (
    <div className="site">
      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="brand">
            {!logoMissing ? (
              <img
                src={LOGO_URL}
                alt="Hanco Fort Heights"
                onError={() => setLogoMissing(true)}
              />
            ) : (
              <div className="logo-placeholder">
                <span>LOGO</span>
                <small>Add logo.png</small>
              </div>
            )}
            <div className="brand-name">
              <span>HANCO</span>
              <strong>FORT HEIGHTS</strong>
            </div>
          </a>

          <nav className={menuOpen ? "nav open" : "nav"} onClick={() => setMenuOpen(false)}>
            <a href="#overview">
              Overview
            </a>
            <a href="#amenities">Amenities</a>
            <a href="#location">Location</a>
            <a href="#gallery">Gallery</a>
          </nav>

          <div className="header-actions">
            <a className="header-phone">
              <span aria-hidden="true">☎</span> +91 812 905 3222
            </a>
            <button className="gold-button header-cta" onClick={scrollToForm}>
              Enquire Now
            </button>
          </div>

          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-image">
            {!heroMissing ? (
              <img
                src={HERO_URL}
                alt="Hanco Fort Heights residential towers"
                onError={() => setHeroMissing(true)}
              />
            ) : (
              <div className="hero-placeholder">
                <span>HERO BACKGROUND IMAGE</span>
                <small>Add your background image: /images/hero-bg.jpg</small>
              </div>
            )}
          </div>

          <div className="hero-overlay" />

          <div className="hero-content">
            <div className="hero-copy">
              <div className="location-pill">
                <span className="location-dot">●</span>
                STADIUM BYPASS ROAD, PALAKKAD
              </div>

              <h1>
                <span className="desktop-hero-title">Live in the <em>heart</em><br />of Palakkad.</span>
                <span className="mobile-hero-title">Live in the <em>heart</em> of Palakkad</span>
              </h1>

              <button className="gold-button visit-button" onClick={scrollToForm}>
                Book a site visit <span>➜</span>
              </button>
            </div>

            <div className="enquiry-card" id="enquiry-form">
              <h2>Get the brochure &amp; price sheet</h2>
              <p className="form-subtitle">
                Our team will call you within 30 minutes.
              </p>

              <form noValidate onSubmit={(event) => handleSubmit(event, "enquiry")} onInput={(event) => event.target.setCustomValidity?.("")} onInvalid={(event) => event.currentTarget.classList.add("validation-attempted")}>
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  aria-label="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <PhoneField name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  name="city"
                  type="text"
                  placeholder="City"
                  aria-label="City"
                  value={form.city}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  className="gold-button form-submit"
                  disabled={Boolean(submitting)}
                >
                  {submitting === "enquiry" ? "Submitting..." : "Enquire Now"}
                </button>

                {status && <p className="form-error" role="alert">{status}</p>}
              </form>

              <p className="form-disclaimer">
                I authorize Hanco Properties &amp; its representatives
                to contact me via Email/SMS/WhatsApp/Call.
                This overrides DND/NDNC.
              </p>
            </div>
          </div>
        </section>
        <section className="overview-section" id="overview" aria-labelledby="overview-title">
          <div className="overview-inner">
            <div className="overview-copy">
              <p className="overview-eyebrow">WHY FORT HEIGHTS</p>
              <h2 id="overview-title">Everything a modern<br className="overview-break" /> lifestyle needs, right at your doorstep</h2>
              <p className="overview-description">Hanco Fort Heights is a twin-tower architectural marvel with 80 units of 2 &amp; 3 BHK apartments on Stadium Bypass Road.</p>
              <ul className="overview-highlights">
                <li>Heart of the city, Stadium Bypass Road</li>
                <li>District Hospital just 500 m away</li>
                <li>Kochi–Salem Highway (NH 544) in 2 km</li>
              </ul>
              <button className="gold-button overview-cta" onClick={scrollToForm}>Get Price Details</button>
            </div>
            <div className="overview-image-frame">
              <img src={towerImage} alt="Hanco Fort Heights twin residential towers at night" className="overview-image" />
            </div>
            <div className="overview-location">
              <span className="overview-location-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke="currentColor" strokeWidth="1.7"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.7"/></svg>
              </span>
              <div><strong>Stadium Bypass Road</strong><span>Palakkad, Kerala</span></div>
            </div>
            <div className="overview-unit-badge"><strong>80</strong><span>PREMIUM<br />UNITS</span></div>
          </div>
        </section>
        <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="gallery-heading">
            <p className="gallery-eyebrow"><span>GALLERY</span></p>
            <h2 id="gallery-title">Designed for modern living</h2>
          </div>
          <div className="gallery-grid">
            <figure className="gallery-tile gallery-featured">
              <img src={masterBedroom} alt="Bedroom" loading="lazy" />
              <figcaption>Bedroom</figcaption>
            </figure>
            <div className="gallery-small-grid">
              {[{ src: kitchen, name: "Kitchen" }, { src: livingRoom, name: "Living room" }, { src: secondBedroom, name: "Second Bedroom" }, { src: homeTheatre, name: "Home Theatre" }].map(({ src, name }) => (
                <figure className="gallery-tile" key={name}>
                  <img src={src} alt={name} loading="lazy" />
                  <figcaption>{name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
        <section className="amenities-section" id="amenities" aria-labelledby="amenities-title">
          <div className="amenities-heading">
            <p className="gallery-eyebrow"><span>AMENITIES</span></p>
            <h2 id="amenities-title">Resort-style living, every single day</h2>
            <p>Four signature spaces designed for everyday leisure</p>
          </div>
          <div className="amenities-grid">
            {amenities.map((amenity) => (
              <article className="amenity-card" key={amenity.title}>
                <img className="amenity-photo" src={amenity.image} alt={amenity.title} loading="lazy" />
                <span className="amenity-symbol" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d={amenity.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <div className="amenity-caption"><h3>{amenity.title}</h3><p>{amenity.description}</p></div>
              </article>
            ))}
          </div>
          <div className="included-amenities">
            <p className="included-label">ALSO INCLUDED</p>
            <div className="included-grid">
              {includedAmenities.map((amenity) => (
                <article className="included-card" key={amenity.title}>
                  <img src={amenity.icon} alt="" aria-hidden="true" loading="lazy" />
                  <div><h3>{amenity.title}</h3><p>{amenity.description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="location-section" id="location" aria-labelledby="location-title">
          <div className="location-heading">
            <p className="location-eyebrow">LOCATION</p>
            <h2 id="location-title">Everything within easy reach</h2>
            <p>Approximate distances from the Hanco Fort Heights site, Stadium Bypass Road, Palakkad.</p>
          </div>
          <div className="location-panels">
            {nearbyPlaces.map((group) => (
              <article className="location-panel" key={group.title}>
                <div className="location-panel-heading">
                  <span className="location-panel-symbol" aria-hidden="true">{group.symbol}</span>
                  <div><h3>{group.title}</h3><p>{group.subtitle}</p></div>
                </div>
                <ul className="location-list">
                  {group.places.map(([number, name, distance]) => (
                    <li key={name}><span className="location-number">{number}</span><span className="location-place">{name}</span><span className="location-distance">{distance}</span></li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section className="site-visit-section" aria-labelledby="site-visit-title" style={{ backgroundImage: 'url("' + visitBackground + '")' }}>
          <div className="site-visit-inner">
            <div className="site-visit-copy">
              <p className="site-visit-eyebrow">NEXT STEP <span /></p>
              <h2 id="site-visit-title">See it for yourself.</h2>
              <p>Walk the plots and the site with your family. No obligation.</p>
            </div>
            <div className="site-visit-card" id="site-visit-form">
              <h3>Book a site visit</h3>
              <p>We'll confirm by phone.</p>
              <form noValidate onSubmit={(event) => handleSubmit(event, "visit")} onInput={(event) => event.target.setCustomValidity?.("")} onInvalid={(event) => event.currentTarget.classList.add("validation-attempted")}>
                <input name="visitName" autoComplete="name" placeholder="Your name" aria-label="Your name" required />
                <PhoneField name="visitPhone" placeholder="Mobile number" />
                <input name="visitEmail" type="email" autoComplete="email" placeholder="Email" aria-label="Email" required />
                <input name="visitCity" autoComplete="address-level2" placeholder="City" aria-label="City" />
                <button type="submit" disabled={Boolean(submitting)}>{submitting === "visit" ? "Submitting..." : "Book my visit"}</button>
                {visitStatus && <p className="form-error" role="alert">{visitStatus}</p>}
              </form>
            </div>
          </div>
        </section>
        <section className="closing-section" aria-labelledby="closing-title">
          <h2 id="closing-title">Your Palakkad home is waiting</h2>
          <p>Talk to our team for price details, floor plans and a free site visit.</p>
          <div className="closing-actions">
            <a className="gold-button closing-visit" href="#site-visit-form">Book Free Site Visit</a>
          </div>
          <div className="closing-contact">
            <a>+91 812 905 3222</a>
            <span aria-hidden="true">·</span>
            <a>sales@hanco.in</a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <p>© 2026 All Rights Reserved <span aria-hidden="true">|</span> Hanco Property Developers Pvt. Ltd. <span aria-hidden="true">|</span> K-RERA/PRJ/PKD/009/2022</p>
      </footer>
    </div>
  );
}

export default App;
