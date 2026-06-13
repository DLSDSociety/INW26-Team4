import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Globe,
  Mail,
  ArrowRight,
} from 'lucide-react';

import { subscribe } from '../../features/newsletter/newsletterAPI';

const footerLinks = {
  navigation: [
    {
      to: '/products',
      label: 'Collections',
    },
    {
      to: '/about',
      label: 'About Us',
    },
  ],

  support: [
    {
      to: '/privacy',
      label: 'Privacy Policy',
    },
    {
      to: '/terms',
      label: 'Terms of Service',
    },
    {
      to: '/shipping',
      label: 'Shipping & Returns',
    },
    {
      to: '/contact',
      label: 'Contact Us',
    },
  ],
};

const Footer = () => {
  const [email, setEmail] = useState('');

  const [status, setStatus] = useState({
    kind: 'idle',
    msg: '',
  });

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setStatus({
      kind: 'loading',
      msg: '',
    });

    try {
      const { message } = await subscribe(email, 'footer');

      setStatus({
        kind: 'success',
        msg: message || 'Successfully subscribed',
      });

      setEmail('');
    } catch (err) {
      setStatus({
        kind: 'error',
        msg:
          err.response?.data?.message ||
          'Subscription failed',
      });
    }
  };

  return (
    <footer className="mt-32 border-t border-outline-soft bg-surface-3">
      <div className="max-w-container mx-auto px-6 lg:px-margin-desktop py-16 lg:py-20">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-14">

          {/* Brand */}
          <div className="xl:pr-8">
            <h3 className="text-2xl font-bold tracking-[0.18em] text-charcoal mb-5">
              ShopMERN
            </h3>

            <p className="text-sm leading-7 text-on-surface-2 max-w-sm">
              Redefining the boundaries of modern elegance
              through precision engineering and timeless
              aesthetic principles.
            </p>

            {/* Utility Buttons */}
            <div className="flex items-center gap-3 mt-7">

              <button
                aria-label="Change Region"
                className="
                  w-10 h-10 rounded-full
                  border border-outline-soft
                  flex items-center justify-center
                  transition-all duration-300
                  hover:bg-charcoal
                  hover:text-white
                  hover:-translate-y-0.5
                "
              >
                <Globe size={17} />
              </button>

              <Link
                to="/contact"
                aria-label="Contact Us"
                className="
                  w-10 h-10 rounded-full
                  border border-outline-soft
                  flex items-center justify-center
                  transition-all duration-300
                  hover:bg-charcoal
                  hover:text-white
                  hover:-translate-y-0.5
                "
              >
                <Mail size={17} />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <FooterCol
            title="Navigation"
            links={footerLinks.navigation}
          />

          {/* Support */}
          <FooterCol
            title="Support"
            links={footerLinks.support}
          />

          {/* Newsletter */}
          <div>
            <p className="label-editorial mb-5">
              Newsletter
            </p>

            <p className="text-sm leading-7 text-on-surface-2 mb-6">
              Join our private list for early access to
              seasonal edits, exclusive releases,
              and curated collections.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center border-b border-charcoal pb-2">
  <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Email Address"
    className="flex-1 bg-transparent text-sm placeholder:text-on-surface-2 focus:outline-none"
  />
  <button
    type="submit"
    aria-label="Subscribe"
    disabled={status.kind === 'loading'}
    className="text-charcoal hover:text-primary transition disabled:opacity-50"
  >
    {status.kind === 'loading' ? '…' : '→'}
  </button>
</form>
{status.msg && (
  <p className={`mt-2 text-xs ${status.kind === 'error' ? 'text-red-600' : 'text-on-surface-2'}`}>
    {status.msg}
  </p>
)}
            
            
          </div>
        </div>

        {/* Bottom Strip */}
        <div
          className="
            mt-16 pt-6
            border-t border-outline-soft
            flex flex-col md:flex-row
            items-center justify-between
            gap-4
          "
        >
          <p className="text-xs tracking-[0.15em] text-on-surface-2 uppercase">
            © {new Date().getFullYear()} ShopMERN Tech.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="
                text-xs text-on-surface-2
                hover:text-primary
                transition
              "
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="
                text-xs text-on-surface-2
                hover:text-primary
                transition
              "
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, links }) => {
  return (
    <div>
      <p className="label-editorial mb-5">
        {title}
      </p>

      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="
                text-sm text-on-surface
                transition-all duration-300
                hover:text-primary
                hover:pl-1
              "
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;