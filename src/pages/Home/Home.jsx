import React from "react";

export function Home() {
  return (
    <>
      <div className="page-header d-print-none">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">Pagína inicial</h2>
            <div className="text-secondary mt-1">Bem-vinda ao painel 👋</div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="row row-deck row-cards">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Resumo</h3>
                <div className="text-secondary">Informações referente a quantidade de alunos.</div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Resumo de Pagamentos</h3>
                <div className="text-secondary">Pago</div>
                <div className="text-secondary">Perto do vencimento</div>
                <div className="text-secondary">Vencidos</div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Gráfico de crescimento</h3>
                <div className="text-secondary">Crescimento mensal qntd aluno</div>
                <div className="text-secondary">Crescimento mensal valor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
