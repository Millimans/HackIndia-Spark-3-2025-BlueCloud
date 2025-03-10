import { Button } from "@/components/ui/button";
import { CarIcon, MenuIcon, WalletIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { connectWallet } from "../../lib/web3/wallet.ts";
import { useState } from "react";

export function Navbar() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    try {
      const wallet = await connectWallet();
      setWalletAddress(wallet.address);
      console.log("Connected wallet:", wallet.address);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <CarIcon className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                RideChain
              </span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/ride" className="text-gray-500 hover:text-gray-900">
              Book a Ride
            </Link>
            <Link to="/drive" className="text-gray-500 hover:text-gray-900">
              Become a Driver
            </Link>
            <Button
              variant="outline"
              className="flex items-center"
              onClick={handleConnectWallet}
            >
              <WalletIcon className="mr-2 h-4 w-4" />
              {walletAddress
                ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
                : "Connect Wallet"}
            </Button>
          </div>

          <div className="flex items-center sm:hidden">
            <Button variant="outline" size="sm">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
