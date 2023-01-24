import { Variants } from "framer-motion";


export const boxVariants = {
  normal: {
    scale: 1,
    borderRadius: "10px 10px 0 0",
  },
  hover: {
    scale: 1.3,
    y: -80,
    borderRadius: "5px",
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
export const infoVariants = {
  hover: {
    opacity: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "0 0 5px 5px",
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
export const SimilarBoxVariants = {
  normal: {
    scale: 1,
    borderRadius: "5px 5px 5px 5px",
  },
  hover: {
    scale: 1.3,
    y: -30,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "tween",
    },
  },
};

export const similarInfoVariants = {
  hover: {
    opacity: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "0 0 5px 5px",
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

export const arrowVariants = {
  start: { opacity: 0 },
  hover: {
    opacity: 1,
    tansition: { duration: 0.5 },
  },
};


export const rowVariants = {
  hidden: ({ width, turn }: { width: number; turn: boolean }) => ({
    x: turn ? width - 5 : -width + 5,
  }),
  visible: {
    x: 0,
  },
  exit: ({ width, turn }: { width: number; turn: boolean }) => ({
    x: turn ? -width + 5 : width - 5,
  }),
};
