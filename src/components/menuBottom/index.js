import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import './menuBottom.css';
import { ImHome } from "react-icons/im";
import { ImCart } from "react-icons/im";
import { FaFileAlt } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { FaConciergeBell } from "react-icons/fa";
import { DocsContext } from "../../contexts/docsContext";


function MenuBottom({page}) {

    const { carrinho, quantidadePedidos } = useContext(DocsContext);
    const [quantidadeCarrinho, setQuantidadeCarrinho] = useState();

    useEffect(() => {

        if (carrinho) {

            let quantidade = 0;
            carrinho.produtos.map((produto) => {
                quantidade = quantidade + produto.quantidade;
                return null
            })

            setQuantidadeCarrinho(quantidade);
        }
    }, [carrinho]);

    return (
        <div className="bodyMenuBottom">
            <Link to='/cardapio'><p className={page === 'cardapio' && "menuBottomHome"}><ImHome /></p></Link>
            <Link to='/conta'><p><FaFileAlt /></p></Link>
            <Link to='/pedidos'><p className={page === 'pedidos' && "menuBottomHome"}>{quantidadePedidos > 0 && <span className="quantidadeCarrinho">{quantidadePedidos}</span>}<BsClock /></p></Link>
            <Link to='/carrinho' className="cartLink"><p>{quantidadeCarrinho > 0 && <span className="quantidadeCarrinho">{quantidadeCarrinho}</span>}<ImCart /></p></Link>
            <Link to='/'><p><FaConciergeBell /></p></Link>
        </div>

    );
} export default MenuBottom;