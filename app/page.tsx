import { MainLayout } from "@/components/layout"
import { ChatContainer } from "@/components/chat"
import { SourcesPanel } from "@/components/sources"

export default function Home() {
  return (
    <MainLayout>
      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <ChatContainer />
          <div className="hidden lg:block">
            <SourcesPanel />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
