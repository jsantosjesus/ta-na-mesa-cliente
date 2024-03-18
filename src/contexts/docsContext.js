import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DocsContext = createContext();

export const DocsProvicer = ({ children }) => {
    const [user, setUser] = useState();
    const [mesa, setMesa] = useState();
    const [estabelecimento, setEstabelecimento] = useState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [carrinho, setCarrinho] = useState();


    useEffect(() => {
        const recoveredUser = localStorage.getItem('nomeDoUsuario');
        const recoveredMesa = localStorage.getItem('mesa');
        const recoveredEstabelecimento = localStorage.getItem('estabelecimento');  
        const recoveredCarrinho = localStorage.getItem('carrinho');

        if (recoveredUser) {
            setUser(JSON.parse(recoveredUser));
        }

        if (recoveredMesa) {
            setMesa(JSON.parse(recoveredMesa));
        }

        if (recoveredEstabelecimento) {
            setEstabelecimento(JSON.parse(recoveredEstabelecimento));
        }

        if (recoveredCarrinho) {
            setCarrinho(JSON.parse(recoveredCarrinho));
        }

        setLoading(false);
    }, []);

    const login = (dados) => {
        localStorage.setItem('nomeDoUsuario', JSON.stringify(dados.nomeDoUsuario));
        localStorage.setItem('mesa', JSON.stringify(dados.mesa));
        localStorage.setItem('estabelecimento', JSON.stringify(dados.estabelecimento));
        setUser(dados.nomeDoUsuario);
        setEstabelecimento(dados.estabelecimento);
        setMesa(dados.mesa);
        navigate('/cardapio');
    };

    const apagarNome = () => {
        localStorage.removeItem('usuarioLogado');
        setUser(null);
        // navigate('/login');
    };

    const adicionarAoCarrinho = (produtos) => {

        let total = 0;

        produtos.map((produto) => {
            total = total + (produto.quantidade * produto.preco);
            return null
        })

        let car = {
            produtos: produtos,
            total: total,
            mesa: mesa,
            estabelecimento_id: estabelecimento.id
        }

        localStorage.setItem('carrinho', JSON.stringify(car))

        setCarrinho(car);
    }

    // const alterarQuantidadeCarrinho = (produto, operador) => {
    //     let quantidade = produto.quantidade;


    // }

    return (
        <DocsContext.Provider value={{ user, estabelecimento, mesa, login, apagarNome, loading, carrinho, adicionarAoCarrinho }}>
            {children}
        </DocsContext.Provider>
    );
};