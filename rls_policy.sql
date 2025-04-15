CREATE POLICY "Users can only create payment methods for their organization"
ON public.metodos_pagamento
FOR INSERT
WITH CHECK (
  organizacao_id IN (SELECT organizacao_id FROM public.users WHERE id = auth.uid())
);