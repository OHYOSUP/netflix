
  import { useEffect, useState } from "react";
  
  export function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width;
  }
export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
      // => window.innerWidth
    );
    useEffect(() => {
      // handleResize에 window.innerWidth를 넣어주는 함수
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      // window크기가 변했을 때 setWindowDimensios에 새로운 window.innerWidth를 넣어주는 이벤트
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    // widow.innerWidth가 변경되면 remount가 일어나기 때문에, dependency 입력이 필요 없음
    // return function의 형태로 eventListener를 제거해줘야 메모리 누수가 안생김
    return windowDimensions;
  }

  
