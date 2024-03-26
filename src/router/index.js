
import { Routes, Route, Navigate } from 'react-router-dom';
import ConfirmarMesa from '../page/confirmarMesa';
import Cardapio from '../page/cardapio';
import { DocsContext, DocsProvicer } from '../contexts/docsContext';
import { useContext } from 'react';
import Carrinho from '../page/carrinho';
import Pedidos from '../page/pedidos';
import Contas from '../page/contas';
import ChamarGarcom from '../page/chamarGarcom';

export default function Rotas() {


    const Private = ({ children }) => {

        const { loading, user, mesa, estabelecimento } = useContext(DocsContext);

        if (loading) {
            return <div>Carregando...</div>;
        }

        if (!user || !mesa || !estabelecimento) {
            return <Navigate to="/" />
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
                    path='/'
                    element={
                        <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
                            <b>Tente escanear o QR code</b>
                        </div>
                    } />
                <Route
                    exact
                    path="/cardapio"
                    element={
                        <Private>
                            <Cardapio />
                        </Private>
                    } />
                <Route
                    exact
                    path="/carrinho"
                    element={
                        <Private>
                            <Carrinho />
                        </Private>
                    } />
                <Route
                    exact
                    path="/conta"
                    element={
                        <Private>
                            <Contas />
                        </Private>
                    } />
                <Route
                    exact
                    path="/pedidos"
                    element={
                        <Private>
                            <Pedidos />
                        </Private>
                    } />
                <Route
                    exact
                    path="/chamarGarcom"
                    element={
                        <Private>
                            <ChamarGarcom />
                        </Private>
                    } />
            </Routes>
        </DocsProvicer>
    );
}