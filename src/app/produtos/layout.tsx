import Header from '@/components/layout/Header'

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
