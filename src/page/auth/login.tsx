import supabase from "@/api/service-supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { LoginSchema } from "./domain/auth";
import { useUserStore } from "./store/useUserStore";
import { toast, Toaster } from "sonner";
function LoginPage() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const onLogin: SubmitHandler<z.infer<typeof LoginSchema>> = async (
    login: z.infer<typeof LoginSchema>
  ) => {
    const {  error } = await supabase.auth.signInWithPassword({
      email: login.username,
      password: login.password,
    });
    if (error) {
      toast.error(error.message);
    }
    navigate("/admin/");
  };
  const { setUser } = useUserStore();
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        if (session) {
          setUser({
            email: session.user?.email as string,
            username: session.user?.user_metadata.username,
          });
          navigate("/admin/");
        }
      } else if (event === "SIGNED_OUT") {
        navigate("/login");
      } else if (event === "INITIAL_SESSION") {
        if (session) {
          setUser({
            email: session.user?.email as string,
            username: session.user?.user_metadata.username,
          });
          navigate("/admin/");
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const loginWithGoogle =
    async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        toast.error(error.message);
      }
      navigate("/admin/");
    } 
  return (
    <div className="flex h-screen">
      {/* Columna del formulario */}
      <Toaster position="top-right" />
      <div className="w-1/2 h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            Bienvenido a nuestra aplicación Centro de salud nuevo paraiso
          </h1>
          <p className="text-xl text-blue-600">
            Nos alegra verte de nuevo. Inicia sesión para continuar tu
            experiencia.
          </p>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center bg-background">
        <Card className="w-[350px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline" onClick={() => {
                loginWithGoogle()
              }}>Google</Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onLogin)} className="space-y-4">
                {/* Campo para Correo Electrónico */}
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="m@example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo para Contraseña */}
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="********"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Botón de Enviar */}
                <Button type="submit">Iniciar sesión</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Columna de bienvenida */}
    </div>
  );
}

export default LoginPage;
