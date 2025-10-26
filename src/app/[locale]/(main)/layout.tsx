import LayoutDefault from "@/layouts/layout.default";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutDefault>{children}</LayoutDefault>;
}
