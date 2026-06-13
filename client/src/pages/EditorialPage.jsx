import {
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Cloud,
  Database,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Star,
  Truck,
  MonitorSmartphone,
} from 'lucide-react';

const techStack = [
  {
    title: 'React + Redux',
    desc: 'State-driven frontend architecture',
    icon: MonitorSmartphone,
  },
  {
    title: 'Node + Express',
    desc: 'RESTful commerce APIs',
    icon: LayoutDashboard,
  },
  {
    title: 'MongoDB Atlas',
    desc: 'Cloud-native database infrastructure',
    icon: Database,
  },
  {
    title: 'Razorpay',
    desc: 'Secure online payment integration',
    icon: CreditCard,
  },
  {
    title: 'Cloudinary',
    desc: 'Optimized product asset delivery',
    icon: Cloud,
  },
  {
    title: 'JWT Authentication',
    desc: 'Role-based secure authentication',
    icon: ShieldCheck,
  },
];

const commerceFlow = [
  {
    title: 'Discover',
    icon: ShoppingBag,
  },
  {
    title: 'Wishlist',
    icon: Heart,
  },
  {
    title: 'Review',
    icon: Star,
  },
  {
    title: 'Checkout',
    icon: CreditCard,
  },
  {
    title: 'Delivery',
    icon: Truck,
  },
];

const EditorialPage = () => {
  return (
    <div className="bg-[#FAFAF8] text-[#191C1D]">

      {/* HERO */}
      <section className="relative h-[90vh] overflow-hidden">

        <img
          src="/hero.png"
          alt="Editorial"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div
          className="
            relative z-10
            max-w-[1440px]
            mx-auto
            h-full
            px-6 md:px-10 xl:px-20
            flex items-center
          "
        >
          <div className="max-w-3xl">

            <p
              className="
                text-xs
                uppercase
                tracking-[0.24em]
                text-white/70
                mb-6
              "
            >
              Editorial Commerce Experience
            </p>

            <h1
              className="
                text-6xl md:text-7xl
                font-semibold
                tracking-[-0.06em]
                leading-[0.92]
                text-white
              "
            >
              Curated Commerce.
              <br />
              Designed with Precision.
            </h1>

            <p
              className="
                mt-8
                max-w-2xl
                text-lg
                leading-relaxed
                text-white/75
              "
            >
              A modern MERN-stack ecommerce platform
              combining editorial storytelling,
              secure payments, cloud-powered assets,
              and a seamless shopping experience.
            </p>

          </div>
        </div>
      </section>

      {/* PLATFORM OVERVIEW */}
      <section
        className="
          max-w-[1440px]
          mx-auto
          px-6 md:px-10 xl:px-20
          py-32
        "
      >
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT */}
          <div>

            <p className="editorial-label">
              Platform Vision
            </p>

            <h2 className="editorial-heading mt-5">
              A Luxury Storefront
              Built Like a Modern Product
            </h2>

            <p className="editorial-body mt-8">
              Sartorial was designed as a production-grade
              ecommerce platform with a minimalist editorial
              interface and scalable full-stack architecture.
            </p>

          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-5">

            <VisualCard
              number="50+"
              label="Products"
            />

            <VisualCard
              number="JWT"
              label="Secure Auth"
            />

            <VisualCard
              number="Redux"
              label="State Management"
            />

            <VisualCard
              number="Cloud"
              label="Media Delivery"
            />

          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="bg-white py-32">

        <div
          className="
            max-w-[1440px]
            mx-auto
            px-6 md:px-10 xl:px-20
          "
        >
          <div className="mb-16">

            <p className="editorial-label">
              Technology Stack
            </p>

            <h2 className="editorial-heading mt-5">
              Engineered Across the Full Stack
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {techStack.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    bg-[#FAFAF8]
                    border border-[#ECECEC]
                    rounded-[28px]
                    p-8
                    hover:-translate-y-1
                    transition-all
                  "
                >
                  <div
                    className="
                      w-14 h-14
                      rounded-2xl
                      bg-black
                      text-white
                      flex items-center justify-center
                    "
                  >
                    <Icon size={24} />
                  </div>

                  <h3
                    className="
                      mt-8
                      text-2xl
                      font-semibold
                      tracking-[-0.03em]
                    "
                  >
                    {item.title}
                  </h3>

                  <p className="mt-4 text-[#777683] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMERCE FLOW */}
      <section
        className="
          max-w-[1440px]
          mx-auto
          px-6 md:px-10 xl:px-20
          py-32
        "
      >
        <div className="text-center">

          <p className="editorial-label">
            Commerce Experience
          </p>

          <h2 className="editorial-heading mt-5">
            Seamless Shopping Flow
          </h2>
        </div>

        <div
          className="
            mt-20
            grid grid-cols-2 md:grid-cols-5
            gap-8
          "
        >
          {commerceFlow.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="text-center"
              >
                <div
                  className="
                    w-24 h-24
                    mx-auto
                    rounded-full
                    bg-white
                    border border-[#ECECEC]
                    flex items-center justify-center
                  "
                >
                  <Icon size={28} />
                </div>

                <p
                  className="
                    mt-6
                    font-medium
                    text-[#191C1D]
                  "
                >
                  {step.title}
                </p>

                <ArrowRight
                  className="
                    hidden md:block
                    mx-auto mt-6
                    text-[#B0B0B0]
                  "
                  size={18}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* EDITORIAL GALLERY */}
      <section className="bg-white py-32">

        <div
          className="
            max-w-[1440px]
            mx-auto
            px-6 md:px-10 xl:px-20
          "
        >
          <div className="mb-16">

            <p className="editorial-label">
              Visual Direction
            </p>

            <h2 className="editorial-heading mt-5">
              Luxury Editorial Aesthetic
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <GalleryCard image="/gallery1.jpg" />
            <GalleryCard image="/gallery2.jpg" />
            <GalleryCard image="/gallery3.jpg" />

          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="
          max-w-[1000px]
          mx-auto
          px-6
          py-32
          text-center
        "
      >
        <p className="editorial-label">
          Explore the Platform
        </p>

        <h2 className="editorial-heading mt-5">
          Built to Learn.
          <br />
          Designed to Feel Production-Ready.
        </h2>

        <button
          className="
            mt-12
            h-14
            px-8
            rounded-2xl
            bg-black
            text-white
            text-sm
            uppercase
            tracking-[0.08em]
            hover:bg-neutral-800
            transition-all
          "
        >
          Explore Collection
        </button>
      </section>
    </div>
  );
};

const VisualCard = ({ number, label }) => (
  <div
    className="
      bg-white
      border border-[#ECECEC]
      rounded-[28px]
      p-10
    "
  >
    <h3
      className="
        text-5xl
        font-semibold
        tracking-[-0.05em]
      "
    >
      {number}
    </h3>

    <p className="mt-4 text-[#777683]">
      {label}
    </p>
  </div>
);

const GalleryCard = ({ image }) => (
  <div
    className="
      aspect-[4/5]
      rounded-[32px]
      overflow-hidden
    "
  >
    <img
      src={image}
      alt=""
      className="
        w-full h-full
        object-cover
        hover:scale-105
        transition-transform duration-700
      "
    />
  </div>
);

export default EditorialPage;