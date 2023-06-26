import Link from "next/link";

export default function Side() {
  return (
    <div className="side">
      <Link href="/dashboard">
        <div className="logo">DePay</div>
      </Link>

      <div className="side-inner">
        <Link href="/dashboard">
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
