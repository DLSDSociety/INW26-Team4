import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const AboutPage = () => {
  return (
    <div className="max-w-container mx-auto px-margin-desktop py-24">

      {/* Editorial header */}
      <header className="max-w-3xl mb-20">
        <p className="label-editorial mb-4">Our Story</p>
        <h1 className="text-display-md md:text-display-lg text-charcoal">
          A Study in <br /> Precision Commerce
        </h1>
      </header>

      {/* Main paragraph — the project explainer */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-32">
        <div className="md:col-span-4">
          <p className="label-editorial">About the Project</p>
        </div>

        <div className="md:col-span-8 space-y-6 text-base md:text-lg leading-relaxed text-on-surface">
          <p>
            Sartorial Tech is a full-stack e-commerce platform built on the MERN
            stack — MongoDB, Express, React, and Node.js — as a final-year MCA
            project at Assam Kaziranga University. It pairs a polished editorial
            storefront with a complete commerce engine: a product catalogue with
            search and filters, a persistent cart, secure checkout and order
            management, customer reviews, a wishlist, and a full administrative
            dashboard for managing inventory, orders, and users.
          </p>
          <p>
            Authentication is handled through JSON Web Tokens with role-based
            access control, payments are processed through a Razorpay
            integration, and product imagery is served from Cloudinary. State
            on the client is coordinated by Redux Toolkit and styled with
            Tailwind CSS, following a minimalist "Sartorial Tech" design
            language that treats every product as a gallery piece. The goal of
            the project was simple: build a production-grade e-commerce
            experience from the ground up, and learn every layer of the modern
            web stack along the way.
          </p>
        </div>
      </section>

      {/* Pillars strip */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 pt-16 border-t border-outline-soft">
        <Pillar
          label="Engineering"
          title="MERN Stack"
          body="A REST API on Node and Express, persistent data in MongoDB, a React 18 client built with Vite."
        />
        <Pillar
          label="Design"
          title="Editorial Minimalism"
          body="Generous whitespace, a 10px soft-square radius, and a disciplined Indigo + Charcoal palette."
        />
        <Pillar
          label="Experience"
          title="End-to-End Commerce"
          body="Catalogue, cart, checkout, reviews, wishlist, and admin tooling — every flow built from scratch."
        />
      </section>

      {/* Closing CTA */}
      <section className="bg-surface-3 rounded-soft px-12 py-20 text-center">
        <p className="label-editorial mb-4">Step Inside</p>
        <h2 className="text-headline-md text-charcoal max-w-xl mx-auto">
          Explore the collection that this storefront was built to showcase.
        </h2>
        <div className="mt-8">
          <Link to="/products">
            <Button variant="primary">Browse Collection</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const Pillar = ({ label, title, body }) => (
  <div>
    <p className="label-editorial mb-3">{label}</p>
    <h3 className="text-headline-sm text-charcoal mb-3">{title}</h3>
    <p className="text-sm text-on-surface-2 leading-relaxed">{body}</p>
  </div>
);

export default AboutPage;