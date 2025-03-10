import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    return {
      address,
      signer,
    };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

export async function signRideRequest(signer: ethers.Signer, rideDetails: any) {
  const message = JSON.stringify(rideDetails);
  return await signer.signMessage(message);
}
