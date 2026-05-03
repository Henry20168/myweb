"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MessageSquare, 
  Send, 
  Clock, 
  Reply,
  User,
  Inbox
} from "lucide-react";
import { ContactMessage } from "@/types/admin";

interface SupportManagementProps {
  messages: ContactMessage[];
  selectedMessage: ContactMessage | null;
  setSelectedMessage: (m: ContactMessage | null) => void;
  replyText: string;
  setReplyText: (text: string) => void;
  onSendReply: () => void;
}

export default function SupportManagement({
  messages,
  selectedMessage,
  setSelectedMessage,
  replyText,
  setReplyText,
  onSendReply
}: SupportManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = messages.filter(m => 
    m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-180px)]">
      {/* Sidebar: Message List */}
      <div className={`lg:col-span-4 flex flex-col gap-4 ${selectedMessage ? 'hidden lg:flex' : 'flex'}`}>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
          {filteredMessages.map((m) => (
            <motion.div
              layout
              key={m.id}
              onClick={() => setSelectedMessage(m)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                selectedMessage?.id === m.id 
                  ? "bg-white border-red-500 shadow-xl shadow-red-500/5 ring-1 ring-red-500" 
                  : "bg-white border-gray-100 hover:border-gray-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  m.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {m.status}
                </span>
              </div>
              <h4 className="font-black text-gray-900 truncate mb-1">{m.fullName}</h4>
              <p className="text-xs text-gray-500 truncate mb-2">{m.subject || 'No Subject'}</p>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed italic">&quot;{m.body}&quot;</p>
              
              {selectedMessage?.id === m.id && (
                <motion.div 
                  layoutId="support-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"
                />
              )}
            </motion.div>
          ))}

          {filteredMessages.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-sm font-bold text-gray-900">No messages found</h3>
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Message View & Reply */}
      <div className={`lg:col-span-8 ${!selectedMessage ? 'hidden lg:flex' : 'flex'} flex-col`}>
        <div className="bg-white h-full rounded-3xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
          {selectedMessage ? (
            <>
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-gray-50">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 -ml-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 lg:hidden"
                    >
                      <Reply size={20} className="rotate-180" />
                    </button>
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{selectedMessage.fullName}</h3>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <Clock size={14} />
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="mt-8">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Subject</h4>
                  <p className="text-lg font-bold text-gray-900">{selectedMessage.subject || 'No Subject Provided'}</p>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-8 overflow-y-auto bg-gray-50/30">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm max-w-2xl">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.body}</p>
                </div>
              </div>

              {/* Reply Area */}
              <div className="p-8 bg-white border-t border-gray-100">
                <div className="relative">
                  <textarea 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here. It will be sent via email..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-3xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 min-h-[120px] resize-none pr-20"
                  />
                  <button 
                    onClick={onSendReply}
                    disabled={!replyText.trim()}
                    className="absolute right-4 bottom-4 p-3 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-red-50 text-[var(--brand)] rounded-full flex items-center justify-center mb-6">
                <MessageSquare size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Support Inbox</h3>
              <p className="text-gray-400 text-sm max-w-xs leading-relaxed font-medium">Select a message from the list to view the conversation and send a response.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
