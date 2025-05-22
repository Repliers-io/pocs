import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

interface ApiInputProps {
  onApiKeyChange: (apiKey: string) => void;
  className?: string;
}

export function ApiInput({ onApiKeyChange, className }: ApiInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setApiKey(newValue);
    onApiKeyChange(newValue);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor="api-key" className="text-sm font-medium">
        Repliers API Key
      </label>
      <div className="flex gap-2 items-center">
        <Input
          id="api-key"
          type={showApiKey ? "text" : "password"}
          placeholder="Enter your API key..."
          className="max-w-[300px]"
          value={apiKey}
          onChange={handleChange}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setShowApiKey(!showApiKey)}
          className="h-10 w-10"
        >
          {showApiKey ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Don't have a Repliers API key?{" "}
        <a
          href="https://repliers.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Get one here
        </a>
      </p>
    </div>
  );
}
