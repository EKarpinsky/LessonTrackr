import { css } from '@emotion/react';

export const inPersonDiv = css`
  display: flex;
  flex-direction: column;;
  align-items: center;
  color: #ffffff;

  input {
    display: none;

    &:not(:checked) + label {
      background-color: #333;
      color: #fff;

      &:hover {
        background-color: #555;
      }

      &:focus {
        outline: none;
      }

      &:focus-visible {
        outline: 2px solid #333;
      }
    }

    &:checked + label {
      background-color: #fff;
      color: #333;

      &:hover {
        background-color: #ddd;

        &:focus {
          outline: none;
        }
      }

      &:active {
        background-color: #bbb;
      }
    }

    &:focus {
      outline: none;
    }
  }

  label {
    display: block;
    padding: 5px 10px;
    border: 1px solid #333;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    margin-top: 5px;
    width: 35%;


    &:focus {
      outline: none;
    }

    &:focus-visible {
      outline: 2px solid #333;
    }

    &:hover {
      background-color: #ddd;
    }
  }

  div {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
`

export const form = css`
  // a card like form with 2 columns - length and date dropdowns on the left, and student name and in person checkbox on the right
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 0 auto;
  width: 50%;
  
  //ipad max-width
  @media (max-width: 1024px) {
    width: 100%;
    grid-template-columns: 1fr;
  }

  label {
    display: block;
    // not first or 2nd of type
    &:not(:first-of-type):not(:nth-of-type(2)) {
      margin-top: 10px;

      input {
        margin-top: 5px;

        &:first-of-type {
          margin-top: 0;
        }
      }
    }

    select {
      margin-top: 5px;
      display: block;
    }

    input:not([type="radio"]), select {
      margin-top: 5px;
      display: block;
      border: 1px solid #ddd;
      border-radius: 5px;
      padding: 5px;
      width: 100%;

      &:focus {
        outline: none;
        border-color: #333;

        &::placeholder {
          color: #333;
        }
      }
    }
  }
`;
