import styled from "styled-components"
import {DefalutTheme} from "styled-component"

declare module "styled-components"{
  export interface DefalutTheme {
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    }
  }
}