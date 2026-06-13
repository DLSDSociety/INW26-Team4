import { Link } from 'react-router-dom';
import {
  ArrowRight,
} from 'lucide-react';

const FeaturedCollections = () => {
  const collections = [
    {
      title: 'New Arrivals',
      subtitle: 'Explore the Latest',
      description:
        'Architectural silhouettes crafted for the modern wardrobe.',
      route: '/products?sort=newest',
      image:
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop',
    },
    {
      title: 'The Boutique',
      subtitle: 'Hand-Curated Pieces',
      description:
        'A refined selection of timeless garments and essentials.',
      route: '/collections/boutique',
      image:
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1400&auto=format&fit=crop',
    },
  ];

  return (
    <section className="px-4 md:px-8 xl:px-16 py-24 bg-white">

      <div className="max-w-[1440px] mx-auto">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">

          <div>

            <p
              className="text-[12px]
                         uppercase
                         tracking-[0.18em]
                         font-semibold
                         text-[#777683]
                         mb-3"
            >
              Curated Collections
            </p>

            <h2
              className="text-4xl md:text-5xl
                         font-semibold
                         tracking-[-0.04em]
                         leading-[1.05]
                         text-[#191C1D]"
            >
              Designed With
              <br />
              Precision
            </h2>
          </div>

          <Link
            to="/collections"
            className="hidden md:inline-flex items-center gap-2
                       text-sm font-medium
                       text-[#15157D]
                       hover:underline"
          >
            View All Collections
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {collections.map((item) => (
            <Link
              key={item.title}
              to={item.route}
              className="group relative overflow-hidden rounded-[10px]
                         h-[520px]"
            >
              {/* Background Image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0
                           w-full h-full
                           object-cover
                           transition-transform duration-700
                           group-hover:scale-105"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0
                           bg-gradient-to-t
                           from-black/80
                           via-black/20
                           to-transparent"
              />

              {/* Content */}
              <div
                className="relative z-10
                           h-full
                           flex flex-col justify-end
                           p-8 md:p-10"
              >
                <p
                  className="text-[12px]
                             uppercase
                             tracking-[0.18em]
                             font-semibold
                             text-white/70
                             mb-4"
                >
                  {item.subtitle}
                </p>

                <h3
                  className="text-4xl md:text-5xl
                             font-semibold
                             tracking-[-0.04em]
                             leading-[1]
                             text-white"
                >
                  {item.title}
                </h3>

                <p
                  className="mt-5
                             max-w-md
                             text-[16px]
                             leading-7
                             text-white/80"
                >
                  {item.description}
                </p>

                <div className="mt-8">

                  <span
                    className="inline-flex items-center gap-2
                               text-sm font-medium
                               text-white"
                  >
                    Explore Collection
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300
                                 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden mt-10">

          <Link
            to="/collections"
            className="inline-flex items-center gap-2
                       text-sm font-medium
                       text-[#15157D]
                       hover:underline"
          >
            View All Collections
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;