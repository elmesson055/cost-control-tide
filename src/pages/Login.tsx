import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Remove debug table listing
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .single();

      if (userError) {
        // Keep existing error handling
      }

      // Add password existence check
      if (!userData?.password) {
        console.error('Password missing in user record:', userData);
        return toast.error('Configuração de conta inválida');
      }

      // Enhanced verification logging
      console.log('Verification inputs:', {
        email: email.trim().toLowerCase(),
        passwordInput: password,
        storedHash: userData.password.substring(0, 15) + '...' // Log partial hash
      });

      const { data: isValid, error: authError } = await supabase
        .rpc('verify_password', {
          plain_password: password,
          stored_hash: userData.password
        })
        .single();

      // Detailed error logging
      if (authError) {
        console.error('Supabase RPC error:', {
          code: authError.code,
          message: authError.message,
          details: authError.details
        });
      }

      if (!isValid) {
        console.error('Password validation failed. Hash comparison:', {
          storedHashStart: userData.password.substring(0, 10),
          receivedPassword: password,
          hashResult: isValid
        });
      }

      if (authError || !isValid) {
        return toast.error('Credenciais inválidas');
      }

      // Successful login flow
      toast.success("Login realizado com sucesso!");
      navigate("/");

    } catch (error) {
      // Keep existing error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) {
          console.error('Connection test failed:', error);
          toast.error('Erro na conexão com o Supabase');
        } else {
          console.log('Connection test successful:', data);
          toast.success('Conexão com o Supabase bem-sucedida');
        }
      } catch (err) {
        console.error('Unexpected error during connection test:', err);
        toast.error('Erro inesperado na conexão com o Supabase');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-red-400">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>CONTROLE DE CUSTOS</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema de Controle de Custos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">EMAIL</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">SENHA</Label>
              <Input
                id="password"
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;