import { collection, doc, getDoc, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FirebaseContext } from './appContext';

export const DocsContext = createContext();

export const DocsProvicer = ({ children }) => {
    const [user, setUser] = useState();
    const [mesa, setMesa] = useState();
    const [estabelecimento, setEstabelecimento] = useState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [carrinho, setCarrinho] = useState();
    const [quantidadePedidos, setQuantidadePedidos] = useState();
    const [pedidos, setPedidos] = useState();
    const [conta, setConta] = useState();
    // const [chamado, setChamado] = useState();

    const app = useContext(FirebaseContext);
    const db = getFirestore(app);


    useEffect(() => {
        const recoveredUser = localStorage.getItem('nomeDoUsuario');

        if (recoveredUser) {
            setUser(JSON.parse(recoveredUser));
        }

        setLoading(false);

    }, []);

    const getMesa = (id) => {

        onSnapshot(doc(db, "mesa", id), (doc) => {

            if (doc) {
                const dataMesa = doc.data();
                dataMesa.id = doc.id;
                setMesa(dataMesa);
                getEstabelecimento(dataMesa.estabelecimento_id);
            }
        });


    }

    const getEstabelecimento = async (id) => {
        const docRef = doc(db, "estabelecimento", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {

            const dataEstabelecimento = docSnap.data();
            dataEstabelecimento.id = docSnap.id;

            setEstabelecimento(dataEstabelecimento);

        } else {
            console.log("Sem documento");
        }
    }

    const login = (usuario) => {
        localStorage.setItem('nomeDoUsuario', JSON.stringify(usuario));
        setUser(usuario);
        navigate('/cardapio');

        if (mesa) {
            const queryConta = query(collection(db, "conta"), where("mesa_id", "==", mesa.id));
            onSnapshot(queryConta, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (!doc.data().dataPaga) {
                        const cnta = doc.data();
                        cnta.id = doc.id;
                        setConta(cnta);
                    }
                })
            });
            // getChamado();
        }
    };

    useEffect(() => {
        if (conta) {
            const q = query(collection(db, "pedido"), where("conta_id", "==", conta.id));
            onSnapshot(q, (querySnapshot) => {
                const pddos = [];
                let quantidade = 0;
                querySnapshot.forEach((doc) => {
                    const pddo = doc.data();
                    pddo.id = doc.id;
                    pddos.push(pddo);

                    if (doc.data().status === 'aguardando') {
                        quantidade++
                    }
                });

                // setQuantidadePedidos(quantidade);
                setQuantidadePedidos(quantidade);
                setPedidos(pddos);
            });
        }
        // eslint-disable-next-line
    }, [conta]);

    const apagarNome = () => {
        localStorage.removeItem('nomeDoUsuario');
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

        setCarrinho(car);
    }

    const apagarCarrinho = () => {

        setCarrinho();
    }


    return (
        <DocsContext.Provider
            value={{
                user,
                estabelecimento,
                mesa,
                getMesa,
                login,
                apagarNome,
                loading,
                carrinho,
                adicionarAoCarrinho,
                apagarCarrinho,
                quantidadePedidos,
                pedidos,
                conta,
            }}>
            {children}
        </DocsContext.Provider>
    );
};