
import { AppHeader, ChecklistContainer } from '@/components/crypto-pilot';

export default function CryptoPilotPage() {
  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <AppHeader />
        <ChecklistContainer />
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Crypto Flight. Embark on your crypto journey.</p>
        <p className="mt-1">Created by <a href="https://arzh.ee" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">arzhee</a> with ❤️</p>
      </footer>
    </main>
  );
}
