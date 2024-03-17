import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import './menuBottom.css';
import { ImHome } from "react-icons/im";
import { ImCart } from "react-icons/im";
import { FaFileAlt } from "react-icons/fa";
import { BsClock } from "react-icons/bs";
import { FaConciergeBell } from "react-icons/fa";
import { DocsContext } from "../../contexts/docsContext";

function MenuBottom() {

    const { carrinho } = useContext(DocsContext);
    const [quantidadeCarrinho, setQuantidadeCarrinho] = useState();

    useEffect(() => {

        let recoveredCarrinho;

        if (carrinho) {
            recoveredCarrinho = carrinho;
        }
        
        if (recoveredCarrinho) {

            let quantidade = 0;
            recoveredCarrinho.produtos.map((produto) => {
                quantidade = quantidade + produto.quantidade;
                return null
            })

            setQuantidadeCarrinho(quantidade);
        }
    }, [carrinho]);

    return (
        <div className="bodyMenuBottom">
            <Link to='/cardapio'><p className="menuBottomHome"><ImHome /></p></Link>
            <Link to='/cardapio'><p><FaFileAlt /></p></Link>
            <Link to='/cardapio'><p><BsClock /></p></Link>
            <Link to='/carrinho' className="cartLink"><p>{quantidadeCarrinho > 0 && <span className="quantidadeCarrinho">{quantidadeCarrinho}</span>}<ImCart /></p></Link>
            <Link to='/'><p><FaConciergeBell /></p></Link>
        </div>

    );
} export default MenuBottom;