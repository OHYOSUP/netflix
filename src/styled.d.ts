import { DefaultTheme } from "styled-component";

declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      lighter: string;
      darker: string;
    };
  }
}
