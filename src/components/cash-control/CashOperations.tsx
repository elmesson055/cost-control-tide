
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface CashOperationsProps {
  isCashOpen: boolean;
  onOpenCash: (initialAmount: number, notes: string) => void;
  onCloseCash: (notes: string) => void;
  onCashSupply: (amount: number, notes: string) => void;
  onCashWithdraw: (amount: number, notes: string) => void;
}

const CashOperations = ({ 
  isCashOpen, 
  onOpenCash, 
  onCloseCash, 
  onCashSupply, 
  onCashWithdraw 
}: CashOperationsProps) => {
  const [openAmount, setOpenAmount] = useState("");
  const [supplyAmount, setSupplyAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [notes, setNotes] = useState("");
  
  const handleOpenCash = () => {
    const amount = parseFloat(openAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Informe um valor válido para abertura do caixa");
      return;
    }
    
    onOpenCash(amount, notes);
    setOpenAmount("");
    setNotes("");
  };
  
  const handleCloseCash = () => {
    onCloseCash(notes);
    setNotes("");
  };
  
  const handleCashSupply = () => {
    const amount = parseFloat(supplyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Informe um valor válido para o suprimento");
      return;
    }
    
    onCashSupply(amount, notes);
    setSupplyAmount("");
    setNotes("");
  };
  
  const handleCashWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Informe um valor válido para a sangria");
      return;
    }
    
    onCashWithdraw(amount, notes);
    setWithdrawAmount("");
    setNotes("");
  };

  return (
    <div className="flex flex-wrap gap-3">
      {!isCashOpen ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Abrir Caixa</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Abertura de Caixa</DialogTitle>
              <DialogDescription>
                Informe o valor inicial do caixa e quaisquer observações relevantes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Valor
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="col-span-3"
                  value={openAmount}
                  onChange={(e) => setOpenAmount(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Observações
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Observações sobre a abertura do caixa"
                  className="col-span-3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleOpenCash}>Confirmar Abertura</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Fechar Caixa</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fechamento de Caixa</DialogTitle>
                <DialogDescription>
                  Confirme o fechamento do caixa. Todo o valor será contabilizado e o caixa será encerrado.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="closeNotes" className="text-right">
                    Observações
                  </Label>
                  <Textarea
                    id="closeNotes"
                    placeholder="Observações sobre o fechamento do caixa"
                    className="col-span-3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="destructive" onClick={handleCloseCash}>Confirmar Fechamento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Suprimento</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suprimento de Caixa</DialogTitle>
                <DialogDescription>
                  Informe o valor a ser adicionado ao caixa.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplyAmount" className="text-right">
                    Valor
                  </Label>
                  <Input
                    id="supplyAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    className="col-span-3"
                    value={supplyAmount}
                    onChange={(e) => setSupplyAmount(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="supplyNotes" className="text-right">
                    Observações
                  </Label>
                  <Textarea
                    id="supplyNotes"
                    placeholder="Observações sobre o suprimento"
                    className="col-span-3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCashSupply}>Confirmar Suprimento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Sangria</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sangria de Caixa</DialogTitle>
                <DialogDescription>
                  Informe o valor a ser retirado do caixa.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="withdrawAmount" className="text-right">
                    Valor
                  </Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    className="col-span-3"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="withdrawNotes" className="text-right">
                    Observações
                  </Label>
                  <Textarea
                    id="withdrawNotes"
                    placeholder="Observações sobre a sangria"
                    className="col-span-3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCashWithdraw}>Confirmar Sangria</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default CashOperations;
