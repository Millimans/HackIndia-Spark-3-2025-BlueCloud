import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CarIcon, LoaderIcon } from 'lucide-react';
import { RideEscrow } from '@/lib/web3/contracts/RideEscrow';
import { calculateRidePrice, predictDemand } from '@/lib/ai/pricing';
import { ethers } from 'ethers';

interface RideDetails {
  pickup: [number, number];
  dropoff: [number, number];
  distance: number;
  estimatedTime: number;
}

export function RideBooking({ rideDetails }: { rideDetails: RideDetails }) {
  const [isBooking, setIsBooking] = useState(false);
  const [price, setPrice] = useState<number | null>(null);

  const handleBookRide = async () => {
    try {
      setIsBooking(true);

      // Get price estimation
      const demand = await predictDemand(rideDetails.pickup, new Date());
      const estimatedPrice = await calculateRidePrice(
        rideDetails.distance,
        rideDetails.estimatedTime,
        demand
      );

      // Create escrow contract instance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const escrow = new RideEscrow(signer);

      // Generate unique ride ID
      const rideId = ethers.id(Date.now().toString());

      // Create ride with escrow
      const amount = ethers.parseEther(estimatedPrice.toString());
      await escrow.createRide(rideId, amount);

      setPrice(estimatedPrice);
    } catch (error) {
      console.error('Error booking ride:', error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Ride Details</h3>
          {price && (
            <span className="text-2xl font-bold text-purple-600">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Distance: {rideDetails.distance.toFixed(1)} km
          </p>
          <p className="text-sm text-gray-600">
            Est. Time: {Math.round(rideDetails.estimatedTime)} mins
          </p>
        </div>

        <Button
          onClick={handleBookRide}
          disabled={isBooking}
          className="w-full"
        >
          {isBooking ? (
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CarIcon className="mr-2 h-4 w-4" />
          )}
          {isBooking ? 'Confirming...' : 'Book Ride'}
        </Button>

        <p className="text-xs text-gray-500 mt-2">
          Payment will be held in escrow until ride completion
        </p>
      </div>
    </div>
  );
}