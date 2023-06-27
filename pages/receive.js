/* eslint-disable */
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useAccount, useNetwork } from "wagmi";
import receiveABI from "../abis/receive.json";
import { erc20ABI } from "wagmi";
import {
  AxelarQueryAPI,
  Environment,
  EvmChain,
  GasToken,
} from "@axelar-network/axelarjs-sdk";
import { useRouter } from "next/router";

export default function topup() {
  const router = useRouter();
  const amountRef = useRef();
  const { chain, chains } = useNetwork();
  const { address: addr, chain: chainT } = router.query;
  const { address } = useAccount();
  const [gas, setGasFee] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [amm, setAmm] = useState(0);
  const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

  const createReceiveContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();

    const ch = chain.network;

    const caddress =
      ch === "bsc-testnet"
        ? "0x1c79E559ab894F098881793c0479b5de6d8731c4"
        : ch === "maticmum"
        ? "0xFF8efDf68a5c0E2f5b776416FA8b087dA32808c9"
        : ch === "avalanche-fuji"
        ? "0x12ce743624ddfe6c138f48896cfd28c397554e28"
        : ch === "celo-alfajores"
        ? "0xaE6eA4945F206C22122E63Dd5387982F23121f36"
        : "";

    const receiveContract = new ethers.Contract(caddress, receiveABI, signer);
    return receiveContract;
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

  const send = async (evt) => {
    evt.preventDefault();
    const contract = await createReceiveContract();

    const amount = ethers.utils.parseUnits(amountRef.current.value, 6);

    const caddress =
      chainT === "bsc-testnet"
        ? "0x1c79E559ab894F098881793c0479b5de6d8731c4"
        : chainT === "maticmum"
        ? "0xFF8efDf68a5c0E2f5b776416FA8b087dA32808c9"
        : chainT === "avalanche-fuji"
        ? "0x12ce743624ddfe6c138f48896cfd28c397554e28"
        : chainT === "celo-alfajores"
        ? "0xaE6eA4945F206C22122E63Dd5387982F23121f36"
        : "";

    const ch1 = chain.network;

    // Calculate how much gas to pay to Axelar to execute the transaction at the destination chain
    console.log(ch1, chainT);
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
      chainT === "bsc-testnet"
        ? EvmChain.BNBCHAIN
        : chainT === "maticmum"
        ? EvmChain.POLYGON
        : chainT === "avalanche-fuji"
        ? EvmChain.AVALANCHE
        : chainT === "celo-alfajores"
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

    const rchain =
      chainT === "bsc-testnet"
        ? "Binance"
        : chainT === "maticmum"
        ? "Polygon"
        : chainT === "avalanche-fuji"
        ? "Avalanche"
        : "";

    setGasFee(gasFee);
    const id = toast.loading("Transaction in progress..");

    try {
      const tx = await contract.sendToMany(
        rchain,
        caddress,
        [addr],
        "aUSDC",
        address,
        amount,
        {
          value: gasFee,
        }
      );

      await tx.wait();
      amountRef.current.value = "";
      setGasFee(0);

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
        ? "0x1c79E559ab894F098881793c0479b5de6d8731c4"
        : ch === "maticmum"
        ? "0xFF8efDf68a5c0E2f5b776416FA8b087dA32808c9"
        : ch === "avalanche-fuji"
        ? "0x12ce743624ddfe6c138f48896cfd28c397554e28"
        : ch === "celo-alfajores"
        ? "0xaE6eA4945F206C22122E63Dd5387982F23121f36"
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
        ? "0x1c79E559ab894F098881793c0479b5de6d8731c4"
        : ch === "maticmum"
        ? "0xFF8efDf68a5c0E2f5b776416FA8b087dA32808c9"
        : ch === "avalanche-fuji"
        ? "0x12ce743624ddfe6c138f48896cfd28c397554e28"
        : ch === "celo-alfajores"
        ? "0xaE6eA4945F206C22122E63Dd5387982F23121f36"
        : "";

    if (caddress === "") {
      return toast.error("Please connect to a supported chain");
    }
    const am = await contract.allowance(address, caddress);

    setAllowance(am / 10 ** 6);
  };

  useEffect(() => {
    allow();
  }, [allowance]);
  return (
    <div className="bg">
      <main className="home-main2">
        <div className="home-header">
          <div className="home-text1">Payment Link</div>
          <div className="profile2">
            <ConnectButton />
          </div>
        </div>
        <section className="home-section1">
          <div className="reqp">
            <div className="text4">
              {" "}
              Receive Payment in aUSDC on Binance || Polygon || Celo ||
              Avalanche
            </div>
            <input className="input2" value={addr} />
            <input
              className="input2"
              value={
                chainT === "bsc-testnet"
                  ? "Binance"
                  : chainT === "maticmum"
                  ? "Polygon"
                  : chainT === "avalanche-fuji"
                  ? "Avalanche"
                  : ""
              }
            />
            <input
              ref={amountRef}
              className="input2"
              placeholder="Enter Amount"
              onChange={() => setAmm(Number(amountRef.current.value))}
            />
            <span className="text61">Gas Fee - {gas / 10 ** 18}</span>

            {allowance >= amm ? (
              <button onClick={send} className="rbut2">
                Pay
              </button>
            ) : (
              <button onClick={approve} className="rbut2">
                Approve
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
