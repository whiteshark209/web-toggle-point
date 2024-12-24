import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface Control2Props {
  children?: ReactNode;
}

const Control2: React.FC<Control2Props> = ({ children = null }) => (
  <div
    data-testid="control 2"
    className={`${styles.control} ${styles.example}`}
  >
    Control 2<br />
    {children}
  </div>
);

export default Control2;
