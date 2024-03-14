import { useContext } from "react"
import { DocsContext } from "../../contexts/docsContext"
import { FaChevronLeft } from "react-icons/fa";
import imagemVaziaLogo from '../../assets/ta-na-mesa-logomarca.png'
import { Link } from "react-router-dom";

function Carrinho() {

    const { carrinho } = useContext(DocsContext);

    return (
        <>
            <Link to='/cardapio'><p className='fecharProdutoIndividual'><FaChevronLeft /></p></Link><h3>Carrinho</h3>
            <div className='produtosCardapio'>
                {carrinho && carrinho.map((produto) => {
                    return <div key={produto.id}>
                        <div className="produtos"
                            // onClick={() => setProdutoSelecionado(produto)}
                            key={produto}
                        >

                            <img className='produtoImagem' src={produto.imagem ? produto.imagem : imagemVaziaLogo} alt='imagem do produto' />
                            <div>
                                <h3>{produto.nome}</h3>
                                <p className="produtoDescricao">{produto.observacao}</p>
                                <p className='produtoPreco'>R$ {produto.preco.toFixed(2).replace(".", ",")}</p>
                                <p className='produtoPreco' style={{color: '#ff881f'}}>R$ {(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</p>
                            </div>
                        </div>
                    </div>

                }

                )
                }
            </div>
        </>
    )
} export default Carrinho