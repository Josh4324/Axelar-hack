import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import Side from "../components/Side";

export default function escrow() {
  return (
    <div className="bg">
      <div className="divider">
        <Side />
        <main className="home-main">
          <div className="home-header">
            <div className="home-text1">Escrow</div>
            <div className="profile">
              <ConnectButton />
            </div>
          </div>
          <section className="home-section1">
            <div className="topup">
              <div
                className="wcard-text2"
                style={{ marginBottom: "30px" }}
              ></div>
              <input
                className="input"
                placeholder="Enter Product or Service Name"
              />
              <input
                className="input"
                placeholder="Enter Product or Service Description"
              />

              <input className="finput" type="file" />
              <input className="input" placeholder="Enter Seller Address" />
              <input className="input" placeholder="Enter Amount " />
              <button className="rbut">Submit</button>
            </div>

            <div className="text3">Accept or Reject</div>
            <table id="customers">
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Amount</th>
                  <th>Accept or Reject</th>
                  <th>Status</th>
                </tr>
                <tr>
                  <td>Berglunds snabbköp</td>
                  <td>Christina Berglund</td>
                  <td>Sweden</td>
                  <td>Pending</td>
                </tr>
                <tr>
                  <td>Centro comercial Moctezuma</td>
                  <td>Francisco Chang</td>
                  <td>Mexico</td>
                  <td>Pending</td>
                </tr>
                <tr>
                  <td>Laughing Bacchus Winecellars</td>
                  <td>Yoshi Tannamuri</td>
                  <td>Canada</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>

            <div className="text3">Transactions</div>
            <table id="customers">
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Amount</th>
                  <th>Accept or Reject</th>
                  <th>Status</th>
                </tr>
                <tr>
                  <td>Berglunds snabbköp</td>
                  <td>Christina Berglund</td>
                  <td>Sweden</td>
                  <td>Pending</td>
                </tr>
                <tr>
                  <td>Centro comercial Moctezuma</td>
                  <td>Francisco Chang</td>
                  <td>Mexico</td>
                  <td>Pending</td>
                </tr>
                <tr>
                  <td>Laughing Bacchus Winecellars</td>
                  <td>Yoshi Tannamuri</td>
                  <td>Canada</td>
                  <td>Pending</td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}
