import Link from 'next/link';

interface NavItem {
  href: string;
  label: string;
}

export default function Header({ navItems }: { navItems: NavItem[] }) {
  return (
    <header className="bg-gray-900 text-white py-6 shadow-lg">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wide">
          محمد عيظة الزهراني
        </h1>
        <nav className="space-x-6 text-lg hidden md:block">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gray-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
