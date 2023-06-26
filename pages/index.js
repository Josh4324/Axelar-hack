import Link from "next/link";

export default function Home() {
  return (
    <div className="bg">
      <div className="header">
        <Link href="/">
          <div className="logo">DePay</div>
        </Link>

        <div className="inner-header">
          <a href="/dashboard" target="_blank">
            <button className="but1">Launch App</button>
          </a>
        </div>
      </div>
    </div>
  );
}
