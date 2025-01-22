import {
  useState,
  useRef,
  useEffect,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { codeatom } from "@/store/atom";
import { useMutation } from "@tanstack/react-query";
import { CodeXml } from "lucide-react";
import toast from "react-hot-toast";

interface ChatMessage {
  type: "question" | "answer";
  content: string;
}

export function Geminichat() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showCodeBox, setShowCodeBox] = useState<boolean>(false);
  const [addCode, setAddCode] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const code = useRecoilValue(codeatom).code!!!;

  const genimiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || localStorage.getItem("NEXT_PUBLIC_GEMINI_API_KEY");

  const aiapi = async () => {
    const data = {
      question,
      genimiApiKey
    }
    if(addCode){
      data.question = `${code} ${question}`
    }

    setQuestion("");
    const response = await axios.post("/api/ai", data)
    return response.data;
  };

  const aiMutaion = useMutation({
    mutationFn: aiapi,
    retry: 1,
    onSuccess: (data: any) => {
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: data.message },
      ]);
    },
    onError: (error: any) => {
      // console.error(error);
      toast.error("Sorry - Something went wrong. Please try again!");
    },
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, aiMutaion.isPending]);

  async function generateAnswer(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if(!genimiApiKey){
      toast.error("Please set the Gemini API Key");
      return;
    }

    if (!question.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: question },
    ]);
    aiMutaion.mutate();
  }

  // const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   const inputValue = e.target.value;
  //   setQuestion(inputValue);
  //   if (inputValue.endsWith("/")) {
  //     setShowCodeBox(true);
  //   } else {
  //     setShowCodeBox(false);
  //   }
  // };

  return (
    <div className="min-h-screen  flex items-center justify-center">
      {!isChatOpen && (
        <Image
          src="/ai.jpg"
          alt="AI"
          width={1000}
          height={1000}
          className="absolute w-[60px] h-[60px] right-6 bottom-4 cursor-pointer transition-transform duration-300 transform hover:scale-110"
          onClick={() => setIsChatOpen(true)}
        />
      )}

      {isChatOpen && (
        <div
          className={`fixed flex flex-col rounded-2xl border border-secondary  bg-muted/50 dark:bg-card shadow-lg  w-full max-w-lg ${isMinimized ? "bottom-7 right-10 h-16" : "bottom-4 right-[1px] lg:right-6 h-[85%]"
            } transition-all duration-500`}
        >
          <header
            className={`flex justify-between text-primary-foreground items-center bg-primary text-white rounded-t-lg px-4 py-2 ${isMinimized ? "hidden" : ""
              }`}
          >
            <span className="font-bold text-lg">Online Code Compiler</span>
            <div className="flex space-x-5 text-primary-foreground">
              {/* <button
                className="text-gray-800 hover:text-gray-600 text-xl"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                _
              </button> */}
              <button
                className="text-card hover:text-gray-600 text-xl font-bold"
                onClick={() => setIsChatOpen(false)}
              >
                ✖
              </button>
            </div>
          </header>

          {!isMinimized && (
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {chatHistory.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <div className="bg-[#1a1a1a]  border border-secondary rounded-2xl shadow-inner bg-opacity-15 p-5 max-w-2xl">
                    <h2 className="text-2xl font-bold text-white">
                      Welcome to Chat
                    </h2>
                  </div>
                </div>
              ) : (
                chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${chat.type === "question" ? "text-right" : "text-left"
                      }`}
                  >
                    <div
                      className={`inline-block w-fit max-w-[80%] p-3 rounded-lg break-words overflow-auto ${chat.type === "question"
                        ? "bg-neutral-800 text-white rounded-br-none"
                        : "bg-neutral-800 text-white rounded-bl-none"
                        }`}
                    >
                      <ReactMarkdown>{chat.content}</ReactMarkdown>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {showCodeBox && (
            <div 
              className=" w-[130px] p-3 m-4 border border-secondary rounded-lg text-muted-foreground  cursor-pointer  shadow-inner bg-opacity-15"
              onClick={() => {
                setQuestion("code ");
                setShowCodeBox(false);
              }}
            >
              <div className="flex gap-4">

                <Image src="/code-svgrepo-com.svg" width={1000} height={1000} alt="icon" className="w-8 h-8" />
                <p className="text-white font-medium transition-colors hover:text-primary">Code</p>
              </div>
            </div>
          )}

          {!isMinimized && (
            <form
              onSubmit={generateAnswer}
              className="w-full bg-[#1a1a1a] bg-transparent border-t  p-4"
            >
              <div className="flex gap-2 items-center">
                <div 
                  className={`w-8 h-8 flex items-center justify-center ${addCode? "bg-primary": ""} rounded-lg cursor-pointer`}
                  onClick={() => setAddCode(!addCode)}
                >
                  <CodeXml />
                </div>
                <textarea
                  required
                  className="flex-1 w-full p-[14px] border border-secondary rounded-md resize-none overflow-auto scrollbar-hide focus:outline-none focus:ring-1 focus:ring-neutral-800 text-white"
                  value={question}
                  // onChange={handleInputChange}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setQuestion(e.target.value)
                  }
                  placeholder="Enter question..."
                  rows={1}
                  onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      generateAnswer(
                        e as unknown as FormEvent<HTMLFormElement>
                      );
                    }
                  }}
                ></textarea>
                <button
                  type="submit"
                  className={`px-3 py-[10px] bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary hover:bg-primary rounded-lg text-white font-medium transition-colors ${aiMutaion.isPending ? "cursor-not-allowed" : ""
                    }`}
                  disabled={aiMutaion.isPending}
                >
                  {aiMutaion.isPending ? "Generating..." : "Send"}
                </button>

              </div>
            </form>
          )}



          {isMinimized && (
            <div
              className="text-center p-4 text-2xl font-bold cursor-pointer"
              onClick={() => setIsMinimized(false)}
            >
              <span className="text-white text-muted-foreground font-semibold">Chat AI</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
