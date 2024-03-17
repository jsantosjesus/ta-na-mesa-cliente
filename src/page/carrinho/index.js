import { useContext } from "react"
import { DocsContext } from "../../contexts/docsContext"
import { FaChevronLeft } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import imagemVaziaLogo from '../../assets/ta-na-mesa-logomarca.png'
import { Link } from "react-router-dom";
import './carrinho.css';

function Carrinho() {

    const { carrinho, adicionarAoCarrinho } = useContext(DocsContext);

    const alterarQuantidadeCarrinho = (produto, index, operador) => {

        const quantidade = produto.quantidade + operador;

        const newCarrinho = [...carrinho.produtos];

        if (index !== -1) {
            // Modifica a propriedade 'value' do objeto
            newCarrinho[index] = { ...newCarrinho[index], quantidade: quantidade };
        }

        adicionarAoCarrinho(newCarrinho);
    }

    const excluirProdutoCarrinho = (index) => {
        const newCarrinho = [...carrinho.produtos];

        if (index !== -1) {
            newCarrinho.splice(index, 1);
        }

        adicionarAoCarrinho(newCarrinho);
    }

    return (
        <div className="bodyCarrinho">
            <Link to='/cardapio'><p className='fecharProdutoIndividual'><FaChevronLeft /></p></Link><h3>Carrinho</h3>
            <div className='produtosCardapio'>
                {carrinho.produtos && carrinho.produtos.map((produto, index) => {
                    return <div key={index}>
                        <div className="produtoCarrinho"
                            // onClick={() => setProdutoSelecionado(produto)}
                            key={produto}
                        >

                            <img className='produtoCarrinhoImagem' src={produto.imagem ? produto.imagem : imagemVaziaLogo} alt='imagem do produto' />
                            <div className="produtoCarrinhoInformacoes">
                                <h3>{produto.nome}</h3>
                                <p className="produtoCarrinhoDescricao">{produto.observacao}</p>
                                <div className="produtoQuantidadeCarrinho"><span onClick={() => {
                                    if (produto.quantidade > 1) {
                                        alterarQuantidadeCarrinho(produto, index, -1);
                                    }
                                }}>-</span>
                                    <p>{produto.quantidade}</p>
                                    <span onClick={() =>
                                        alterarQuantidadeCarrinho(produto, index, +1)}>+</span>
                                    <p className="produtoCarrinhoDelete"><RiDeleteBin6Line onClick={() =>
                                        excluirProdutoCarrinho(index)} /></p>
                                </div>
                                <p className='produtoCarrinhPreco'>R$ {produto.preco.toFixed(2).replace(".", ",")}</p>
                                <p className='produtoCarrinhPreco' style={{ color: '#ff881f' }}>R$ {(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</p>
                            </div>
                        </div>
                    </div>
                }

                )
                }
            </div>
            <div className='footerCarrinho'>
                <div>{carrinho.total}</div>
                    <button>Fazer Pedido</button>
            </div>
        </div>
    )
} export default Carrinho