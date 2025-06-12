
import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="mt-12 text-center text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Crypto Flight. Embark on your crypto journey.</p>
      <p className="mt-1">
        Created by{' '}
        <Link href="https://arzh.ee" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          arzhee
        </Link>{' '}
        with ❤️
      </p>
    </footer>
  );
}
