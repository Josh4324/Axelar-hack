/* eslint-disable */
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Side from "../components/Side";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, useNetwork } from "wagmi";
import { ethers } from "ethers";
import payABI from "../abis/pay.json";
import sendABI from "../abis/send.json";
import { erc20ABI } from "wagmi";
import { payAddress } from "../utils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} from "@axelar-network/axelarjs-sdk";

export default function topup() {
  const amountRef = useRef();
  const chainRef = useRef();
  const walletRef = useRef();
  const [ch, setCh] = useState("");
  const [allowance, setAllowance] = useState(0);
  const [amm, setAmm] = useState(0);
  const [balance, setBalance] = useState(0);
  const [gas, setGasFee] = useState(0);
  const { chain, chains } = useNetwork();
  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
  const { address } = useAccount();

  const createPayContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const ch = chain.network;

    const caddress =
      ch === "bsc-testnet"
        ? "0x3C2838D7E987030ac13CDFd8BB4c280F02606058"
        : ch === "maticmum"
        ? "0x603EEc3a76D055eb41eAc107e0084B3CD17dCe8F"
        : ch === "avalanche-fuji"
        ? "0x77833B0A49FAdf056831d0e9d1DE0b625061b76E"
        : ch === "celo-alfajores"
        ? "0x539B6B676ce12D924b3e65634E5B80fC0b067Ac6"
        : "";

    const payContract = new ethers.Contract(caddress, sendABI, signer);
    return payContract;
  };

  const createUSDContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    if (!chain) {
      return toast.error("Please connect to a supported chain");
    }
    const ch = chain.network;

    const caddress =
      ch === "bsc-testnet"
        ? "0xc2fA98faB811B785b81c64Ac875b31CC9E40F9D2"
        : ch === "maticmum"
        ? "0x2c852e740B62308c46DD29B982FBb650D063Bd07"
        : ch === "avalanche-fuji"
        ? "0x57F1c63497AEe0bE305B8852b354CEc793da43bB"
        : ch === "celo-alfajores"
        ? "0x254d06f33bDc5b8ee05b2ea472107E300226659A"
        : "";
    if (caddress === "") {
      return toast.error("Please connect to a supported chain");
    }
    const usdcContract = new ethers.Contract(caddress, erc20ABI, signer);
    return usdcContract;
  };

  const topup = async (evt) => {
    evt.preventDefault();
    const contract = await createPayContract();
    if (amountRef.current.value === "") {
      return toast.error("Please enter the amount");
    }
    const ch = chain.network;

    const amount = ethers.utils.parseUnits(amountRef.current.value, 6);
    const wallet = [walletRef.current.value];
    const chainT = chainRef.current.value;

    const caddress =
      chainT === "Binance"
        ? "0x3C2838D7E987030ac13CDFd8BB4c280F02606058"
        : chainT === "Polygon"
        ? "0x603EEc3a76D055eb41eAc107e0084B3CD17dCe8F"
        : chainT === "Avalanche"
        ? "0x77833B0A49FAdf056831d0e9d1DE0b625061b76E"
        : chainT === "celo-alfajores"
        ? "0x539B6B676ce12D924b3e65634E5B80fC0b067Ac6"
        : "";

    const ch1 = chain.network;

    // Calculate how much gas to pay to Axelar to execute the transaction at the destination chain
    const gasFee = await api.estimateGasFee(
      ch1 === "bsc-testnet"
        ? EvmChain.BNBCHAIN
        : ch1 === "maticmum"
        ? EvmChain.POLYGON
        : ch1 === "avalanche-fuji"
        ? EvmChain.AVALANCHE
        : ch1 === "celo-alfajores"
        ? EvmChain.CELO
        : "",
      chainT === "Binance"
        ? EvmChain.BNBCHAIN
        : chainT === "Polygon"
        ? EvmChain.POLYGON
        : chainT === "Avalanche"
        ? EvmChain.AVALANCHE
        : chainT === "Celo"
        ? EvmChain.CELO
        : "",
      ch1 === "bsc-testnet"
        ? GasToken.BNBCHAIN
        : ch1 === "maticmum"
        ? GasToken.MATIC
        : ch1 === "avalanche-fuji"
        ? GasToken.AVAX
        : ch1 === "celo-alfajores"
        ? GasToken.CELO
        : "",
      700000,
      2
    );

    setGasFee(gasFee);
    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.sendToMany(
        chainT,
        caddress,
        wallet,
        "aUSDC",
        amount,
        {
          value: gasFee,
        }
      );

      await tx.wait();
      amountRef.current.value = "";
      walletRef.current.value = "";
      chainRef.current.value = "Select Chain";
      setGasFee(0);
      allow();

      toast.update(id, {
        render:
          "Transaction successfull, Transfer will be finanlized in few minutes",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      //setTimeout(() => (window.location.href = "/dashboard"), 5000);
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  const approve = async (evt) => {
    evt.preventDefault();
    const contract = await createUSDContract();
    const amount = ethers.utils.parseUnits(amountRef.current.value, 6);
    if (!chain) {
      return toast.error("Please connect to a supported chain");
    }
    const ch = chain.network;
    const caddress =
      ch === "bsc-testnet"
        ? "0x3C2838D7E987030ac13CDFd8BB4c280F02606058"
        : ch === "maticmum"
        ? "0x603EEc3a76D055eb41eAc107e0084B3CD17dCe8F"
        : ch === "avalanche-fuji"
        ? "0x77833B0A49FAdf056831d0e9d1DE0b625061b76E"
        : ch === "celo-alfajores"
        ? "0x539B6B676ce12D924b3e65634E5B80fC0b067Ac6"
        : "";

    if (caddress === "") {
      return toast.error("Please connect to a supported chain");
    }

    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.approve(caddress, amount);
      await tx.wait();
      toast.update(id, {
        render: "Approval successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      allow();
      const am = await contract.allowance(address, caddress);
      console.log(am / 10 ** 6);
      setAllowance(am / 10 ** 6);
      console.log(amount);
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  const allow = async () => {
    const contract = await createUSDContract();
    if (!chain) {
      return toast.error("Please connect to a supported chain");
    }
    const ch = chain.network;
    const caddress =
      ch === "bsc-testnet"
        ? "0x3C2838D7E987030ac13CDFd8BB4c280F02606058"
        : ch === "maticmum"
        ? "0x603EEc3a76D055eb41eAc107e0084B3CD17dCe8F"
        : ch === "avalanche-fuji"
        ? "0x77833B0A49FAdf056831d0e9d1DE0b625061b76E"
        : ch === "celo-alfajores"
        ? "0x539B6B676ce12D924b3e65634E5B80fC0b067Ac6"
        : "";
    if (caddress === "") {
      return toast.error("Please connect to a supported chain");
    }
    const am = await contract.allowance(address, caddress);
    const bal = await contract.balanceOf(address);
    setBalance(bal / 10 ** 6);
    setAllowance(am / 10 ** 6);
  };

  useEffect(() => {
    allow();
  }, [allowance]);

  return (
    <div className="bg">
      <div className="divider">
        <Side />
        <main className="home-main">
          <div className="home-header">
            <div className="home-text1">Send Token</div>
            <div className="profile">
              <ConnectButton />
            </div>
          </div>
          <section className="home-section1">
            <div className="topup">
              <div className="wcard-text21">
                Token Balance - {balance} aUSDC
              </div>
              <input
                ref={amountRef}
                onChange={() => setAmm(Number(amountRef.current.value))}
                className="input"
                placeholder="Enter Amount"
              />
              <input
                ref={walletRef}
                className="input"
                placeholder="Enter Wallet Address"
              />
              <select ref={chainRef} className="input">
                <option>Select Chain</option>
                <option> Polygon </option>
                <option>Avalanche</option>
                <option>Binance</option>
                <option>Celo</option>
              </select>
              <span className="text61">Gas Fee - {gas / 10 ** 18}</span>
              {allowance >= amm ? (
                <button onClick={topup} className="rbut">
                  Send
                </button>
              ) : (
                <button onClick={approve} className="rbut">
                  Approve
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
