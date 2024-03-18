import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../../contexts/appContext';
import logo from '../../assets/logomarca.png';
import './confirmarMesa.css';
import { useParams } from 'react-router-dom';
import { DocsContext } from '../../contexts/docsContext';

function ConfirmarMesa() {
    const app = useContext(FirebaseContext);
    const db = getFirestore(app);

    const { login, user } = useContext(DocsContext);

    const [mesa, setMesa] = useState();
    const [estabelecimento, setEstabelecimento] = useState();
    const [nome, setNome] = useState();
    const { id } = useParams();

    // enquanto essa merda de react não atualiza o useState, tenho que usar esse UseEffect
    useEffect(() => {
        setNome(user);
    }, [user])



    // função para pegar a mesa
    async function getMesa() {
        const docRef = doc(db, "mesa", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Adicionando o ID ao objeto de dados
            data.id = docSnap.id;
            setMesa(data)
            // chama a função que puxa o estabelecimento
            getEstabelecimento(data.estabelecimento_id);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("Erro");
        }

    }

    // função para puxar o estabelecimento
    async function getEstabelecimento(id) {
        const docRef = doc(db, "estabelecimento", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            // Adicionando o ID ao objeto de dados
            data.id = docSnap.id;
            setEstabelecimento(data);
        } else {
            // docSnap.data() will be undefined in this case
            console.log("Erro");
        }

    }

    // assim que a pagina é carregada ela já chama a função getMesa
    useEffect(() => {
        if (!mesa) {
            getMesa();
        }
    })

    //Ao confirmar, mando dados de estabelecimento, mesa e usuario para o provider
    const enviarDadosProvider = () => {
        const dados = {
            estabelecimento: estabelecimento,
            mesa: mesa,
            nomeDoUsuario: nome
        }

        login(dados)
    }


    return (
        <>
            <div className="bodyConfirmarMesa">
                <img src={logo} alt='logomarca'></img>
                <div className='form'>
                    <p className='titleInputName'><b>Como quer ser chamado?</b></p>
                    <input className='inputName' type='name' placeholder="Digite aqui" value={nome} onChange={(e) => setNome(e.target.value)} />
                    <p className='titleMesa'><b>VOCÊ ESTÁ EM</b></p>
                    <p>{estabelecimento && estabelecimento.nome}</p>
                    <p>Mesa {mesa && mesa.numero}</p>
                    {nome ? <button className='buttonConfirmarMesa' onClick={enviarDadosProvider}>Confirmar</button> : <button className='buttonConfirmarMesa' style={{ opacity: '0.7' }}>Confirmar</button>}
                </div>
            </div>
        </>
    )
} export default ConfirmarMesa;