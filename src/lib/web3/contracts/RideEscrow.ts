import { ethers } from 'ethers';

export const RIDE_ESCROW_ABI = [
  "function createRide(bytes32 rideId, uint256 amount) payable",
  "function completeRide(bytes32 rideId)",
  "function cancelRide(bytes32 rideId)",
  "function releasePayment(bytes32 rideId)",
  "event RideCreated(bytes32 indexed rideId, address indexed passenger, uint256 amount)",
  "event RideCompleted(bytes32 indexed rideId)",
  "event RideCancelled(bytes32 indexed rideId)",
  "event PaymentReleased(bytes32 indexed rideId, address indexed driver)"
];

export const RIDE_ESCROW_ADDRESS = "YOUR_CONTRACT_ADDRESS";

export class RideEscrow {
  private contract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(signer: ethers.Signer) {
    this.signer = signer;
    this.contract = new ethers.Contract(RIDE_ESCROW_ADDRESS, RIDE_ESCROW_ABI, signer);
  }

  async createRide(rideId: string, amount: bigint) {
    const tx = await this.contract.createRide(
      ethers.id(rideId),
      amount,
      { value: amount }
    );
    return await tx.wait();
  }

  async completeRide(rideId: string) {
    const tx = await this.contract.completeRide(ethers.id(rideId));
    return await tx.wait();
  }

  async cancelRide(rideId: string) {
    const tx = await this.contract.cancelRide(ethers.id(rideId));
    return await tx.wait();
  }

  async releasePayment(rideId: string) {
    const tx = await this.contract.releasePayment(ethers.id(rideId));
    return await tx.wait();
  }
}