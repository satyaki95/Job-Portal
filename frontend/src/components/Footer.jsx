import React, { Children } from "react";
import { footerStyles as s } from "../assets/dummyStyles";
import logo from "../assets/logo.png";
import Companylogo from "../assets/hexagonlogo.png";
import { LuFacebook, LuInstagram, LuLinkedin, LuTwitter } from "react-icons/lu";
import {
  ArrowRight,
  Award,
  Bookmark,
  Briefcase,
  Building,
  Mail,
  MapPin,
  Phone,
  Shield,
  UserCog,
  UserPen,
  Users,
} from "lucide-react";

// small components
// social icon
const SocialIcon = ({ href, icon, label }) => (
  <a href={href} id={label} className={s.socialIcon}>
    {icon}
  </a>
);

// footer links
const FooterLink = ({ href, children, icon }) => (
  <li>
    <a href={href} className={s.footerLinkItem}>
      <span className={s.footerLinkIcon}>{icon}</span>
      <span className={s.footerLinkText}>{children}</span>
    </a>
  </li>
);

// stat item
const StatItem = ({ number, label }) => (
  <div className={s.statItem}>
    <div className={s.statNumber}>{number}</div>
    <div className={s.statLabel}>{label}</div>
  </div>
);

// for contact
const ContactItem = ({ icon, text, href }) => (
  <div className={s.contactItemContainer}>
    <div className={s.contactIconWrapper}>{icon}</div>
    {href ? (
      <a href={href} className={s.contactText}>
        {text}
      </a>
    ) : (
      <span className={s.contactTextNoLink}>{text}</span>
    )}
  </div>
);

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.footerInner}>
        <div className={s.grid}>
          <div className={s.companySection}>
            <div className={s.logoWrapper}>
              <a href="/" className={s.logoLink}>
                <img src={logo} alt="logo" className={s.logoImage} />
              </a>
              <div>
                <h2 className={s.companyTitle}>JobPortal</h2>
                <p className={s.companyTagline}>Find Your Dream Job</p>
              </div>
            </div>
            <p className={s.companyDescription}>
              Connecting talented professionals with top companies worldwide.
              Your career journey starts here.
            </p>
            <div className={s.socialIconsContainer}>
              <SocialIcon
                href="#"
                icon={<LuLinkedin className=" w-4 h-4 sm:w-5 sm:h-5" />}
                label="Linkedin"
              />
              <SocialIcon
                href="#"
                icon={<LuTwitter className=" w-4 h-4 sm:w-5 sm:h-5" />}
                label="Twitter"
              />
              <SocialIcon
                href="#"
                icon={<LuFacebook className=" w-4 h-4 sm:w-5 sm:h-5" />}
                label="Facebook"
              />
              <SocialIcon
                href="#"
                icon={<LuInstagram className=" w-4 h-4 sm:w-5 sm:h-5" />}
                label="Instagram"
              />
            </div>
          </div>
          <div>
            {/* quick links */}
            <h3 className={s.sectionHeader}>Quick Links</h3>
            <ul className={s.linkList}>
              <FooterLink
                href="/jobs"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Find Jobs
              </FooterLink>
              <FooterLink
                href="/companies"
                icon={<Building className="w-4 h-4" />}
              >
                Companies
              </FooterLink>
              <FooterLink href="/roles" icon={<UserCog className="w-4 h-4" />}>
                Roles
              </FooterLink>
              <FooterLink href="/saved" icon={<Bookmark className="w-4 h-4" />}>
                Saved
              </FooterLink>
              <FooterLink
                href="/contact"
                icon={<UserPen className="w-4 h-4" />}
              >
                Contact
              </FooterLink>
            </ul>
          </div>
          {/* for employers */}
          <div>
            <h3 className={s.sectionHeader}>For Employers</h3>
            <ul className={s.linkList}>
              <FooterLink href="/" icon={<ArrowRight className="w-4 h-4" />}>
                Post a Job
              </FooterLink>
              <FooterLink href="/" icon={<Award className="w-4 h-4" />}>
                Pricing
              </FooterLink>
              <FooterLink href="/" icon={<Users className="w-4 h-4" />}>
                Recruitment Solutions
              </FooterLink>
              <FooterLink href="/" icon={<Briefcase className="w-4 h-4" />}>
                Employer Dashboard
              </FooterLink>
              <FooterLink href="/" icon={<Shield className="w-4 h-4" />}>
                Employer Branding
              </FooterLink>
            </ul>
          </div>
          {/* contact info */}
          <div>
            <h3 className={s.sectionHeader}>Contact Us</h3>
            <div className={s.contactList}>
              <ContactItem
                icon={<Mail className=" w-4 h-4 sm:w-5 sm:h-5" />}
                text="support@jobportal.com"
                href="mailto:support@jobportal.com"
              />
              <ContactItem
                icon={<Phone className=" w-4 h-4 sm:w-5 sm:h-5" />}
                text="+91 123-456"
                href="tel:+155512345"
              />
              <ContactItem
                icon={<MapPin className=" w-4 h-4 sm:w-5 sm:h-5" />}
                text="Bidhannagar, Kolkata, West Bengal 700091"
              />
            </div>
          </div>
        </div>
        <div className={s.divider}></div>
        <div className={s.bottomFooter}>
          <img src={Companylogo} alt="logo" className={s.bottomLogo} />
          <span className={s.designedByText}>Designed by</span>
          <a
            href="https://www.linkedin.com/in/satyaki-saha-3aa407402/"
            target="_blank"
            rel="noopener noreferrer"
            className={s.designedByLink}
          >
            Satyaki Saha
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
