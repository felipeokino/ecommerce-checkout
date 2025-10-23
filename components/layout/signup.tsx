import { DuplicateEntryError } from "@/core/Errors/error";
import { userRepository } from "@/lib";
import { Loader2, LogIn } from "lucide-react";

import { SignupSchema, SignupValidator } from '@/validators/signup.validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from "../ui/input";


const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: SignupValidator) => {
    setLoading(true);
    setError(null);
    const uuid = crypto.randomUUID();
    try {
      await userRepository.addUser({
        email: e.email,
        password: e.password,
        name: e.name,
        id: uuid,
      });
      localStorage.setItem('user:data', JSON.stringify({ email: e.email, name: e.name, id: uuid }));
      router.replace('/products');
    } catch (error) {
      if (
        error instanceof DuplicateEntryError
      ) {
        setError(error.message);
        return;
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const form = useForm({
    resolver: zodResolver(SignupSchema)
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-md">
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <Input placeholder="Seu nome" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="seu@email.com" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <Input placeholder="••••••••" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
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
    </Form>
  );
};

export default SignUp;
