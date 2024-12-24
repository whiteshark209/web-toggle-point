import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface Control1Props {
  children?: ReactNode;
}

const Control1: React.FC<Control1Props> = ({ children = null }) => (
  <div
    data-testid="control 1"
    className={`${styles.control} ${styles.example}`}
  >
    Control 1<br />
    {children}
  </div>
);

export default Control1;
