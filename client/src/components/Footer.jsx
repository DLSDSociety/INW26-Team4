import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-2">ShopMERN</h3>
            <p className="text-sm leading-relaxed">
              A full-stack e-commerce application built with MongoDB, Express, React, and Node.js.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-white font-semibold mb-3">Tech Stack</h4>
            <div className="flex flex-wrap gap-2">
              {['MongoDB', 'Express', 'React', 'Node.js', 'Redux', 'Tailwind'].map((tech) => (
                <span key={tech} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} ShopMERN — Built by Jubeir Jadid · MCA, Assam Kaziranga University</p>
        </div>
      </div>
    </footer>
  )
}