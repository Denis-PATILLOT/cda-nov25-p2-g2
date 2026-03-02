import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className=" flex w-fit mx-auto h-fit justify-center">
      <Image src={"/home.png"} alt="" width={120} height={100} />
      <Link href="/staff/planning" >
        <Image src={"/calendrier.png"} alt="" width={120} height={100} />
      </Link>
      <Image src={"/chat.png"} alt="" width={120} height={100} />
    </footer>
  );
}
