import { Button } from '@/components/ui/button';
import { CarIcon, ShieldCheckIcon, Wallet2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <div className="inline-flex space-x-6">
              <span className="rounded-full bg-purple-600/10 px-3 py-1 text-sm font-semibold leading-6 text-purple-600 ring-1 ring-inset ring-purple-600/10">
                Web3 Powered
              </span>
              <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                <span>AI-Enhanced Safety</span>
              </span>
            </div>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            The Future of Ride Sharing is Here
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Experience secure, transparent, and efficient rides with RideChain. Powered by blockchain technology and AI for optimal routes and fair pricing.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button size="lg" asChild>
              <Link to="/ride" className="flex items-center">
                <CarIcon className="mr-2 h-5 w-5" />
                Book a Ride
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/drive" className="flex items-center">
                <Wallet2Icon className="mr-2 h-5 w-5" />
                Start Driving
              </Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=2850&q=80"
              alt="Luxury car dashboard"
              className="w-[76rem] rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-400/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}