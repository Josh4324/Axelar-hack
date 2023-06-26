import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Side from "../components/Side";

export default function topup() {
  return (
    <div className="bg">
      <div className="divider">
        <Side />
        <main className="home-main">
          <div className="home-header">
            <div className="home-text1">DLottery</div>
            <div className="profile">
              <ConnectButton />
            </div>
          </div>
          <section className="home-section1">
            <div className="topup">
              <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                Enter Lottery (Winner takes all)
              </div>
              <label style={{ paddingBottom: "5px" }} className="text1">
                Fee - $1
              </label>

              <button className="rbut">Submit</button>
            </div>

            <div className="topup">
              <div className="wcard-text2" style={{ marginBottom: "30px" }}>
                Family and Friends Lottery
              </div>
              <input className="input" placeholder="Enter Prize Amount" />
              <select style={{ marginTop: "30px" }} className="input">
                <option>Select Group</option>
                <option>Group 1</option>
                <option>Group 1</option>
                <option>Group 1</option>
              </select>
              <button className="rbut">Submit</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
