import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface Variant1Props {
  children?: ReactNode;
}

const Variant1: React.FC<Variant1Props> = ({ children = null }) => (
  <div
    data-testid="variant 1"
    className={`${styles.variant1} ${styles.example}`}
  >
    Variant 1<br />
    {children}
  </div>
);

export default Variant1;
