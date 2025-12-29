import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl">
                Syria <span className="text-primary-400">Vision</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering Syrian youth to build a better future through innovation, 
              collaboration, and creative solutions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/events" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>info@syriavision.org</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+963 XXX XXX XXX</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Damascus, Syria</span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Syria Vision. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Because We Believe in Syria's Future
          </p>
        </div>
      </div>
    </footer>
  );
}
