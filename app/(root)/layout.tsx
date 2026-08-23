import Container from "@/components/global/Container";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>


      <main>
        {children}
      </main>

    </>
  );
}
