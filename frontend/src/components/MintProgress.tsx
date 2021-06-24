import { Progress } from "antd";
import { useEffect, useState } from "react";

type Props = {
  callback: () => void;
};

export default function MintProgress({ callback }: Props) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCount) => prevCount + 1); // <-- Change this line!
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (counter === 100) {
      console.log("done");
      callback();
    }
  }, [counter, callback]);

  return <Progress percent={counter}></Progress>;
}
