
import AssistantList from "@/components/assistant-list";
import AssistantModal from "@/components/assistant-modal";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background" >
      <Header />
      <main className="container mx-auto px-4 py-8" >
        <AssistantList />
      </main>
      <AssistantModal />
      <DeleteConfirmationDialog />
    </div>
  );
}
