import * as React from 'react';
import { Variacao } from './variacao';


export default function Variacoes({ variacoes, mandarParaProduto, variacoesSelecionadas }) {


  const adicionarVariacao = (vari) => {

    const varisSelecionadas = variacoesSelecionadas;

    variacoesSelecionadas.map((v) => {
      if (v.nome === vari.nome) {
        const index = varisSelecionadas.indexOf(v);
        if (index !== -1) {
          varisSelecionadas.splice(index, 1);
        }
      }

      return null;
    })

    if (vari.opcoes.length !== 0) {
      varisSelecionadas.push(vari);
    }

    mandarParaProduto(varisSelecionadas);
  }


  return (
    <div>
      {variacoes && variacoes.map((variacao, index) => {
        return (
          <Variacao variacao={variacao} index={index} mandarParaVariacoes={adicionarVariacao} variacoesSelecionadas={variacoesSelecionadas}/>
        )
      })}
    </div>
  );
}
