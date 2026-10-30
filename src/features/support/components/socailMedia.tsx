import {
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitterFilled,
} from "@tabler/icons-react";

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com", Icon: IconBrandFacebookFilled },
  { label: "Twitter", href: "https://twitter.com", Icon: IconBrandTwitterFilled },
  { label: "Instagram", href: "https://www.instagram.com", Icon: IconBrandInstagram },
  { label: "LinkedIn", href: "https://www.linkedin.com", Icon: IconBrandLinkedin },
];

export default function SocialMedia() {
  return (
    <section
      aria-labelledby="follow-us-heading"
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
    >
      <h2 id="follow-us-heading" className="text-sm font-semibold text-slate-900">
        Follow Us
      </h2>
      <ul className="mt-4 flex items-center gap-2.5">
        {socialLinks.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${label}`}
              className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-primary-600 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              <Icon size={16} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
