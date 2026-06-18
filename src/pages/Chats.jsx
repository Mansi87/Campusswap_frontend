import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Chats() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect WebSocket
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/ws`),
      onConnect: () => {
        client.subscribe(`/topic/messages/${user.userId}`, (message) => {
          const msg = JSON.parse(message.body);
          setMessages(prev => [...prev, msg]);
          // Update conversation last message
          loadConversations();
        });
      },
    });
    client.activate();
    stompClient.current = client;

    return () => client.deactivate();
  }, [user.userId]);

  // Load conversations
  const loadConversations = async () => {
    try {
      const res = await API.get('/api/chat/conversations');
      // Group by unique conversation (productId + otherUserId)
      const grouped = {};
      res.data.forEach(msg => {
        const otherId = msg.senderId === user.userId ? msg.receiverId : msg.senderId;
        const key = `${msg.productId}_${otherId}`;
        if (!grouped[key] || new Date(msg.sentAt) > new Date(grouped[key].sentAt)) {
          grouped[key] = { ...msg, otherId };
        }
      });
      setConversations(Object.values(grouped));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Open chat from navigation (from product card)
  useEffect(() => {
    if (location.state?.productId && location.state?.sellerId) {
      openChat({
        productId: location.state.productId,
        otherId: location.state.sellerId,
      });
    }
  }, [location.state]);

  // Open a specific chat
  const openChat = async (conv) => {
    setActiveChat(conv);
    try {
      const res = await API.get(
        `/api/chat/history/${conv.productId}/${conv.otherId}`
      );
      setMessages(res.data);
      // Mark as read
      await API.put(`/api/chat/mark-read/${conv.productId}/${conv.otherId}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat || !stompClient.current) return;

    stompClient.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({
        senderId: user.userId,
        receiverId: activeChat.otherId,
        productId: activeChat.productId,
        content: newMessage.trim(),
      }),
    });
    setNewMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="flex h-[calc(100vh-120px)] gap-4 px-8 py-6 pb-24">

      {/* Conversations List */}
      <div className="w-80 flex-shrink-0 overflow-y-auto rounded-3xl bg-white p-4 shadow-lg">
        <h1 className="mb-4 text-xl font-bold text-slate-800">💬 Chats</h1>

        {conversations.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <p className="text-4xl">💬</p>
            <p className="mt-3 text-sm font-medium text-slate-700">No chats yet</p>
            <p className="text-xs text-slate-500">Chat with sellers from product cards</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv, i) => (
              <div
                key={i}
                onClick={() => openChat(conv)}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3 transition hover:bg-indigo-50 ${
                  activeChat?.productId === conv.productId &&
                  activeChat?.otherId === conv.otherId
                    ? 'bg-indigo-50 ring-1 ring-indigo-200'
                    : ''
                }`}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-brandPurple">
                  {conv.otherId?.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {conv.senderId === user.userId ? 'You' : 'Them'} • Product Chat
                  </p>
                  <p className="truncate text-xs text-slate-500">{conv.content}</p>
                </div>
                {!conv.isRead && conv.receiverId === user.userId && (
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      <div className="flex flex-1 flex-col rounded-3xl bg-white shadow-lg">
        {!activeChat ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-5xl">👈</p>
            <p className="mt-4 text-lg font-semibold text-slate-700">
              Select a conversation
            </p>
            <p className="text-sm text-slate-500">
              Or chat with a seller from a product card
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="border-b border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-brandPurple">
                  {activeChat.otherId?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Product Chat</p>
                  <p className="text-xs text-slate-500">
                    Product: {activeChat.productId?.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  No messages yet — say hello! 👋
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.senderId === user.userId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                      msg.senderId === user.userId
                        ? 'bg-gradient-to-r from-indigo-500 to-brandPurple text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      <p>{msg.content}</p>
                      <p className={`mt-1 text-[10px] ${
                        msg.senderId === user.userId
                          ? 'text-white/70'
                          : 'text-slate-400'
                      }`}>
                        {new Date(msg.sentAt).toLocaleTimeString([], {
                          hour: '2-digit', minute: '2-digit'
                        })}
                        {msg.senderId === user.userId && (
                          <span className="ml-1">
                            {msg.isRead ? '✓✓' : '✓'}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-slate-100 p-4">
              <div className="flex items-center gap-3">
                <input
  type="text"
  value={newMessage}
  onChange={(e) => setNewMessage(e.target.value)}
  onKeyDown={handleKeyDown}
  placeholder="Type a message..."
  className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none focus:border-brandPurple"
/>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-brandPurple text-white disabled:opacity-50"
                >
                  ➤
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}