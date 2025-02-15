// GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell;
    line-height: 1.6;
    color: ${({ theme }) => theme.text};
    background-color: ${({ theme }) => theme.body};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  input, button {
    font-family: inherit;
    font-size: inherit;
  }
`;

export default GlobalStyles;
