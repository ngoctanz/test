import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

const Page = () => {
  return redirect(`/${routing.defaultLocale}`);
};

export default Page;
