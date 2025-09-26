import { IoMenu } from "react-icons/io5";
import classes from "./Header.module.css";

function LowerHeader() {
  return (
    <div className={classes.lower_container}>
      <ul>
        <li className={classes.hamberger_btn}>
          <IoMenu />
          <p>All</p>
        </li>
        <li>Today's Deals</li>
        <li>Registry</li>
        <li>Gift Cards</li>
        <li>Sell</li>
      </ul>
    </div>
  );
}

export default LowerHeader;
