import styled from 'styled-components'

export const AppSection = styled.div`
  height: 100vh;
  overflow-y: auto;
  &::-webkit-scrollbar{
    display: none;
  }
  margin: 0;
  border: none;
  padding: 0;
  background-color: black;
`

export const Canvas = styled.div`
touch-action: none;
`
export const HtmlFrame = styled.iframe`
    width: 1024px;
    height: 576px;
    border: none;
    background: black;
`
