import React from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <div className="header">
      <Link href="/">
        <div className="logo">InterChain Pay</div>
      </Link>

      <div className="inner-header">
        <Link href="/dashboard">
          <button className="but1">Launch App</button>
        </Link>
      </div>
    </div>
  );
}
