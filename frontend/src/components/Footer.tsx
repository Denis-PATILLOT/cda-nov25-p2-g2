import Image from "next/image";
import { useRouter } from "next/router";

export default function Footer() {
  const router = useRouter();

  return (
    <footer className=" flex w-fit mx-auto h-fit justify-center">
      <Image src={"/home.png"} alt="" width={120} height={100} />
      <Image src={"/calendrier.png"} alt="" width={120} height={100} />
      <Image src={"/chat.png"} alt="" width={120} height={100} />
    </footer>
  );
}
