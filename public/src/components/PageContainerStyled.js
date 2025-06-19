import styled from 'styled-components';

const PageContainerStyled = styled.div`
  display: flex;
  flex-direction: column; /* 让子元素垂直排列 */
  align-items: center;   /* 这是关键：让所有子元素在交叉轴（水平方向）上居中 */
  width: 100%;
  padding: 2rem 1rem; /* 给页面整体一些内边距，看起来更舒服 */
`;