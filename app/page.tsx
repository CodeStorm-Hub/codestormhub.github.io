import Image from "next/image";

export default function Home() {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
      <h1>Welcome to CodeStorm Hub</h1>
      <p>Building modern tech solutions with a VS Code-inspired design.</p>
      <Image src="/CodeStorm_Hub.png" alt="CodeStorm Hub logo" width={400} height={400} />
    </main>
  );
}
