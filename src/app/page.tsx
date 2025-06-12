
import { AppHeader, ChecklistContainer } from '@/components/crypto-flight';
import { AppFooter } from '@/components/layout';

export default function CryptoFlightPage() {
  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <AppHeader />
        <ChecklistContainer />
      </div>
      <AppFooter />
    </main>
  );
}
