import { DuplicateEntryError } from "@/core/Errors/error";
import { userRepository } from "@/lib";
import { Label } from "@radix-ui/react-label";
import { Loader2, Lock, LogIn, Mail, PersonStanding } from "lucide-react";

import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const uuid = crypto.randomUUID();
    try {
      await userRepository.addUser({
        email,
        password,
        name,
        id: uuid,
      });
      localStorage.setItem('user:data', JSON.stringify({ email, name, id: uuid }));
      router.replace('/products')
    } catch (error) {
      if (
        error instanceof DuplicateEntryError
      ) {
        setError(error.message);
        return;
      }
      console.log(error)
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <div className="relative">
            <PersonStanding className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 mt-4">
        <Button
          type="submit"
          className="w-full bg-linear-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 transition-colors"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cadastrando...
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Continuar
            </>
          )}
        </Button>
      </CardFooter>
    </form>
  );
}

export default SignUp