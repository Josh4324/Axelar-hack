/* eslint-disable */
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Side from "../components/Side";
import React, { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import payABI from "../abis/pay.json";
import { payAddress } from "../utils/constant";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useNetwork } from "wagmi";
import { erc20ABI } from "wagmi";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function dashboard() {
  const { address } = useAccount();
  const { chain, chains } = useNetwork();
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [toggle, setToggle] = useState(true);

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
  }, [address]);

  return (
    <div className="bg">
      <div className="divider">
        {toggle ? <Side /> : null}

        <main className="home-main">
          <div className="home-header">
            <div className="home-text1">Dashboard</div>
            <img
              style={{
                width: "50px",
                marginTop: "50px",
              }}
              className="nope"
              src="./ham.svg"
              onClick={() => setToggle(!toggle)}
            />
            <div className="profile">
              <ConnectButton />
            </div>
          </div>
          <section className="home-section1">
            <div className="cardflex">
              <div className="cardw">
                <div className="wcard-text1">{wallet}</div>
                <div>
                  <div className="wcard-text2">
                    Balance - {balance.toFixed(5)} aUSDC
                  </div>
                </div>
              </div>
            </div>

            <div className="cardflex">
              <Link href="/send">
                <div className="wcard1">
                  <img src="./add.svg" alt="add" />
                  <div className="wcard-text4">Send</div>
                </div>
              </Link>

              <Link href="/payment">
                <div className="wcard2">
                  <img src="./add.svg" alt="add" />
                  <div className="wcard-text5">Payment Link</div>
                </div>
              </Link>
            </div>

            <CopyToClipboard
              text={`https://interchain.netlify.app/receive?address=${address}&&chain=${chain?.network}`}
            >
              <button
                onClick={() => toast.info("Payment Link copied")}
                className="but"
              >
                Copy payment link to receive payment from Binance || Polygon ||
                Avax || Celo
              </button>
            </CopyToClipboard>
          </section>
        </main>
      </div>
    </div>
  );
}
