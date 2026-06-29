import { permanentRedirect } from "next/navigation";

export default function HiddenKotagiriRedirect() {
  permanentRedirect("/hidden-gems");
}
