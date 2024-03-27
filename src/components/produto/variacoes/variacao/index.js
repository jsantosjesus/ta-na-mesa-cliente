
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export const Variacao = ({ variacao, index, mandarParaVariacoes, variacoesSelecionadas }) => {


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
      total: totalAdicional
    }

    mandarParaVariacoes(vari);
  }

  return (
    <Accordion key={index}>
      <AccordionSummary
        //   expandIcon={<ExpandMoreIcon />}
        aria-controls={index}
        id={index}
      >
        <b>{variacao.nome}</b> (min: {variacao.minimo}, max: {variacao.maximo})
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup> 
          {
          // eslint-disable-next-line
          variacao.opcoes.map((opcao, index) => {
            
            if (opcao.em_estoque === true) {
              return (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
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