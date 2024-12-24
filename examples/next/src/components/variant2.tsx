import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface Variant2Props {
  children?: ReactNode;
}

const Variant2: React.FC<Variant2Props> = ({ children = null }) => (
  <div
    data-testid="variant 2"
    className={`${styles.variant2} ${styles.example}`}
  >
    Variant 2<br />
    {children}
  </div>
);

export default Variant2;
