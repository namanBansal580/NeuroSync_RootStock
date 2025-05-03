import { ethers } from "ethers";
import EthereumPortalABI from "./abis/EthereumPortal.json";  // Load the contract ABI
import PolygonPortalABI from "./abis/PolygonPortal.json"; 

const ETHEREUM_PORTAL_ADDRESS = "0xYourEthereumContractAddress";
const POLYGON_PORTAL_ADDRESS = "0xYourPolygonContractAddress";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// Initialize contract instances
const ethereumPortal = new ethers.Contract(ETHEREUM_PORTAL_ADDRESS, EthereumPortalABI, signer);
const polygonPortal = new ethers.Contract(POLYGON_PORTAL_ADDRESS, PolygonPortalABI, signer);
