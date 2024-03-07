import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DocsContext = createContext();

export const DocsProvicer = ({ children }) => {
    const [user, setUser] = useState();
    const [mesa, setMesa] = useState();
    const [estabelecimento, setEstabelecimento] = useState();
      const navigate = useNavigate();
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const recoveredUser = localStorage.getItem('nomeDoUsuario');

        if (recoveredUser) {
            setUser(JSON.parse(recoveredUser));
        }

        setLoading(false);
    }, []);

    const login = (dados) => {
        localStorage.setItem('nomeDoUsuario', JSON.stringify(dados.nomeDoUsuario));
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

    return (
        <DocsContext.Provider value={{ authenticated: !!user, user, estabelecimento, mesa, login, apagarNome, loading }}>
            {children}
        </DocsContext.Provider>
    );
};