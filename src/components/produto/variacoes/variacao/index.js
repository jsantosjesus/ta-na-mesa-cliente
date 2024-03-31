
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';



export const Variacao = ({ variacao, index, mandarParaVariacoes, variacoesSelecionadas }) => {

  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState([]);
  const [quantidadeOpcoesSelecionadas, setQuantidadeOpcoesSelecionadas] = useState(0);
  const adicionarRemoverOpcao = (valor, opcao) => {

    let op = [];
    let totalAdicional = 0;

    variacoesSelecionadas.map((vari) => {
      if (vari.nome === variacao.nome) {
        op = vari.opcoes;
        totalAdicional = vari.total;
      }

      return null;
    })

    if (valor === true) {
      op.push(opcao);
      if (opcao.valor_adicional) {
        totalAdicional = totalAdicional + opcao.valor_adicional;
      }
    } else {
      const index = op.indexOf(opcao);
      if (index !== -1) {
        op.splice(index, 1);
        if (opcao.valor_adicional) {
          totalAdicional = totalAdicional - opcao.valor_adicional;
        }
      }
    }

    let vari = {
      nome: variacao.nome,
      opcoes: op,
      total: totalAdicional,
      ...(op.length < variacao.minimo ? {satifazVariacoes: false} : {satifazVariacoes: true})
    }

    mandarParaVariacoes(vari);
    console.log(vari);
    setOpcoesSelecionadas(op);
    setQuantidadeOpcoesSelecionadas(op.length);
  }

  return (
    <Accordion key={index}>
      <AccordionSummary
        aria-controls={index}
        id={index}
      >
        <b>{variacao.nome}</b> ({quantidadeOpcoesSelecionadas < variacao.minimo ?
          <span style={{ color: 'red' }}>min: {variacao.minimo}</span> :
          <span>min: {variacao.minimo}</span>}, max: {variacao.maximo})
        {quantidadeOpcoesSelecionadas < variacao.minimo && <span style={{ color: 'red' }}>*</span>}
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {
            // eslint-disable-next-line
            variacao.opcoes.map((opcao, index) => {

              if (opcao.em_estoque === true) {

                const opcaoEstaSelecionada = opcoesSelecionadas.some((opc) => opc === opcao);
                // let opcaoDisponivel;

                // if(!opcaoEstaSelecionada && opcoesSelecionadas.length >= 2){
                //   opcaoDisponivel = true;
                // } else {
                //   opcaoDisponivel = false;
                // }

                return (
                  <FormControlLabel
                    key={index}
                    control={<Checkbox
                      disabled={!opcaoEstaSelecionada && quantidadeOpcoesSelecionadas >= variacao.maximo ? true : false}
                    />}
                    onChange={(e) => adicionarRemoverOpcao(e.target.checked, opcao)}
                    label={opcao.valor_adicional ? `${opcao.nome} (+${opcao.valor_adicional.toFixed(2).replace(".", ",")})` : opcao.nome} />

                )
              }
            })}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
}