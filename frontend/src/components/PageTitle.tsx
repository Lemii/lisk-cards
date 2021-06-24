import { Typography } from "antd";

type Props = { title: string };

export default function PageTitle({ title }: Props) {
  return (
    <Typography.Title
      level={1}
      style={{ textAlign: "center", color: "#444444" }}
      type="secondary"
    >
      {title}
    </Typography.Title>
  );
}
