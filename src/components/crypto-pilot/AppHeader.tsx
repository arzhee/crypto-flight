
import { Rocket } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="mb-8 text-center">
      <div className="flex items-center justify-center space-x-3">
        <Rocket className="h-10 w-10 text-primary" />
        <h1 className="font-headline text-4xl font-bold text-primary sm:text-5xl">
          Crypto Flight
        </h1>
      </div>
      <p className="mt-2 text-lg text-muted-foreground">
        Your First Flight into Cryptocurrency.
      </p>
    </header>
  );
}
