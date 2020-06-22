import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../../components/Header';

import {  Title, Container, Form, Error } from './styles';

import api from '../../services/api';

interface Transaction {
  title: string
  value: number
  type: string
  category: string
}

const CreateTransaction: React.FC = () => {
  const [inputData, setInputData] = useState({
    title: '',
    value: 0,
    category: '',
  })

  const [inputError, setInputError] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [transaction, setTransaction] = useState<Transaction | null>(null)

  const history = useHistory();

  useEffect(()=>{
    const transaction = {
      title: inputData.title,
      value: inputData.value,
      category: inputData.category,
      type: selectedType
    }

    setTransaction(transaction)
  },[inputData, selectedType])

  function handleInputChange(event: ChangeEvent<HTMLInputElement>){
    const {name, value} = event.target

    setInputData({
        ...inputData, [name]:value
    })
  }

  function handleSelectType(type: string){
    setSelectedType(type)
  }

  async function handleSubmit(event: FormEvent): Promise<void> {
    event.preventDefault()

    if(
      !transaction?.title || 
      !transaction?.category || 
      !transaction?.value ||
      !transaction?.type 
    ){
      setInputError('Preencha todos os dados')
      return
    }

    try {
      await api.post('/transactions', transaction);
      history.push('/')

      setInputError('')
    } catch (err) {
      console.log(err.response.error);
    }
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Criar uma transação</Title>

        <Form
          onSubmit={handleSubmit}
          type={selectedType}
        >
          <input 
            placeholder="Título da transação"
            name="title"
            onChange={handleInputChange}
          />
          <input 
            placeholder="Valor da transação"
            name="value"
            onChange={handleInputChange}
          />
          <input 
            placeholder="Categoria da transação"
            name="category"  
            onChange={handleInputChange}
          />

          <div>
            <div 
              id="income" 
              onClick={() => handleSelectType("income")}
            >
              Income
            </div>

            <div 
              id="outcome" 
              onClick={() => handleSelectType("outcome")}
            >
              Outcome
            </div>
          </div>

          <button>Criar</button>

          {
            !!inputError && (
              <Error>{inputError}</Error>
            )
          }
        </Form>
      </Container>
    </>
  );
};

export default CreateTransaction;