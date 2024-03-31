import { FaChevronLeft } from "react-icons/fa";
import React, { useState, useEffect, useContext } from "react";
import imagemVaziaLogo from '../../assets/ta-na-mesa-logomarca.png';
import Variacoes from "./variacoes";
import { DocsContext } from "../../contexts/docsContext";
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore";
import { FirebaseContext } from "../../contexts/appContext";

export const Produto = ({ produto, handleClose }) => {


    const app = useContext(FirebaseContext);
    const db = getFirestore(app);



    const { adicionarAoCarrinho, carrinho, mesa, user } = useContext(DocsContext);

    const [quantidade, setQuantidade] = useState(1);

    const [loading, setLoading] = useState(false);

    const [subtotal, setSubtotal] = useState(0);

    const [variacoesSelecionadas, setVariacoesSelecionadas] = useState([]);
    const [satifazVariacoes, setSatifazVariacoes] = useState(false);
    const [totalVariacoes, setTotalVariacoes] = useState(0);


    // espero não precisar mecher mais nisso kkkkk
    const incluirVariacoes = (varis) => {
        setVariacoesSelecionadas(varis);

        setSatifazVariacoes(true);

        
        let quantidadeVariacoesObrigatoriasSelecionadas = 0;

        let variacoesObrigatorias = [];

        produto.variacoes.map((variacao) => {
            // aqui eu defino quais são as variacoes obrigatorias e com length disso tambem  sei a quantidade delas
            if (variacao.minimo > 0) {
                variacoesObrigatorias.push(variacao.nome);
            } 
            return null
        });

        let totalPrecoVariacoesSelecionadas = 0;
        // eslint-disable-next-line
        varis.map((variacaoSelecionada) => {
            totalPrecoVariacoesSelecionadas = totalPrecoVariacoesSelecionadas + variacaoSelecionada.total;

            // toda vez que rodo o map das variacoes selecionadas mandadas pra cá, 
            // confiro se a variação selecionada é obrigatoria ou não
            variacoesObrigatorias.map((variacaoObrigatoria) => {
                if(variacaoObrigatoria === variacaoSelecionada.nome){
                    // se for obrigatoria, somo a quantidade de variaçõea obrigatorias selecionadas
                    quantidadeVariacoesObrigatoriasSelecionadas = quantidadeVariacoesObrigatoriasSelecionadas + 1;
                }

                return null
            })
        })


        // aqui eu testo se a quantidade de variações obrigatorias selecionadas 
        // é maior ou igual a quantidade de variações obrigatorias 
        if (quantidadeVariacoesObrigatoriasSelecionadas >= variacoesObrigatorias.length) {
            // se sim, testo se todas satifazem a quantidade de opções mínimas selecionadas
            if (variacoesSelecionadas.every((va) => va.satifazVariacoes === true)) {
                // se todas forem true, informo que todas as variações satisfazem a quantidade de escolha mínima 
                // e habilito os botões de pedir produto
                setSatifazVariacoes(true);
            } else {
                // se alguma for false, os botões continuam desabilitados
                setSatifazVariacoes(false);
            }
            // esse else é pra quando a quantidade de variações obrigatorias selecionadas
            // é menor que a quantidade de variações obrigatorias
        } else {
            setSatifazVariacoes(false);
        }


        setTotalVariacoes(totalPrecoVariacoesSelecionadas);
    }


    const alterarQuantidade = (operador) => {
        setQuantidade(quantidade + operador);
    }

    const calcularSubtotal = () => {
        setSubtotal((totalVariacoes + produto.preco) * quantidade);
    }

    const [observacoes, setObservacoes] = useState('');

    useEffect(() => {
        calcularSubtotal();
        // eslint-disable-next-line
    }, [quantidade, totalVariacoes]);



    const Subtotal = React.memo(({ subtotal }) => {
        return (
            <div><b>R$ {subtotal.toFixed(2).replace(".", ",")}</b></div>
        );
    });


    ;

    const formulandoProduto = () => {

        let p = {
            id: produto.id,
            ...(produto.imagem && { imagem: produto.imagem }),
            nome: produto.nome,
            preco: produto.preco + totalVariacoes,
            observacao: observacoes,
            quantidade: quantidade,
            ...(variacoesSelecionadas.length !== 0 && { variacoes: variacoesSelecionadas })
        }

        return p;


    };


    const adicionandoProdutoCarrinho = () => {
        // let carrinho = JSON.parse(localStorage.getItem('carrinho'));
        let novoCarrinho = [];
        let produtoAdicionado = formulandoProduto();
        let encontrado = false;

        if (carrinho) {
            novoCarrinho = carrinho.produtos;
            for (let i = 0; i < novoCarrinho.length; i++) {
                if (novoCarrinho[i].id === produtoAdicionado.id && novoCarrinho[i].observacao === produtoAdicionado.observacao && !produtoAdicionado.variacoes) {
                    novoCarrinho[i].quantidade = novoCarrinho[i].quantidade + produtoAdicionado.quantidade;
                    encontrado = true;
                    break;
                }
            }
        }
        if (!encontrado) {
            novoCarrinho.push(produtoAdicionado);
        }
        adicionarAoCarrinho(novoCarrinho);
        handleClose();

    };

    // quando clicar em quero já, faço um pedido com o produto

    const createPedidoFirebase = async (agora, id) => {

        try {
            await addDoc(collection(db, "pedido"), {
                conta_id: id,
                estabelecimento_id: mesa.estabelecimento_id,
                dataPedido: agora,
                mesa: {
                    id: mesa.id,
                    numero: mesa.numero
                },
                produtos: [
                    {
                        id: produto.id,
                        ...(produto.imagem && { imagem: produto.imagem }),
                        nome: produto.nome,
                        preco: produto.preco + totalVariacoes,
                        observacao: observacoes,
                        quantidade: quantidade,
                        ...(variacoesSelecionadas.length !== 0 && { variacoes: variacoesSelecionadas })
                    }
                ],
                status: 'aguardando',
                total: (produto.preco + totalVariacoes) * quantidade,
                usuario: user
            });
            console.log("Documento criado com sucesso!");

            handleClose();

        } catch (error) {
            console.error("Erro ao criar documento:", error);
        }
    }

    const alterarStatusMesa = async (conta) => {
        await updateDoc(doc(db, "mesa", mesa.id), {
            status: 'OCUPADA',
            contaAtiva: conta
        });
    }

    const fazerPedido = async () => {
        setLoading(true);

        const agora = new Date();

        if (mesa && mesa.contaAtiva) {
            createPedidoFirebase(agora, mesa.contaAtiva);
        } else {
            async function createConta() {
                const docRef = await addDoc(collection(db, "conta"), {
                    mesa_id: mesa.id,
                    dataAberta: agora
                });

                const conta_id = docRef.id

                if (conta_id) {
                    await updateDoc(doc(db, "mesa", mesa.id), {
                        contaAtiva: conta_id,
                    });
                    createPedidoFirebase(agora, conta_id);
                    alterarStatusMesa(conta_id);
                }
            }


            createConta();
        }




        setLoading(false);
    }


    return (

        <div className='PoupupProduto'>

            <p className='fecharProdutoIndividual' onClick={handleClose}><FaChevronLeft /></p>
            {produto && <div className='poupupProdutoContent'>
                <img className='imagemProdutoIndividual' src={!produto.imagem ? imagemVaziaLogo : produto.imagem} alt='imagem do produto' />
                <h3 className='titleProdutoIndividual'>{produto.nome}</h3>
                <p className='descricaoProdutoIndividual'>{produto.descricao}</p>
                {produto.variacoes && <Variacoes variacoes={produto.variacoes} mandarParaProduto={incluirVariacoes} variacoesSelecionadas={variacoesSelecionadas} />}
                <textarea id='textObservacao' onChange={e => setObservacoes(e.target.value)} placeholder='Observações' />
            </div>}
            <div className='footerProdutoIndividual'>
                <div className='PrecoProdutoIndividual'>
                    <Subtotal subtotal={subtotal} />
                    <div>
                        <button onClick={() => { if (quantidade > 1) { alterarQuantidade(-1) } }}>-</button>
                        <p>{quantidade}</p>
                        <button onClick={() => { alterarQuantidade(+1) }}>+</button>
                    </div>
                </div>
                {!loading ?
                    <>
                        {produto.variacoes && !satifazVariacoes ?
                            <div className='botaoProdutoIndividual'>
                                <p><button style={{ opacity: '0.5' }} className='queroJa'>Quero já</button></p>
                                <p><button style={{ opacity: '0.5' }} className='adicionarCarrinho'
                                >Adicionar ao Carrinho</button></p>
                            </div> :
                            <div className='botaoProdutoIndividual'>
                                <p><button className='queroJa'
                                    onClick={fazerPedido} >Quero já</button></p>
                                <p><button className='adicionarCarrinho'
                                    onClick={adicionandoProdutoCarrinho}
                                >Adicionar ao Carrinho</button></p>
                            </div>
                        }
                    </> :

                    <div className='botaoProdutoIndividual'>
                        <p><button style={{ opacity: '0.5' }} className='queroJa'>Carregando...</button></p>
                        <p><button style={{ opacity: '0.5' }} className='adicionarCarrinho'
                        >Adicionar ao Carrinho</button></p>
                    </div>}
            </div>
        </div>
    );
}