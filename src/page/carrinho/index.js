import { useContext, useState } from "react"
import { DocsContext } from "../../contexts/docsContext"
import { FaChevronLeft } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import imagemVaziaLogo from '../../assets/ta-na-mesa-logomarca.png'
import { Link, useNavigate } from "react-router-dom";
import './carrinho.css';
import { FirebaseContext } from "../../contexts/appContext";
import { collection, getFirestore, addDoc, doc, updateDoc } from "firebase/firestore";


function Carrinho() {

    const app = useContext(FirebaseContext);
    const db = getFirestore(app);

    const navigate = useNavigate();

    const { carrinho, adicionarAoCarrinho, apagarCarrinho, mesa, user } = useContext(DocsContext);
    const [loading, setLoading] = useState(false);

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

    const createPedidoFirebase = async (agora, id) => {

        try {
            await addDoc(collection(db, "pedido"), {
                conta_id: id,
                estabelecimento_id: mesa.estabelecimento_id,
                dataPedido: agora,
                mesa: {
                    id: mesa.id,
                    numero: mesa.numero,
                    garcom: mesa.garcom_id
                },
                produtos: carrinho.produtos,
                status: 'aguardando',
                total: carrinho.total,
                usuario: user
            });
            console.log("Documento criado com sucesso!");

            apagarCarrinho();

            navigate('/cardapio');

        } catch (error) {
            console.error("Erro ao criar documento:", error);
        }
    }

    const alterarStatusMesa = async (conta_id) => {
        await updateDoc(doc(db, "mesa", mesa.id), {
            status: 'OCUPADA',
            contaAtiva: conta_id
        });
    }

    const fazerPedido = async () => {
        setLoading(true);

        const agora = new Date();

                if (mesa.contaAtiva) {
                    createPedidoFirebase(agora, mesa.contaAtiva);
                } else{
                    async function createConta() {
                        const docRef = await addDoc(collection(db, "conta"), {
                            mesa_id: mesa.id,
                            dataAberta: agora
                        });
        
                        const conta_id = docRef.id
        
                        if (conta_id) {
                            createPedidoFirebase(agora, conta_id);
                            alterarStatusMesa(conta_id);
                        }
                    }
        
        
                    createConta();
                }
            

            

        setLoading(false);
    }

    return (
        <div className="bodyCarrinho">
            <Link to='/cardapio'><p className='fecharCarrinho'><FaChevronLeft /></p></Link><h3>Carrinho</h3>
            {!loading ? <div className="produtosDoCarrinho">
                {carrinho && carrinho.produtos.map((produto, index) => {
                    return <div key={index}>
                        <div className="produtoCarrinho"
                            // onClick={() => setProdutoSelecionado(produto)}
                            key={produto}
                        >

                            <img className='produtoCarrinhoImagem' src={produto.imagem ? produto.imagem : imagemVaziaLogo} alt='imagem do produto' />
                            <div className="produtoCarrinhoInformacoes">
                                <h3>{produto.nome}</h3>
                                <div className="produtoCarrinhoDescricao" style={{ fontSize: '10px' }}>
                                    {produto.variacoes && produto.variacoes.map((variacao, index) => {
                                        return (
                                            <span key={index}>
                                                {variacao.nome}: {variacao.opcoes.map((opcao, index) => {
                                                    return (
                                                        <span key={index}>
                                                            {`${opcao.nome}, `}
                                                        </span>
                                                    )
                                                })}
                                            </span>
                                        )
                                    })}
                                </div>
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
            </div> : <p>carregando...</p>}
            <div className='footerCarrinho'>
                <div className="footerCarrinhoTotal"><p>Total</p><p>R$ {carrinho ? carrinho.total.toFixed(2).replace(".", ",") : "0,00"}</p></div>
                {carrinho && 
                carrinho.produtos && 
                carrinho.produtos.length > 0 && 
                !loading ? <button onClick={fazerPedido}>Fazer Pedido</button> : 
                <button style={{opacity: '0.5'}}>Fazer Pedido</button>}
            </div>
        </div>
    )
} export default Carrinho