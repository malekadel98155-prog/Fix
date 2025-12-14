import { ChatInterface } from "@/components/chat-interface";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Navbar } from "@/components/layout/Navbar";

export default function Chat() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 dark:opacity-100">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8 mb-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
              Fix It AI
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Intelligent problem solving assistance. 
              Describe any issue and let the AI solve it.
            </p>
          </div>

          <ChatInterface />
        </div>
      </div>
    </div>
  );
}
