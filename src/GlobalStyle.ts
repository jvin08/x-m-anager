import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
*{
  box-sizing: border-box;
  /* border: 1px solid red; */
}
  body {
    font-family: 'Inter', sans-serif;
    background: rgb(245,245,245);
    display: flex;
    justify-content: center;
  }
  .container {
    position: absolute;
    top: 50%;
    left: 0%;
    width: 100vw;
    display: flex;
    justify-content: center;
  background: lightblue;
  cursor: url("https://uploads.codesandbox.io/uploads/user/b3e56831-8b98-4fee-b941-0e27f39883ab/Ad1_-cursor.png")
      39 39,
    auto;
}

.deck {
  position: absolute;
  width: 480px;
  height: 250px;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  
}

.deck > div {
  touch-action: none;
  width: 480px;
  height: 190px;
  
  will-change: transform;
  border-radius: 20px;
  background: rgba(173, 216, 230, 0.3);
  box-shadow: 0 12.5px 100px -10px rgba(50, 50, 73, 0.4),
    0 10px 10px -10px rgba(50, 50, 73, 0.3);
}

`;

export default GlobalStyle;
