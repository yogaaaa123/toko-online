import Link from 'next/link';
import Image from 'next/image';

const footerLinks = [
  { label: 'Tentang Kami', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Kebijakan Privasi', href: '/privacy' },
  { label: 'Syarat & Ketentuan', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Hello Shop</h3>
            <p className="text-gray-400 text-sm">
              Belanja online mudah dan terpercaya. Temukan produk terbaik dengan harga bersaing.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Navigasi</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Hubungi Kami</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@revoshop.id</li>
              <li>Telp: (021) 1234-5678</li>
              <li>Jam Operasional: 09:00 - 18:00 WIB</li>
            </ul>
          </div>

          {/* Footer Image */}
          <div className="flex justify-center md:justify-end items-center">
            <div className="relative w-48 h-48">
              <Image
                src="/footer.png"
                alt="Footer Illustration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p suppressHydrationWarning>&copy; {new Date().getFullYear()} Hello Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
