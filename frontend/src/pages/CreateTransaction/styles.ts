import styled, {css} from 'styled-components';
import { shade } from 'polished';

interface type {
  type: string
}

export const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Title = styled.h1`
  font-weight: 500;
  font-size: 36px;
  line-height: 54px;
  color: #FFF;
  text-align: center;
`;

export const Form = styled.form<type>`
  margin-top: 40px;
  
  display: flex;
  flex-direction: column;

  input {
    padding: 20px;
    background: #454545;
    border: 0;
    border-radius: 8px;
    color: #fff;

    margin-bottom: 16px;
  }

  div{
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    width: 100%;

    & div {
      display: flex;
      justify-content: center;

      color: #fff;
      border-radius: 5px;
      padding: 15px 80px;
      margin-bottom: 40px;
      background-color: #454545;

      
    }

    #income {
        ${
          (props)=> props.type === 'income' 
          && css `background-color: #ff872c` 
        }
      }

      #outcome {
        ${
          (props)=> props.type === 'outcome' 
          && css `background-color: #ff872c` 
        }
      }
  }

  button {
    background: #ff872c;
    color: #fff;
    border-radius: 5px;
    padding: 15px 80px;
    border: 0;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#ff872c')};
    }
  }
  
`
export const Error = styled.span`
    display: block;
    color: #c53030;
    margin-top: 8px;
`
