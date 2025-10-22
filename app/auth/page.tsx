'use client'

import Login from '@/components/layout/login';
import SignUp from '@/components/layout/signup';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [allowed, setAllowed] = useState(false);

  useLayoutEffect(() => {
    const userData = localStorage.getItem('user:data');
    if (userData) {
      redirect('/products');
    }
    setAllowed(true);
  }, [])

  if (!allowed) return null

  return (
     <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h1>
          <p className="text-slate-600">{
            mode === 'login'
              ? 'Faça login para acessar sua conta.'
              : 'Insira seus dados para criar uma nova conta.'  
          }</p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription className='text-center'>
              {mode === 'login' ? 'Entre com suas credenciais abaixo.' : 'Preencha o formulário para criar uma conta.'}
            </CardDescription>
            <CardContent>
              {mode === 'login' ? (
                <Login />
              ) : (
                <SignUp  />
              )}
              {mode === 'login' ? (
                <>
                  <p className="mt-4 text-center text-sm text-slate-600">
                    Não tem uma conta?{" "}
                    <Button
                      variant={'ghost'}
                      onClick={() => setMode('register')}
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors p-0 m-0 items-end"
                    >
                      Cadastre-se
                    </Button>
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-4 text-center text-sm text-slate-600">
                    Já tem uma conta?{" "}
                    <Button
                      variant={'ghost'}
                      onClick={() => setMode('login')}
                      className="font-semibold text-blue-600 hover:text-blue-700 transition-colors p-0 m-0 items-end"
                    >
                      Faça login
                    </Button>
                  </p>
                </>
              )}
            </CardContent>
          </CardHeader>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-500">
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade
        </p>
      </div>
    </div>
  )
}

export default Auth