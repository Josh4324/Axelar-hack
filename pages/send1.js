/* eslint-disable */
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
import { GET_GROUP } from "../queries";
import { subgraphQuery } from "../utils";

export default function send() {
  const amountRef = useRef();
  const userRef = useRef();
  const groupRef = useRef();
  const groupRef2 = useRef();

  const amountRef2 = useRef();
  const userRef2 = useRef();

  const amountRef3 = useRef();
  const amountRef4 = useRef();

  const [groupArray, setList] = useState([]);

  const createPayContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const payContract = new ethers.Contract(payAddress, payABI, signer);
    return payContract;
  };

  const send1 = async (evt) => {
    evt.preventDefault();
    const contract = await createPayContract();
    if (amountRef.current.value === "" || userRef.current.value === "") {
      return toast.error("Please enter the complete details");
    }
    const amount = ethers.utils.parseEther(amountRef.current.value);
    const user = userRef.current.value;

    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.sendToUser(user, amount);
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

  const send2 = async (evt) => {
    evt.preventDefault();
    const contract = await createPayContract();
    if (amountRef2.current.value === "" || userRef2.current.value === "") {
      return toast.error("Please enter the complete details");
    }
    const amount = ethers.utils.parseEther(amountRef2.current.value);
    const user = userRef2.current.value;

    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.sendToAddress(user, amount);
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

  const send3 = async (evt) => {
    evt.preventDefault();
    const contract = await createPayContract();
    if (amountRef3.current.value === "" || groupRef.current.value === "") {
      return toast.error("Please enter the complete details");
    }
    const amount = ethers.utils.parseEther(amountRef3.current.value);
    const gname = String(groupRef.current.value).toLowerCase();

    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.sendToGroupD(gname, amount);
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

  const send4 = async (evt) => {
    evt.preventDefault();
    const contract = await createPayContract();
    if (amountRef4.current.value === "" || groupRef2.current.value === "") {
      return toast.error("Please enter the complete details");
    }
    const amount = ethers.utils.parseEther(amountRef4.current.value);
    const gname = String(groupRef2.current.value).toLowerCase();

    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.sendToGroupM(gname, amount);
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

  const getGroup = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const wlist = await provider.listAccounts();
    const groupList = await subgraphQuery(GET_GROUP(String(wlist[0])));
    const data = groupList.groupCreations;
    setList(data);
  };

  useEffect(() => {
    getGroup();
  }, []);

  return (
    <div className="bg">
      <div className="divider">
        <Side />
        <main className="home-main">
          <div className="home-header">
            <div className="home-text1">Send</div>
            <div className="profile">
              <ConnectButton />
            </div>
          </div>
          <section className="home-section1">
            <div className="cardflex">
              <div className="topup">
                <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                  Send with Username
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
                <button onClick={send1} className="rbut">
                  Send
                </button>
              </div>

              <div className="topup">
                <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                  Send with Wallet Address
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
                <button onClick={send2} className="rbut">
                  Send
                </button>
              </div>
            </div>
          </section>
          <section className="home-section1">
            <div className="cardflex">
              <div className="topup">
                <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                  Send To Group (Dollars)
                </div>
                <select ref={groupRef} className="input">
                  <option>Select Group</option>
                  {groupArray.map((item) => {
                    return <option>{item.groupName}</option>;
                  })}
                </select>
                <input
                  ref={amountRef3}
                  className="input"
                  placeholder="Enter Amount in dollars"
                />
                <button onClick={send3} className="rbut">
                  Send
                </button>
              </div>

              <div className="topup">
                <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                  Send to Group
                </div>
                <select ref={groupRef2} className="input">
                  <option>Select Group</option>
                  {groupArray.map((item) => {
                    return <option>{item.groupName}</option>;
                  })}
                </select>
                <input
                  ref={amountRef4}
                  className="input"
                  placeholder="Enter Amount in matic"
                />
                <button onClick={send4} className="rbut">
                  Send
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
