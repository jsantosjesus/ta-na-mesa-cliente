import { useContext } from "react";
import { DocsContext } from "../../contexts/docsContext";

function Cardapio(){
    const {estabelecimento, mesa} = useContext(DocsContext);

return(
    <>
    <p>cardapio</p>
    <p>{estabelecimento.nome}</p>
    <p>{mesa.numero}</p>
    </>
);

} export default Cardapio;
