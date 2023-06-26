import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Side from "../components/Side";
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import payABI from "../abis/pay.json";
import { payAddress } from "../utils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GET_REQUEST_SENT, GET_REQUEST_RECEIVED } from "../queries";
import { subgraphQuery } from "../utils";
import { cons } from "fp-ts/lib/NonEmptyArray2v";

export default function Request() {
  const amountRef = useRef();
  const userRef = useRef();

  const amountRef2 = useRef();
  const userRef2 = useRef();

  const [sent, setSent] = useState([]);
  const [rec, setRec] = useState([]);

  const createPayContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const payContract = new ethers.Contract(payAddress, payABI, signer);
    return payContract;
  };

  const request1 = async (evt) => {
    evt.preventDefault();
    const contract = await createPayContract();
    if (amountRef.current.value === "" || userRef.current.value === "") {
      return toast.error("Please enter the complete details");
    }
    const amount = ethers.utils.parseEther(amountRef.current.value);
    const user = userRef.current.value;

    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.requestUser(user, amount);
      await tx.wait();
      amountRef.current.value = "";
      userRef.current.value = "";
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => (window.location.href = "/request"), 10000);
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

  const request2 = async (evt) => {
    evt.preventDefault();
    const contract = await createPayContract();
    if (amountRef2.current.value === "" || userRef2.current.value === "") {
      return toast.error("Please enter the complete details");
    }
    const amount = ethers.utils.parseEther(amountRef2.current.value);
    const user = userRef2.current.value;

    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.requestAddress(user, amount);
      await tx.wait();
      amountRef2.current.value = "";
      userRef2.current.value = "";
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => (window.location.href = "/request"), 10000);
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

  const acceptOrReject = async (evt, rid, status) => {
    evt.preventDefault();
    const contract = await createPayContract();
    const id = toast.loading("Transaction in progress..");
    console.log(rid);
    console.log(status);
    try {
      const tx = await contract.acceptRequestUser(rid, status);
      await tx.wait();
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => (window.location.href = "/request"), 10000);
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

  const getRequest = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const wlist = await provider.listAccounts();
    const groupList = await subgraphQuery(GET_REQUEST_SENT(String(wlist[0])));
    const data = groupList.requestUserEvents;
    setSent(data);
  };

  const getRequest2 = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const wlist = await provider.listAccounts();
    const groupList = await subgraphQuery(
      GET_REQUEST_RECEIVED(String(wlist[0]))
    );
    const data = groupList.requestUserEvents;
    console.log(data);
    setRec(data);
  };

  useEffect(() => {
    getRequest();
    getRequest2();
  }, []);

  return (
    <div className="bg">
      <div className="divider">
        <Side />
        <main className="home-main">
          <div className="home-header">
            <div className="home-text1">Request</div>
            <div className="profile">
              <ConnectButton />
            </div>
          </div>
          <section className="home-section1">
            <div className="cardflex">
              <div className="topup">
                <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                  Request by Username
                </div>
                <input
                  ref={userRef}
                  className="input"
                  placeholder="Enter username"
                />
                <input
                  ref={amountRef}
                  className="input"
                  placeholder="Enter Amount in dollars"
                />
                <button onClick={request1} className="rbut">
                  Submit
                </button>
              </div>

              <div className="topup">
                <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                  Request By Wallet Address
                </div>
                <input
                  ref={userRef2}
                  className="input"
                  placeholder="Enter Wallet Address"
                />
                <input
                  ref={amountRef2}
                  className="input"
                  placeholder="Enter Amount in dollars"
                />
                <button onClick={request2} className="rbut">
                  Submit
                </button>
              </div>
            </div>

            <div className="text3">Received Request</div>
            <table id="customers">
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Amount</th>
                  <th>Sender</th>
                  <th>Status</th>
                  <th>Accept or Reject</th>
                </tr>
                {rec.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{Number(item.amount / 10 ** 18).toFixed(5)} matic</td>
                      <td>{item.user}</td>
                      <td>
                        {item.status === "0"
                          ? "Pending"
                          : item.status === "1"
                          ? "Accepted"
                          : "Rejected"}
                      </td>
                      <td>
                        <button
                          onClick={(evt) =>
                            acceptOrReject(
                              evt,
                              Number(ethers.BigNumber.from(item.id)),
                              1
                            )
                          }
                        >
                          Accept
                        </button>
                        <button
                          onClick={(evt) =>
                            acceptOrReject(
                              evt,
                              Number(ethers.BigNumber.from(item.id)),
                              2
                            )
                          }
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="text3">Sent Requests</div>
            <table id="customers">
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Amount</th>
                  <th>Receiver</th>
                  <th>Status</th>
                </tr>
                {sent.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{Number(item.amount / 10 ** 18).toFixed(5)} matic</td>
                      <td>{item.user}</td>
                      <td>
                        {item.status === "0"
                          ? "Pending"
                          : item.status === "1"
                          ? "Accepted"
                          : "Rejected"}
                      </td>
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
