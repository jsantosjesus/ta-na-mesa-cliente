import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
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
            console.log("Document data:", docSnap.data());

            const dataEstabelecimento = docSnap.data();
            dataEstabelecimento.id = docSnap.id;

            setEstabelecimento(dataEstabelecimento);

        } else {
            // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    const login = (usuario) => {
        localStorage.setItem('nomeDoUsuario', JSON.stringify(usuario));
        setUser(usuario);
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

        setCarrinho(car);
    }

    const apagarCarrinho = () => {

        setCarrinho();
    }

    return (
        <DocsContext.Provider value={{ user, estabelecimento, mesa, getMesa, login, apagarNome, loading, carrinho, adicionarAoCarrinho, apagarCarrinho }}>
            {children}
        </DocsContext.Provider>
    );
};