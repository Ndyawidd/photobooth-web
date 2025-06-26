import React from "react";
import { Camera, Sparkles, Download, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight">
            <button onClick={() => navigate("/")}>snap.</button>
          </div>
          <button
            onClick={() => navigate("/capture")}
            className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              capture your
              <br />
              <span className="italic font-light">moment</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Create stunning photos instantly. Upload, capture, edit, and share
              your memories with our minimalist photobooth experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate("/capture")}
              className="px-8 py-4 bg-black text-white rounded-full font-medium text-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Camera size={20} />
              Start Taking Photos
            </button>

            <button
              onClick={() => navigate("/gallery")}
              className="px-8 py-4 border-2 border-black text-black rounded-full font-medium text-lg hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
            >
              View Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-gray-600 text-lg">
              Simple tools for perfect moments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Capture & Upload</h3>
              <p className="text-gray-600">
                Take photos directly or upload from your device. High-quality
                processing guaranteed.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Edit</h3>
              <p className="text-gray-600">
                Apply filters and effects in real-time. Make your photos stand
                out effortlessly.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Download & Share</h3>
              <p className="text-gray-600">
                Save to your device or share directly to social media. Your
                memories, your way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to start?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands who trust snap. for their photo moments
          </p>
          <button
            onClick={() => navigate("/capture")}
            className="px-10 py-5 bg-black text-white rounded-full text-xl font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Create Your First Photo
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold mb-4">snap.</div>
          <p className="text-gray-500 text-sm">
            © 2025 Snap Photobooth. Made with love for your memories.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
