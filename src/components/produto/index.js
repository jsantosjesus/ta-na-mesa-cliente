import { FaChevronLeft } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import imagemVaziaLogo from '../../assets/ta-na-mesa-logomarca.png';

export const Produto = ({ produto, handleClose }) => {

    const [quantidade, setQuantidade] = useState(1);

    const [subtotal, setSubtotal] = useState(0);

    const alterarQuantidade = (operador) => {
        setQuantidade(quantidade + operador);
    }

    const calcularSubtotal = () => {
        setSubtotal(produto.preco * quantidade);
    }

    const [observacoes, setObservacoes] = useState('')

    useEffect(() => {
        calcularSubtotal();
        // eslint-disable-next-line
    }, [quantidade]);



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
            preco: produto.preco,
            categoria: produto.categoria,
            observacao: observacoes,
            quantidade: quantidade
        }

        return p;


    };


    const adicionandoProdutoCarrinho = () => {
        let carrinho = JSON.parse(localStorage.getItem('carrinho'));
        let novoCarrinho = [];
        let produtoAdicionado = formulandoProduto();
        let encontrado = false;
        let textObservacao = document.getElementById("textObservacao")

        if (carrinho) {
            novoCarrinho = carrinho;
            for (let i = 0; i < novoCarrinho.length; i++) {
                if (novoCarrinho[i].id === produtoAdicionado.id && novoCarrinho[i].observacao === produtoAdicionado.observacao) {
                    novoCarrinho[i].quantidade = novoCarrinho[i].quantidade + produtoAdicionado.quantidade;
                    encontrado = true;
                    break;
                }
            }
        }
        if (!encontrado) {
            novoCarrinho.push(produtoAdicionado);
        }
        localStorage.setItem('carrinho', JSON.stringify(novoCarrinho));
        setObservacoes("");
        setQuantidade(1);
        textObservacao.value = ("");
        handleClose();

    };


    return (

        <div className='PoupupProduto'>

            <p className='fecharProdutoIndividual' onClick={handleClose}><FaChevronLeft /></p>
            {produto && <div className='poupupProdutoContent'>
                <img className='imagemProdutoIndividual' src={!produto.imagem ? imagemVaziaLogo : produto.imagem} alt='imagem do produto' />
                <h3 className='titleProdutoIndividual'>{produto.nome}</h3>
                <p className='descricaoProdutoIndividual'>{produto.descricao}</p>
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
                <div className='botaoProdutoIndividual'>
                    <p><button className='queroJa'>Quero já</button></p>
                    <p><button className='adicionarCarrinho'
                        onClick={adicionandoProdutoCarrinho}
                    >Adicionar ao Carrinho</button></p>
                </div>
            </div>
        </div>
    );
}