import { css } from "@emotion/react";

export const table = css`
  border-collapse: collapse;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  margin: 25px 0;
  font-size: 0.9em;
  min-width: 400px;
  table-layout: fixed;
  color: #ffffff;

  th, td {
    padding: 12px 15px;

    &:first-child {
      padding-left: 20px;
      @media (max-width: 768px) {
        padding-left: 10px;
      }
    }
  }

  tr {
    background-color: #333;
    border-bottom: 1px solid #dddddd;

    &:nth-of-type(even) {
      background-color: #444;
    }

    &:hover {
      background-color: #555;
    }
  }

  th {
    // background colour should be a warm dark colour with green/blue tones
    background-color: #5d7240;

    color: #ffffff;
    text-align: left;
    font-weight: bold;

    @media (max-width: 768px) {
      padding-left: 10px;
    }

    &:first-child {
      @media (max-width: 768px) {
        padding-left: 0;
      }
    }

    &:last-child {
      @media (max-width: 768px) {
        padding-right: 0;
      }
    }
  }

  td {
    text-align: left;

    @media (max-width: 768px) {
      padding-left: 10px;

      &:first-child {
        padding-left: 0;
      }
    }

    &:last-child {
      @media (max-width: 768px) {
        padding-right: 0;
      }
    }
  }

`

export const deleteCell = css`
  text-align: center;
  // style the delete button
  button {
    background-color: #f44336;
    border: none;
    color: white;
    padding: 3px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }
`
