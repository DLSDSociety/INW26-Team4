import { Link } from 'react-router-dom';
 
const NotFoundPage = () => (
  <div className="min-h-[60vh] flex flex-col items-center
                  justify-center text-center px-6">
    <p className="text-6xl font-extrabold text-blue-600">404</p>
    <h1 className="text-2xl font-bold text-gray-900 mt-4">
      Page not found
    </h1>
    <p className="text-gray-500 mt-2">
      The page you are looking for doesn't exist or was moved.
    </p>
    <Link
      to="/"
      className="mt-6 px-5 py-2.5 rounded-lg bg-blue-600
                 text-white font-medium hover:bg-blue-700"
    >
      Go to Home
    </Link>
  </div>
);
 
export default NotFoundPage;

