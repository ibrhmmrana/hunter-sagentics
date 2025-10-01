import { FolderOpen } from "lucide-react";

export default function AppLists() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-sidebar-border px-6 py-3">
        <h1 className="text-lg font-semibold">Lists</h1>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <FolderOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No lists yet</p>
        </div>
      </div>
    </div>
  );
}
