
import { Routes, Route } from 'react-router-dom';
import ConfirmarMesa from '../page/confirmarMesa';
import Cardapio from '../page/cardapio';
import { DocsContext, DocsProvicer } from '../contexts/docsContext';
import { useContext } from 'react';

export default function Rotas() {


    const Private = ({ children }) => {

        const { loading, user, mesa, estabelecimento } = useContext(DocsContext);

        if (loading) {
            return <div>Carregando...</div>;
        }

        if (!user || !mesa || !estabelecimento) {
            return <div>Tente escanear o QR code</div>
        }

        return children;
    };
    return (
        <DocsProvicer>
            <Routes>
                <Route
                    exact
                    path="/:id"
                    element={
                        <ConfirmarMesa />
                    } />
                <Route
                    exact
                    path="/cardapio"
                    element={
                        <Private>
                            <Cardapio />
                        </Private>
                    } />
            </Routes>
        </DocsProvicer>
    );
}