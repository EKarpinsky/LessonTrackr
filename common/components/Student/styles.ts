import { css } from "@emotion/react";

export const lastLessonRow = css`
  opacity: 0;
  transform: translateY(-100%);
`;


export const studentContainer = css`
  width: 50%;
  margin: 10px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;

  @media (max-width: 1024px) {
    width: 100%;
  }
`

export const table = css`
  border-collapse: collapse;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  margin: 25px 0;
  font-size: 0.9em;
  table-layout: fixed;
  color: #ffffff;

  @media (max-width: 768px) {
    font-size: 0.8em;

    th, td {
      padding: 12px 15px;
    }
  }

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
  }

  td {
    text-align: left;
    min-width: fit-content;

    @media (max-width: 768px) {
      padding-left: 10px;
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
    cursor: pointer;

    @media (max-width: 768px) {
      padding: 3px 5px;
      width: 100%;
      font-size: 12px;
    }
  }
`
