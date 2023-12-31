import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Side() {
  return (
    <div className="side">
      <Link href="/">
        <div className="logo">DePay </div>
      </Link>

      <div className="nope" style={{ marginRight: "50px", marginTop: "50px" }}>
        <ConnectButton />
      </div>

      <div className="side-inner">
        <Link href="/">
          <div className="side-text">
            <div className="side-text-inner">Dashboard</div>
          </div>
        </Link>

        <Link href="/send">
          <div className="side-text">
            <div className="side-text-inner">Send</div>
          </div>
        </Link>

        <Link href="/payment">
          <div className="side-text">
            <div className="side-text-inner">Payment Link</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
