import React, { useContext, useEffect, useState } from 'react';
import logo from '../../assets/logomarca.png';
import './confirmarMesa.css';
import { useParams } from 'react-router-dom';
import { DocsContext } from '../../contexts/docsContext';

function ConfirmarMesa() {

    const { login, user, mesa, estabelecimento, getMesa } = useContext(DocsContext);

    const [nome, setNome] = useState();
    const { id } = useParams();

    // enquanto essa merda de react não atualiza o useState, tenho que usar esse UseEffect
    useEffect(() => {
        setNome(user);
    }, [user])



    // assim que a pagina é carregada ela já chama a função getMesa
    useEffect(() => {
        getMesa(id);
        // eslint-disable-next-line
    }, [])

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
                    {nome && estabelecimento && mesa ? <button className='buttonConfirmarMesa' onClick={() => { login(nome) }}>Confirmar</button> : <button className='buttonConfirmarMesa' style={{ opacity: '0.7' }}>Confirmar</button>}
                </div>
            </div>
        </>
    )
} export default ConfirmarMesa;