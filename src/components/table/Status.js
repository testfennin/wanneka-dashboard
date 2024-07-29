import { Badge } from "@windmill/react-ui";

const Status = ({ status }) => {
  return (
    <>
      <span className="font-serif">
        {(status === "pending" || status === "Inactive") && (
          <Badge type="warning">{`${status?.charAt(0)?.toUpperCase()}${status?.slice(1)}`}</Badge>
        )}
        {status === "Waiting for Password Reset" && (
          <Badge type="warning">{`${status?.charAt(0)?.toUpperCase()}${status?.slice(1)}`}</Badge>
        )}
        {status === "in_progress" && <Badge>In Progress</Badge>}
        {(status === "delivered" || status === "Active") && (
          <Badge type="success">{`${status?.charAt(0)?.toUpperCase()}${status?.slice(1)}`}</Badge>
        )}
        {status === "cancelled" && <Badge type="danger">{`${status?.charAt(0)?.toUpperCase()}${status?.slice(1)}`}</Badge>}
        {status === `POS-Completed` && (
          <Badge className="dark:bg-teal-900 bg-teal-100">{`${status?.charAt(0)?.toUpperCase()}${status?.slice(1)}`}</Badge>
        )}
        {status === `returned` && (
          <Badge type="info">{`${status?.charAt(0)?.toUpperCase()}${status?.slice(1)}`}</Badge>
        )}
       
      </span>
    </>
  );
};

export default Status;
