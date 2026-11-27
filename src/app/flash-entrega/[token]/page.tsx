import EntregaClient from "./EntregaClient"

export const dynamic = "force-dynamic"

export default function FlashEntregaPage({ params }: { params: { token: string } }) {
  return <EntregaClient token={params.token} />
}
