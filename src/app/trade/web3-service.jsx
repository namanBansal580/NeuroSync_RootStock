import Web3 from "web3";
import { CONTRACT_ABI } from "@/ContractABI"; // Ensure this ABI matches the NeuroSync contract

class Web3Service {
  web3 = null;
  contract = null;
  account = "";
  contract_add = "";

  constructor(chainId) {
    console.log("Chain id is:::::", chainId);

    switch (chainId) {
      case 545: // Flow Testnet
        this.contract_add = "0xdf51A63A8e636052B87a65D7591b0a1D5f89B9DA";
        break;
      case 1328: // Sei Testnet
        this.contract_add = "0xDE88fe1F4e83E086e78bb10a109e25D35cE189A9";
        break;
      case 31: // RootStock Testnet
        this.contract_add = "0x7A874416906e8152B985F793368E04D9b3c200c1";
        break;
      default:
        this.contract_add = "0xdf51A63A8e636052B87a65D7591b0a1D5f89B9DA";
    }
  }

  async initWeb3() {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        this.web3 = new Web3(window.ethereum);
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
        this.contract = new this.web3.eth.Contract(CONTRACT_ABI, this.contract_add);

        window.ethereum.on("accountsChanged", (accounts) => {
          this.account = accounts[0];
        });

        return true;
      } catch (error) {
        console.error("Error initializing Web3:", error);
        return false;
      }
    } else {
      console.error("Web3 not found. Please install MetaMask!");
      return false;
    }
  }

  async getGasOptions() {
    const latestBlock = await this.web3.eth.getBlock("latest");

    if (latestBlock.baseFeePerGas != null) {
      const priorityFee = this.web3.utils.toWei("2", "gwei");
      const baseFee = await this.web3.eth.getGasPrice();
      return {
        maxPriorityFeePerGas: priorityFee,
        maxFeePerGas: (parseInt(baseFee) + parseInt(priorityFee)).toString(),
      };
    } else {
      return {
        gasPrice: await this.web3.eth.getGasPrice(),
      };
    }
  }

  async getAccount() {
    if (!this.web3) await this.initWeb3();
    return this.account;
  }

  convertToWei(amount) {
    return this.web3.utils.toWei(amount.toString(), "ether");
  }

  convertFromWei(amount) {
    return this.web3.utils.fromWei(amount.toString(), "ether");
  }

  async payFunds(recipient, amount, tradeId) {
    if (!this.web3 || !this.contract) {
      const initialized = await this.initWeb3();
      if (!initialized) throw new Error("Web3 not initialized");
    }

    try {
      const value = this.convertToWei(amount);
      const gasOptions = await this.getGasOptions();

      const result = await this.contract.methods
        .payFunds(recipient, value, tradeId)
        .send({
          from: this.account,
          value,
          ...gasOptions,
        });

      return result;
    } catch (error) {
      console.error("Error paying funds:", error);
      throw error;
    }
  }

  async releaseFunds(sender, tradeId) {
    console.log("sender:::" + sender + " tradeId:::" + tradeId);

    if (!this.web3 || !this.contract) {
      const initialized = await this.initWeb3();
      if (!initialized) throw new Error("Web3 not initialized");
    }

    try {
      const gasOptions = await this.getGasOptions();

      const result = await this.contract.methods
        .releaseFunds(sender, tradeId)
        .send({
          from: this.account,
          ...gasOptions,
        });

      return result;
    } catch (error) {
      console.error("Error releasing funds:", error);
      throw error;
    }
  }

  async claimFunds(sender, tradeId) {
    if (!this.web3 || !this.contract) {
      const initialized = await this.initWeb3();
      if (!initialized) throw new Error("Web3 not initialized");
    }

    try {
      const gasOptions = await this.getGasOptions();

      const result = await this.contract.methods
        .claimFunds(sender, tradeId)
        .send({
          from: this.account,
          ...gasOptions,
        });

      return result;
    } catch (error) {
      console.error("Error claiming funds:", error);
      throw error;
    }
  }

  async getMyPayments() {
    if (!this.web3 || !this.contract) {
      const initialized = await this.initWeb3();
      if (!initialized) throw new Error("Web3 not initialized");
    }

    try {
      const results = await this.contract.methods
        .getAllPayments(this.account)
        .call({ from: this.account });

      return results.map((payment) => ({
        recipient: payment.rec,
        amount: this.convertFromWei(payment.amount),
        tradeId: payment.tradeId,
      }));
    } catch (error) {
      console.error("Error getting payments:", error);
      throw error;
    }
  }
}

export default Web3Service;
