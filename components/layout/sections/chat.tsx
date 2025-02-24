// components/layout/sections/chat.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Send, Star, Phone, Clock, DollarSign } from "lucide-react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface Business {
  name: string;
  rating: number;
  price: string;
  availableTime: string;
  phone: string;
}

export const ChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "How can I help you? Describe your problem and we'll fix it!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to extract business data from the message
  const extractBusinessData = (message: string): Business[] => {
    const businesses: Business[] = [];
    const lines = message.split('\n');
    let currentBusiness: Partial<Business> = {};

    for (const line of lines) {
      if (line.trim() === '') continue;
      
      if (!line.includes(':') && line.trim().length > 0) {
        // This is a business name
        if (Object.keys(currentBusiness).length > 0) {
          businesses.push(currentBusiness as Business);
          currentBusiness = {};
        }
        currentBusiness.name = line.trim();
      } else if (line.includes('Rating:')) {
        currentBusiness.rating = parseFloat(line.split(':')[1].trim().split('/')[0]);
      } else if (line.includes('Price:')) {
        currentBusiness.price = line.split(':')[1].trim();
      } else if (line.includes('Available:')) {
        currentBusiness.availableTime = line.split(':')[1].trim();
      } else if (line.includes('Phone:')) {
        currentBusiness.phone = line.split(':')[1].trim();
      }
    }

    if (Object.keys(currentBusiness).length > 0) {
      businesses.push(currentBusiness as Business);
    }

    return businesses;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const newUserMessage = {
      role: "user",
      content: inputMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage],
        }),
      });

      const data = await response.json();
      const newMessage = data.message;

      // Check if the message contains business recommendations
      if (newMessage.includes('Rating:') && newMessage.includes('Phone:')) {
        const extractedBusinesses = extractBusinessData(newMessage);
        setBusinesses(extractedBusinesses);
      } else {
        setBusinesses([]);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: newMessage,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    }

    setIsLoading(false);
  };

  const BusinessCard = ({ business }: { business: Business }) => (
    <Card className="flex-1 min-w-[250px] transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">{business.name}</CardTitle>
        <div className="flex items-center mt-2">
          <Star className="h-5 w-5 fill-primary text-primary" />
          <span className="ml-2">{business.rating}/5</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-muted-foreground">
          <DollarSign className="h-5 w-5 mr-2" />
          <span>{business.price}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Clock className="h-5 w-5 mr-2" />
          <span>{business.availableTime}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <Phone className="h-5 w-5 mr-2" />
          <span>{business.phone}</span>
        </div>
        <Button className="w-full mt-4">Contact Now</Button>
      </CardContent>
    </Card>
  );

  return (
    <section id="chat" className="container py-24 sm:py-32">
      <div className="lg:max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Fix Your Problem Now </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Having trouble with home maintenance? Describe your problem, and our AI assistant will help you find the perfect service provider in your area. We'll match you with top-rated professionals who can get the job done right.
          </p>
        </div>
        
        <Card className="p-4 h-[600px] flex flex-col bg-card">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 scroll-smooth">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "assistant" ? "text-left" : "text-right"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] md:max-w-[70%] p-3 rounded-lg ${
                    message.role === "assistant"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground ml-auto"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-left mb-4">
                <div className="inline-block max-w-[80%] md:max-w-[70%] p-3 rounded-lg bg-secondary text-secondary-foreground">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-md border border-input bg-background"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="w-10 h-10 p-2"
            >
              <Send className={`h-5 w-5 ${isLoading ? 'opacity-50' : ''}`} />
            </Button>
          </div>
        </Card>

        {businesses.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-6">Recommended Service Providers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business, index) => (
                <BusinessCard key={index} business={business} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};