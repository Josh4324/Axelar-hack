/* eslint-disable */
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import Link from "next/link";
import Side from "../components/Side";

export default function split() {
  const [split, setSplit] = useState(true);
  return (
    <div className="bg">
      <div className="divider">
        <Side />
        <main className="home-main">
          <div className="home-header">
            <div className="home-text1">Payment Split</div>
            <div className="profile">
              <ConnectButton />
            </div>
          </div>
          <section className="home-section1">
            <div className="cardflex">
              <div className="topup mh">
                <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                  Split Detail
                </div>
                <input className="input" placeholder="Enter Name of Split" />
                <input
                  className="input"
                  placeholder="Enter Amount in dollars"
                />
                <input
                  className="input"
                  placeholder="Enter Recipient Address"
                />
                <button className="rbut">Create Split</button>
              </div>

              <div className="topup">
                <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                  Add Friends or Group to Split
                </div>

                <div className="text2">Select Friends or Group</div>

                <div>
                  <label className="text1">Friends</label>
                  <input
                    onChange={() => setSplit(true)}
                    name="list-radio"
                    type="radio"
                  />
                </div>

                <div style={{ marginBottom: "30px" }}>
                  <label className="text1">Group</label>
                  <input
                    onChange={() => setSplit(false)}
                    name="list-radio"
                    type="radio"
                  />
                </div>

                {split ? (
                  <div>
                    <input
                      className="input"
                      placeholder="Enter Wallet Address"
                    />
                    <div className="cardflex2">
                      <input
                        className="input"
                        placeholder="Enter Percent or Ratio"
                      />
                      <input
                        className="input"
                        placeholder="Enter Amount in dollars"
                      />
                    </div>
                    <button className="rbut">Add another friend</button>
                  </div>
                ) : null}

                {split === false ? (
                  <div>
                    <select style={{ marginTop: "30px" }} className="input">
                      <option>Select Group</option>
                      <option>Group 1</option>
                      <option>Group 1</option>
                      <option>Group 1</option>
                    </select>

                    <div>
                      <div>
                        <input
                          className="input"
                          placeholder="Enter Wallet Address"
                        />
                        <div className="cardflex2">
                          <input
                            className="input"
                            placeholder="Enter Percent or Ratio"
                          />
                          <input
                            className="input"
                            placeholder="Enter Amount in dollars"
                          />
                        </div>
                      </div>

                      <div>
                        <input
                          className="input"
                          placeholder="Enter Wallet Address"
                        />
                        <div className="cardflex2">
                          <input
                            className="input"
                            placeholder="Enter Percent or Ratio"
                          />
                          <input
                            className="input"
                            placeholder="Enter Amount in dollars"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
