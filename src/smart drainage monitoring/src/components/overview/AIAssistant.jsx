import { Bot, Send } from "lucide-react";
import { suggestedPrompts } from "../../data/mockData";

export default function AIAssistant() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-[#e6f2f1] rounded-lg flex items-center justify-center">
          <Bot size={16} className="text-[#1a5c5a]" />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold text-gray-900">AI Assistant (Project Support)</h3>
          <p className="text-[11px] text-gray-500">Ask for summaries, risk analysis, report drafts, or suggestions.</p>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-[11px] text-gray-500 mb-2">Suggested Prompts</p>
        <div className="space-y-1.5">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              className="w-full text-left text-[12px] text-gray-600 hover:text-[#1a5c5a] hover:bg-[#e6f2f1] py-1.5 px-3 rounded-lg border border-gray-100 hover:border-[#b8ddd9] transition-colors flex items-center gap-2"
            >
              <span className="text-gray-300">›</span>
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5">
        <input
          type="text"
          placeholder="Ask something about this project..."
          className="flex-1 text-[12px] text-gray-600 placeholder-gray-400 outline-none bg-transparent"
        />
        <button className="w-7 h-7 bg-[#1a5c5a] rounded-md flex items-center justify-center text-white hover:bg-[#15524f]">
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}
