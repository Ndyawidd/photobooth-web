import { Link } from "react-router-dom";

const Navigation = () => (
  <nav className="p-4 flex justify-between items-center border-b border-white">
    <h1 className="text-xl font-bold">PhotoBooth</h1>
    <div className="space-x-4">
      <Link to="/" className="hover:underline">
        Home
      </Link>
      <Link to="/capture" className="hover:underline">
        Capture
      </Link>
      <Link to="/gallery" className="hover:underline">
        Gallery
      </Link>
    </div>
  </nav>
);

export default Navigation;
