import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheckIcon, UploadIcon } from 'lucide-react';
import { IdentityManager, UserProfile } from '@/lib/web3/identity/did';

export function DriverVerification() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleVerification = async () => {
    try {
      const identity = new IdentityManager();
      await identity.connect(window.ethereum);
      
      // Update profile with verification status
      await identity.updateProfile({
        verificationStatus: 'pending',
        driverLicense: 'uploaded', // In reality, this would be a hash or IPFS CID
      });

      const updatedProfile = await identity.getProfile();
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <ShieldCheckIcon className="h-8 w-8 text-purple-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Driver Verification</h2>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-900">Current Status</h3>
          <p className="text-gray-600 mt-1">
            {profile?.verificationStatus || 'Not verified'}
          </p>
        </div>

        <div className="border-t pt-4">
          <Button
            onClick={handleVerification}
            disabled={isUploading}
            className="w-full"
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Start Verification'}
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Your credentials will be verified on-chain using decentralized identity verification.
        </p>
      </div>
    </div>
  );
}