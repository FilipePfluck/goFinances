import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import {create, color} from "@amcharts/amcharts4/core";
import {LineSeries, DateAxis, ValueAxis, XYChart, CircleBullet} from "@amcharts/amcharts4/charts";

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer, Button, Chart } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions')

      const data = response.data

      const transactionsFormatted = data.transactions.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedValue: transaction.type === "income" ? formatValue(transaction.value) : ' - ' + formatValue(transaction.value) ,
          formattedDate: new Date(transaction.created_at).toLocaleDateString('pt-br')
        })
      )

      const balanceFormatted = {
        income: formatValue(data.balance.income),
        outcome: formatValue(data.balance.outcome),
        total: formatValue(data.balance.total)
      }

      setTransactions(transactionsFormatted)
      setBalance(balanceFormatted)
    }

    loadTransactions();
  }, []);

  // Gráficos 
  useEffect(()=>{

    let chart = create("chartdiv", XYChart)

    let total
    let anteriorValue

    chart.dateFormatter.inputDateFormat = "i"
    //A linha acima faz o grafico entender o formato 2020-06-20T22:14:28.007Z 
    //mais informações em: https://www.amcharts.com/docs/v4/concepts/formatters/formatting-date-time/
    
    const chartData = transactions.map(transaction => {
      const value = transaction.type === "outcome" 
        ? -transaction.value 
        : +transaction.value

      let sum = 0

      for(
        let i=transactions.indexOf(transaction);
        i >= 0;
        i--
      ){
        const transaction = transactions[i].type === "outcome"
          ? -transactions[i].value
          : +transactions[i].value

        sum += transaction
      }

      const total = sum

      console.log(transaction.created_at)

      return ({
        "Date": transaction.created_at,
        "Balance": total
      })
    })

    chart.data = chartData

    let dateAxis = chart.xAxes.push(new DateAxis())
    dateAxis.title.text = "Data"

    let valueAxis = chart.yAxes.push(new ValueAxis())
    valueAxis.title.text = "Saldo"

    let series = chart.series.push(new LineSeries())
    
    series.dataFields.dateX = "Date"
    series.dataFields.valueY = "Balance"
    
    series.bullets.push(new CircleBullet())
    series.strokeWidth = 2
    series.stroke = color("#F6872C")
    series.fill = color("#F6872C")

    chart.stroke = color("#cdcdcd")
    chart.fill = color("#cdcdcd")
    chart.strokeWidth = 1.75

    series.name = "Saldo em função do tempo"
    series.dataFields.dateX = "Date"
    series.dataFields.valueY = "Balance"

},[transactions])

  //

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <Chart id="chartdiv" ></Chart>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} >
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>

        <Link to="/create-transaction">
          <Button>Criar transação</Button>
        </Link>
      </Container>
    </>
  );
};

export default Dashboard;
