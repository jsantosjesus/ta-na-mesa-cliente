
import { Routes, Route } from 'react-router-dom';
import ConfirmarMesa from '../page/confirmarMesa';
import Cardapio from '../page/cardapio';
import { DocsProvicer } from '../contexts/docsContext';

export default function Rotas() {


    //   const Private = ({ children, admin, login }) => {


    //     if (loading) {
    //       return <div>Carregando...</div>;
    //     }

    //     if (!login && !authenticated) {
    //       return <Navigate to="/login" />;
    //     }

    //     if (login && authenticated) {
    //       return <Navigate to="/" />;
    //     }

    //     if (admin && !user.adm) {
    //       return <Navigate to="/" />;
    //     }

    //     return children;
    //   };
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
                        <Cardapio />
                    } />
            </Routes>
        </DocsProvicer>
    );
}