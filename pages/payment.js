/* eslint-disable */
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Side from "../components/Side";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import receiveABI from "../abis/receive.json";
import "react-toastify/dist/ReactToastify.css";
import { useAccount, useNetwork } from "wagmi";

export default function payment() {
  const router = useRouter();
  const { chain, chains } = useNetwork();
  const [toggle, setToggle] = useState(true);

  const [history, setHistory] = useState([]);

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

  const getHistory = async () => {
    const contract = await createReceiveContract();
    const hist = await contract.payHistory();
    console.log(hist);
    setHistory(hist);
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="bg">
      <div className="divider">
        {toggle ? <Side /> : null}
        <main className="home-main">
          <div className="home-header">
            <div className="home-text1">Payment Received</div>
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
          <section style={{ marginTop: "100px" }} className="home-section1">
            <table id="customers">
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Amount</th>
                  <th>Sender</th>
                  <th>Receiver</th>
                </tr>
                {history.map((item) => {
                  return (
                    <tr>
                      <td>{Number(ethers.BigNumber.from(item.id))}</td>
                      <td>
                        {Number(
                          ethers.BigNumber.from(item.amount) / 10 ** 6
                        ).toFixed(5)}{" "}
                        aUSDC
                      </td>
                      <td>{item.sender}</td>
                      <td>{item.receiver}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}
