import { readdir } from "fs/promises";
import { join } from "path";
import Link from "next/link";
import styles from "./styles.module.css";

interface RouteListProps {
  directory: string;
}

export default async function RouteList({ directory }: RouteListProps) {
  const fixtures = (
    await readdir(join(process.cwd(), "src", "app", directory), {
      withFileTypes: true
    })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  return (
    <ul className={styles.routeList}>
      {fixtures.map((fixture) => (
        <li key={fixture}>
          <Link href={`${directory}/${fixture}`}>
            {fixture.replaceAll("-", " ")}
          </Link>
        </li>
      ))}
    </ul>
  );
}
