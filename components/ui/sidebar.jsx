// components/ui/sidebar.js
import Link from 'next/link';

export function SidebarItem({ href, title }) {
  return (
    <li>
      <Link href={href} className="block px-4 py-2 hover:bg-gray-700 rounded">
        {title}
      </Link>
    </li>
  );
}
