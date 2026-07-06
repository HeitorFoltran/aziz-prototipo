import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Acompanhamentos from "./pages/Acompanhamentos.tsx";
import AcompanhamentoDetalhe from "./pages/AcompanhamentoDetalhe.tsx";
import Cadastros from "./pages/Cadastros.tsx";
import NovaFicha from "./pages/NovaFicha.tsx";
import EditarFicha from "./pages/EditarFicha.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/acompanhamentos" element={<Acompanhamentos />} />
          <Route path="/acompanhamentos/:id" element={<AcompanhamentoDetalhe />} />
          <Route path="/acompanhamentos/:id/editar" element={<EditarFicha />} />
          <Route path="/cadastros" element={<Cadastros />} />
          <Route path="/cadastros/nova-ficha" element={<NovaFicha />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;